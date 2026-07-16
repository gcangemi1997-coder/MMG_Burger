import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // RECUPERO TUTTI GLI ORDINI DAL DATABASE
  const fetchOrders = async () => {
    try {
      setError("");
      const token = localStorage.getItem("mmg_token");

      const response = await fetch("/api/admin/orders", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      // GESTISCO EVENTUALE PROBLEMA DEL SERVER
      if (!response.ok) {
        throw new Error(data.message || "Impossibile recuperare gli ordini!");
      }

      setOrders(data.orders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // FUNZIONE PER CAMBIARE STATO DELL'ORDINE
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("mmg_token");

      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, newStatus }),
      });

      const data = await response.json();

      // CONTROLLO PER EVENTUALE PROBLEMA DEL SERVER
      if (!response.ok) {
        throw new Error(
          data.message || "Impossibile aggiornare lo stato dell'ordine!",
        );
      }

      // AGGIORNO LO STATO DELL'ORDINE

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
    } catch (err) {
      alert(`Errore: ${err.message}`);
    }
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", padding: "20px" }}>
        Caricamento ordini in cucina...
      </p>
    );
  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", padding: "20px" }}>
        ⚠️ {error}
      </p>
    );

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <h2
        style={{
          borderBottom: "2px solid #333",
          paddingBottom: "10px",
          marginBottom: "25px",
        }}
      >
        👨‍🍳 DashBoard Cucina
      </h2>

      {orders.length === 0 ? (
        <p style={{ color: "#777" }}>
          Nessun ordine presente nel database al momento.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "20px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              {/* CARD ONLINE */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 5px 0" }}>
                    Ordine #{order._id.slice(-6).toUpperCase()}
                  </h3>
                  <p style={{ margin: "0", color: "#555", fontSize: "14px" }}>
                    Cliente:{" "}
                    <strong>{order.userId?.name || "Utente Ospite"}</strong> (
                    {order.userId?.email || "N/A"})
                  </p>
                </div>
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    fontSize: "14px",
                    backgroundColor:
                      order.status === "In preparazione"
                        ? "#ffeeb5"
                        : order.status === "Pronto"
                          ? "#d1e7dd"
                          : "#e2e3e5",
                    color:
                      order.status === "In preparazione"
                        ? "#664d03"
                        : order.status === "Pronto"
                          ? "#0f5132"
                          : "#41464b",
                  }}
                >
                  {order.status}
                </span>
              </div>

              {/* ELENCO BURGER ORDINATI */}
              <div
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: "10px 15px",
                  borderRadius: "6px",
                  marginBottom: "15px",
                }}
              >
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "5px 0",
                    }}
                  >
                    <span>
                      {item.quantity}x <strong>{item.name}</strong>
                    </span>
                    <span>{(item.price * item.quantity).toFixed(2)}€</span>
                  </div>
                ))}
                <div
                  style={{
                    borderTop: "1px solid #ddd",
                    marginTop: "10px",
                    paddingTop: "5px",
                    textAlign: "right",
                  }}
                >
                  <strong>
                    Totale:{" "}
                    <span style={{ color: "#ff9800", fontSize: "18px" }}>
                      {order.totalPrice.toFixed(2)}€
                    </span>
                  </strong>
                </div>
              </div>

              {/* PULSANTE CAMBIO STATO */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                {order.status === "In preparazione" && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, "Pronto")}
                    style={{
                      padding: "8px 15px",
                      backgroundColor: "#4caf50",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Manda in Consegna 📦
                  </button>
                )}
                {order.status === "Pronto" && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, "Consegnato")}
                    style={{
                      padding: "8px 15px",
                      backgroundColor: "#2196f3",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Segna come Consegnato ✅
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
