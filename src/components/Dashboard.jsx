import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate, Navigate } from "react-router-dom";

function Dashboard() {
  const { user } = useContext(AppContext);

  const role = user?.role?.toLowerCase();
  if (!user || (role !== "admin" && role !== "staff")) {
    return <Navigate to="/" replace />;
  }

  const navigate = useNavigate();

  // 1. Lo stato iniziale ora parte vuoto, in attesa dei dati veri dal database
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. CONTROLLO ACCESSO: Permettiamo l'ingresso sia allo 'staff' che all' 'admin'
  useEffect(() => {
    if (user && user.role !== "staff" && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // 3. CARICAMENTO ORDINI DAL BACKEND
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("mmg_token");
        const response = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Impossibile recuperare gli ordini");
        }

        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (error) {
        console.error("Errore nel recupero degli ordini:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 4. FUNZIONE CAMBIO STATO ORDINE (SALVA NEL DATABASE)
  const handleStatusChange = async (orderId) => {
    const currentOrder = orders.find((o) => o._id === orderId);
    if (!currentOrder) return;

    const nextStatus =
      currentOrder.status === "In preparazione" ? "Pronto" : "In preparazione";

    try {
      const token = localStorage.getItem("mmg_token");
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, newStatus: nextStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossibile aggiornare l'ordine sul server.",
        );
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: nextStatus } : order,
        ),
      );
    } catch (error) {
      console.error("Errore durante l'aggiornamento dell'ordine:", error);
      alert(error.message);
    }
  };

  // DIVISIONE ORDINI
  const pendingOrders = orders.filter((o) => o.status === "In preparazione");
  const completedOrders = orders.filter(
    (c) => c.status === "Pronto" || c.status === "Consegnato",
  );

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Caricamento comande in corso... ⏳
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <header
        style={{
          borderBottom: "2px solid #ccc",
          paddingBottom: "15px",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ margin: 0, color: "#d9534f" }}>
          👨‍🍳 Schermo Comande Cucina
        </h1>
        <p style={{ margin: "5px 0 0 0", color: "#666" }}>
          Gestione ordini in tempo reale collegata al database.
        </p>
      </header>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}
      >
        {/* COLONNA 1: IN PREPARAZIONE */}
        <div
          style={{
            backgroundColor: "#fff3cd",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #ffeba2",
          }}
        >
          <h3
            style={{
              color: "#856404",
              marginTop: 0,
              borderBottom: "1px solid #ffeba2",
              paddingBottom: "10px",
            }}
          >
            🔥 In Preparazione ({pendingOrders.length})
          </h3>
          {pendingOrders.length === 0 ? (
            <p style={{ color: "#856404" }}>
              Ottimo lavoro! Nessun ordine in coda.
            </p>
          ) : (
            pendingOrders.map((order) => (
              <div
                key={order._id}
                style={{
                  backgroundColor: "#fff",
                  padding: "15px",
                  borderRadius: "6px",
                  marginBottom: "15px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  <span>Cliente: {order.clientName || "Cliente MMG"}</span>
                  <span style={{ color: "#777" }}>
                    ⏱️{" "}
                    {order.createdAt ? order.createdAt.substring(11, 16) : ""}
                  </span>
                </div>
                <ul
                  style={{
                    margin: "0 0 15px 0",
                    paddingLeft: "20px",
                    color: "#333",
                  }}
                >
                  {order.items &&
                    order.items.map((item, idx) => (
                      <li key={idx}>
                        <strong>{item.quantity}x</strong> {item.name}
                      </li>
                    ))}
                </ul>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>
                    Totale:{" "}
                    {order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}€
                  </span>
                  <button
                    onClick={() => handleStatusChange(order._id)}
                    style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Pronto! ✓
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* COLONNA 2: ORDINI EVASI */}
        <div
          style={{
            backgroundColor: "#d4edda",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #c3e6cb",
          }}
        >
          <h3
            style={{
              color: "#155724",
              marginTop: 0,
              borderBottom: "1px solid #c3e6cb",
              paddingBottom: "10px",
            }}
          >
            📦 Completati e Consegnati ({completedOrders.length})
          </h3>
          {completedOrders.length === 0 ? (
            <p style={{ color: "#155724" }}>
              Ancora nessun ordine evaso in questo turno.
            </p>
          ) : (
            completedOrders.map((order) => (
              <div
                key={order._id}
                style={{
                  backgroundColor: "#fff",
                  padding: "15px",
                  borderRadius: "6px",
                  marginBottom: "15px",
                  opacity: 0.8,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                    marginBottom: "5px",
                    color: "#555",
                  }}
                >
                  <span>{order.clientName || "Cliente MMG"}</span>
                  <span style={{ textDecoration: "line-through" }}>
                    {order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}€
                  </span>
                </div>
                <button
                  onClick={() => handleStatusChange(order._id)}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Ripristina in coda
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
