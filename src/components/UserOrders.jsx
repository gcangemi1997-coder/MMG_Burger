import React, { useState, useEffect } from "react";
// 🌟 PASSO 1: IMPORTA IL COMPONENTE DI TRANSIZIONE
import PageTransition from "./PageTransition.jsx";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const token = localStorage.getItem("mmg_token");
        if (!token) {
          setError("Devi effettuare il login per vedere i tuoi ordini.");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/orders/my-orders", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.message || "Errore nel caricamento degli ordini.");
        }
      } catch (err) {
        setError("Errore di connessione al server.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  // 🌟 PASSO 2: FUNZIONE DINAMICA PER ASSEGNARE LE CLASSI BOOTSTRAP AGLI STATI
  const getStatusBadgeClass = (status) => {
    const normalizedStatus = status?.toLowerCase();

    switch (normalizedStatus) {
      case "in preparazione":
        return "bg-warning text-dark";
      case "pronto":
      case "in consegna":
        return "bg-info text-dark";
      case "consegnato":
        return "bg-success text-white";
      default:
        return "bg-secondary text-white";
    }
  };

  if (loading)
    return <div className="text-center p-5">Caricamento in corso... ⏳</div>;
  if (error)
    return <div className="alert alert-danger text-center m-4">{error}</div>;

  return (
    // 🌟 PASSO 3: AVVOLGIAMO TUTTO NELLA TRANSIZIONE DI PAGINA
    <PageTransition>
      <div className="container-fluid my-5 px-4">
        <h2 className="mb-4 text-center fw-bold">I Miei Ordini 🍔</h2>

        {orders.length === 0 ? (
          <div className="text-center p-5 bg-light rounded shadow-sm">
            <p className="fs-4 text-muted">
              Non hai ancora effettuato nessun ordine!
            </p>
            <a href="/" className="btn btn-warning fw-bold px-4">
              Ordina un Burger Ora
            </a>
          </div>
        ) : (
          <div className="table-responsive bg-white shadow-sm rounded">
            <table
              className="table table-hover align-middle mb-0 text-center w-100"
              style={{ tableLayout: "fixed" }}
            >
              <thead className="table-dark">
                <tr>
                  <th scope="col" style={{ width: "25%" }}>
                    Riepilogo
                  </th>
                  <th scope="col" style={{ width: "25%" }}>
                    Data
                  </th>
                  <th scope="col" style={{ width: "25%" }}>
                    Totale
                  </th>
                  <th scope="col" style={{ width: "25%" }}>
                    Stato
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    {/* COLONNA 1: RIEPILOGO CENTRATO */}
                    <td
                      className="text-center"
                      style={{
                        border: "2px solid #000000",
                        borderRadius: "12px",
                      }}
                    >
                      <div className="d-flex flex-column align-items-center justify-content-center">
                        <ul className="list-unstyled mb-0 text-center">
                          {order.items.map((item, index) => (
                            <li key={index} className="text-muted small my-1">
                              <strong className="text-dark">{item.name}</strong>{" "}
                              <span className="badge bg-light text-dark border ms-1">
                                x{item.quantity}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>

                    {/* COLONNA 2: DATA CENTRATA */}
                    <td
                      className="text-center"
                      style={{
                        border: "2px solid #000000",
                        borderRadius: "12px",
                      }}
                    >
                      <span
                        className="fw-semibold d-block"
                        style={{
                          minWidth: "140px",
                          display: "flex",
                          textAlign: "center",
                          justifyContent: "center",
                        }}
                      >
                        {new Date(order.createdAt).toLocaleDateString("it-IT")}
                      </span>
                      <div
                        className="text-muted xsmall"
                        style={{
                          fontSize: "0.8rem",
                          minWidth: "140px",
                          display: "flex",
                          textAlign: "center",
                          justifyContent: "center",
                        }}
                      >
                        {new Date(order.createdAt).toLocaleTimeString("it-IT", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>

                    {/* COLONNA 3: TOTALE CENTRATO */}
                    <td
                      className="text-center"
                      style={{
                        border: "2px solid #000000",
                        borderRadius: "12px",
                      }}
                    >
                      <span
                        className="fw-bold text-success fs-5 d-block"
                        style={{
                          minWidth: "140px",
                          display: "flex",
                          textAlign: "center",
                          justifyContent: "center",
                        }}
                      >
                        €{order.totalPrice.toFixed(2)}
                      </span>
                    </td>

                    {/* COLONNA 4: STATO CENTRATO RIGENERATO CON LE NUOVE CLASSI */}
                    <td
                      className="text-center"
                      style={{
                        border: "2px solid #000000",
                        borderRadius: "12px",
                      }}
                    >
                      <div className="d-flex justify-content-center align-items-center">
                        <span
                          className={`badge px-3 py-2 fs-6 fw-semibold d-inline-block ${getStatusBadgeClass(
                            order.status,
                          )}`}
                          style={{
                            minWidth: "140px",
                            display: "flex",
                            textAlign: "center",
                            justifyContent: "center",
                          }}
                        >
                          {order.status || "Ricevuto"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
