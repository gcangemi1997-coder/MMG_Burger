import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import PageTransition from "./PageTransition.jsx";
import { Link } from "react-router-dom";

function Cart() {
  // ESTRAGGO LE FUNZIONI DAL CONTEXT
  const { cart, addToCart, removeFromCart, clearCart, user } =
    useContext(AppContext);

  // STATO PER GESTIRE ORDINI
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // CALCOLO TOTALE CON METODO REDUCE
  const totalCost = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // CORRETTO
  const handleCheckout = () => {
    console.log("Pulsante cliccato con successo");
    alert("Pulsante cliccato con successo");
  };

  // FUNZIONE INVIO ORDINE AL BACK-END
  const placeOrder = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    const orderData = {
      items: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: totalCost,
    };

    try {
      const token = localStorage.getItem("mmg_token");
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Errore durante l'invio dell'ordine");
      }

      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      console.error(err.message);
      setOrderSuccess(false);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ORDINE INVIATO CON SUCCESSO
  if (orderSuccess) {
    return (
      <PageTransition>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <h2 style={{ color: "#4caf50" }}>🎉 Ordine Ricevuto!</h2>
          <p style={{ fontSize: "18px", color: "#555" }}>
            I nostri cuochi si sono già messi al lavoro per preparare i tuoi
            burger.
          </p>
          <Link
            to="/"
            style={{
              display: "inline-block",
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#ffc107",
              color: "#333",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            Torna al Menu
          </Link>
        </div>
      </PageTransition>
    );
  }

  // CARRELLO VUOTO
  if (cart.length === 0) {
    return (
      <PageTransition>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <h2>🛒 Il tuo carrello è vuoto</h2>
          <p style={{ color: "#777" }}>
            Non hai ancora aggiunto nessun panino delizioso.
          </p>
          <Link
            to="/"
            style={{
              display: "inline-block",
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#ffc107",
              color: "#333",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            Sfoglia il Menu
          </Link>
        </div>
      </PageTransition>
    );
  }

  // VISUALIZZO LISTA CARRELLO
  return (
    <PageTransition>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        <h2
          style={{
            borderBottom: "2px solid #eee",
            paddingBottom: "10px",
            marginBottom: "20px",
          }}
        >
          🛒 Il tuo Carrello
        </h2>

        <div>
          {cart.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "15px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              {/* 1. Colonna Info Panino (Con flex: 1 per occupare lo spazio a sinistra) */}
              <div style={{ flex: 1, paddingRight: "10px" }}>
                <h4 style={{ margin: "0 0 5px 0", fontSize: "18px" }}>
                  {item.name}
                </h4>
                <p style={{ margin: "0", color: "#777" }}>
                  {item.price.toFixed(2)}€ cad.
                </p>
              </div>

              {/* 🌟 2. COLONNA CENTRALE QUANTITÀ: PERFETTAMENTE CENTRATA E ALLINEATA */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center", // Centra orizzontalmente i pulsanti dentro questo box
                  alignItems: "center",
                  gap: "10px",
                  width: "120px", // Rende il box della colonna largo uguale per tutte le righe
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() => removeFromCart(item._id)}
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: "#e0e0e0",
                    border: "none",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  -
                </button>

                {/* Span bloccato a 30px centrali così i pulsanti non ballano */}
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    minWidth: "30px",
                    textAlign: "center",
                  }}
                >
                  {item.quantity}
                </span>

                <button
                  onClick={() => addToCart(item)}
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: "#e0e0e0",
                    border: "none",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
              </div>

              {/* 3. Prezzo parziale per questo panino */}
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  width: "80px", // Anch'esso bloccato a 80px a destra
                  textAlign: "right",
                }}
              >
                {(item.price * item.quantity).toFixed(2)}€
              </span>
            </div>
          ))}
        </div>

        {/* RIEPILOGO FINALE E CHECKOUT */}
        <div
          style={{
            marginTop: "30px",
            textAlign: "right",
            borderTop: "2px solid #eee",
            paddingTop: "20px",
          }}
        >
          <h3 style={{ fontSize: "24px", marginBottom: "20px" }}>
            Totale:{" "}
            <span style={{ color: "#ff9800" }}>{totalCost.toFixed(2)}€</span>
          </h3>

          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "15px" }}
          >
            <button
              onClick={clearCart}
              style={{
                padding: "10px 20px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Svuota Carrello
            </button>

            <button
              onClick={placeOrder}
              disabled={loading}
              style={{
                padding: "10px 25px",
                backgroundColor: loading ? "#ccc" : "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading
                ? "Incolonnamento ordine..."
                : "Conferma e Invia Ordine 🚀"}
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Cart;
