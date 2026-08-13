import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { Link } from "react-router-dom";
import PageTransition from "./PageTransition.jsx";

function Home() {
  const { addToCart, removeFromCart, user, cart, products, loadingProducts } =
    useContext(AppContext);
  const [addedProductId, setAddedProductId] = useState(null);

  // 🌟 1. STATO PER GESTIRE IL SOBBALZO DEL CARRELLO
  const [isBouncing, setIsBouncing] = useState(false);

  // FUNZIONE INTERCETTATRICE DEL CLICK DI AGGIUNTA
  const handleOrderClick = (burger) => {
    addToCart(burger);
    setAddedProductId(burger._id);

    // 🌟 2. ATTIVIAMO IL SOBBALZO DEL CARRELLO
    setIsBouncing(true);

    setTimeout(() => {
      setAddedProductId(null);
    }, 2000);

    // Spegniamo l'animazione dopo 300ms (la durata del movimento)
    setTimeout(() => {
      setIsBouncing(false);
    }, 300);
  };

  const currentUserRole = user?.role?.toLowerCase();
  const isBuyer =
    !user || (currentUserRole !== "admin" && currentUserRole !== "staff");

  const cartTotal = cart
    ? cart.reduce((total, item) => total + item.price * item.quantity, 0)
    : 0;

  if (loadingProducts) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px",
          fontSize: "20px",
          color: "#555",
        }}
      >
        Caricamento del delizioso menu MMG... ⏳🍔
      </div>
    );
  }

  return (
    <PageTransition>
      {/* 🌟 3. INIETTIAMO L'ANIMAZIONE DEL CARRELLO */}
      <style>{`
  @keyframes cartBounce {
    0% { transform: scale(1); }
    50% { transform: scale(1.08); }
    100% { transform: scale(1); }
  }
  .animate-cart-bounce {
    animation: cartBounce 0.3s ease-in-out;
  }

  /* 🌟 Layout responsive menu + carrello */
  .menu-layout {
    display: grid;
    gap: 30px;
    align-items: start;
    grid-template-columns: 1fr;
  }
  .menu-layout.has-cart {
    grid-template-columns: 3fr 1fr;
  }

  .cart-sidebar {
    position: sticky;
    top: 20px;
  }

  /* Sotto i 768px: una colonna sola, carrello sotto e non più sticky */
  @media (max-width: 768px) {
    .menu-layout.has-cart {
      grid-template-columns: 1fr;
    }
    .cart-sidebar {
      position: static;
    }
  }
`}</style>

      <div style={{ padding: "20px 0" }}>
        <header style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "36px", color: "#333" }}>Il Nostro Menu</h1>
          <p style={{ color: "#777", fontSize: "18px" }}>
            Scegli il tuo burger preferito e ordinalo in un click!
          </p>
        </header>

        <div
          className={`menu-layout ${isBuyer && cart && cart.length > 0 ? "has-cart" : ""}`}
        >
          {/* COLONNA SINISTRA: LA GRIGLIA DEI PRODOTTI */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "30px",
            }}
          >
            {products.map((burger) => (
              <div
                key={burger._id}
                style={{
                  border: "1px solid #eee",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                <img
                  src={burger.image}
                  alt={burger.name}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />

                <div
                  style={{
                    padding: "15px",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h3 style={{ margin: "0 0 10px 0", fontSize: "20px" }}>
                    {burger.name}
                  </h3>
                  <p
                    style={{
                      color: "#666",
                      fontSize: "14px",
                      flexGrow: 1,
                      lineHeight: "1.4",
                    }}
                  >
                    {burger.ingredients}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "15px",
                      borderTop: "1px solid #f5f5f5",
                      paddingTop: "15px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "22px",
                        fontWeight: "bold",
                        color: "#ff9800",
                      }}
                    >
                      {burger.price.toFixed(2)}€
                    </span>
                    {isBuyer && (
                      <button
                        onClick={() => handleOrderClick(burger)}
                        style={{
                          backgroundColor: "#ffc107",
                          color: "#333",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        Ordina 🛒
                      </button>
                    )}
                  </div>
                </div>

                {addedProductId === burger._id && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "65px",
                      right: "15px",
                      backgroundColor: "#2ecc71",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "5px 10px",
                      borderRadius: "20px",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                      zIndex: 10,
                      pointerEvents: "none",
                    }}
                  >
                    Aggiunto! ✓
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 🌟 COLONNA DESTRA: IL MINI CARRELLO CON AGGIUNTA LA CLASSE ANIMATA DENTRO CLASSNAME */}
          {isBuyer && cart && cart.length > 0 && (
            <div
              className={`cart-sidebar ${isBouncing ? "animate-cart-bounce" : ""} `}
              style={{
                border: "2px solid #ffc107",
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "#fffdf6",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "transform 0.1s ease-in-out",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  borderBottom: "2px solid #ffc107",
                  paddingBottom: "10px",
                  color: "#333",
                }}
              >
                🛒 Il Tuo Ordine
              </h3>

              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  marginBottom: "15px",
                }}
              >
                {cart.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div style={{ flexGrow: 1, paddingRight: "10px" }}>
                      <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#777" }}>
                        {item.quantity} x {item.price.toFixed(2)}€
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      style={{
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        transition: "transform 0.1s, background-color 0.2s",
                        padding: 0,
                        position: "relative",
                        overflow: "hidden",
                      }}
                      title="Riduci quantità"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#d32f2f";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#f44336";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "12px",
                          height: "3px",
                          backgroundColor: "white",
                          borderRadius: "2px",
                        }}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  fontSize: "18px",
                  marginTop: "15px",
                  paddingTop: "15px",
                  borderTop: "2px dashed #ccc",
                }}
              >
                <span>Totale:</span>
                <span style={{ color: "#ff9800" }}>
                  {cartTotal.toFixed(2)}€
                </span>
              </div>

              <Link
                to="/cart"
                style={{
                  display: "block",
                  textAlign: "center",
                  backgroundColor: "#28a745",
                  color: "white",
                  textDecoration: "none",
                  padding: "10px",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  marginTop: "20px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Vai al Carrello ➡️
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

export default Home;
