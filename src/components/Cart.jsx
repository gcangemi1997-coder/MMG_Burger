import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { AppContext } from "../context/AppContext.jsx";
import PageTransition from "./PageTransition.jsx";
import styles from "./Cart.module.css";

function Cart() {
  const { cart, addToCart, removeFromCart, clearCart, token } =
    useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const totalCost = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

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
    };

    try {
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

  if (orderSuccess) {
    return (
      <PageTransition>
        <div className={styles.cartSuccessState}>
          <h2 className={styles.cartSuccessTitle}>🎉 Ordine Ricevuto!</h2>
          <p className={styles.cartSuccessText}>
            I nostri cuochi si sono già messi al lavoro per preparare i tuoi
            burger.
          </p>
          <Link to="/" className={styles.cartLinkButton}>
            Torna al Menu
          </Link>
        </div>
      </PageTransition>
    );
  }

  if (cart.length === 0) {
    return (
      <PageTransition>
        <div className={styles.cartEmptyState}>
          <h2>🛒 Il tuo carrello è vuoto</h2>
          <p className={styles.cartSuccessText}>
            Non hai ancora aggiunto nessun panino delizioso.
          </p>
          <Link to="/" className={styles.cartLinkButton}>
            Sfoglia il Menu
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className={styles.cartPage}>
        <h2 className={styles.cartTitle}>🛒 Il tuo Carrello</h2>

        <div>
          {cart.map((item) => (
            <div key={item._id} className={styles.cartItem}>
              <div className={styles.cartItemInfo}>
                <h4 className={styles.cartItemName}>{item.name}</h4>
                <p className={styles.cartItemPrice}>
                  {item.price.toFixed(2)}€ cad.
                </p>
              </div>

              <div className={styles.cartQuantityBox}>
                <button
                  type="button"
                  className={styles.cartQuantityButton}
                  onClick={() => removeFromCart(item._id)}
                >
                  -
                </button>
                <span className={styles.cartQuantityValue}>
                  {item.quantity}
                </span>
                <button
                  type="button"
                  className={styles.cartQuantityButton}
                  onClick={() => addToCart(item)}
                >
                  +
                </button>
              </div>

              <span className={styles.cartItemTotal}>
                {(item.price * item.quantity).toFixed(2)}€
              </span>
            </div>
          ))}
        </div>

        <div className={styles.cartSummary}>
          <h3 className={styles.cartSummaryTotal}>
            Totale:{" "}
            <span style={{ color: "#ff9800" }}>{totalCost.toFixed(2)}€</span>
          </h3>

          <div className={styles.cartSummaryActions}>
            <button
              type="button"
              className={styles.cartSecondaryButton}
              onClick={clearCart}
            >
              Svuota Carrello
            </button>

            <button
              type="button"
              className={styles.cartPrimaryButton}
              disabled={loading}
              onClick={placeOrder}
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
