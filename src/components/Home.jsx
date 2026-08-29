import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { AppContext } from "../context/AppContext.jsx";
import PageTransition from "./PageTransition.jsx";
import styles from "./Home.module.css";

function ProductGrid({ products, isBuyer, onAddToCart, addedProductId }) {
  return (
    <div className={styles.productGrid}>
      {products.map((burger) => (
        <div key={burger._id} className={styles.productCard}>
          <img
            src={burger.image}
            alt={burger.name}
            className={styles.productImage}
          />

          <div className={styles.productContent}>
            <h3 className={styles.productName}>{burger.name}</h3>
            <p className={styles.productIngredients}>{burger.ingredients}</p>

            <div className={styles.productFooter}>
              <span className={styles.productPrice}>
                {burger.price.toFixed(2)}€
              </span>
              {isBuyer && (
                <button
                  type="button"
                  className={styles.productButton}
                  onClick={() => onAddToCart(burger)}
                >
                  Ordina 🛒
                </button>
              )}
            </div>
          </div>

          {addedProductId === burger._id && (
            <div className={styles.productBadge}>Aggiunto! ✓</div>
          )}
        </div>
      ))}
    </div>
  );
}

function CartSidebar({ cart, isBouncing, onRemoveFromCart, total }) {
  return (
    <aside
      className={`${styles.cartSidebar} ${isBouncing ? styles.bouncing : ""}`}
    >
      <h3 className={styles.cartSidebarTitle}>🛒 Il Tuo Ordine</h3>

      <div className={styles.cartList}>
        {cart.map((item) => (
          <div key={item._id} className={styles.cartItem}>
            <div className={styles.cartItemInfo}>
              <div className={styles.cartItemName}>{item.name}</div>
              <div className={styles.cartItemMeta}>
                {item.quantity} x {item.price.toFixed(2)}€
              </div>
            </div>

            <button
              type="button"
              className={styles.removeItemButton}
              title="Riduci quantità"
              onClick={() => onRemoveFromCart(item._id)}
            />
          </div>
        ))}
      </div>

      <div className={styles.cartFooter}>
        <span>Totale:</span>
        <span className={styles.cartTotalValue}>{total.toFixed(2)}€</span>
      </div>

      <Link to="/cart" className={styles.checkoutButton}>
        Vai al Carrello ➡️
      </Link>
    </aside>
  );
}

function Home() {
  const { addToCart, removeFromCart, user, cart, products, loadingProducts } =
    useContext(AppContext);
  const [addedProductId, setAddedProductId] = useState(null);
  const [isBouncing, setIsBouncing] = useState(false);

  const handleOrderClick = (burger) => {
    addToCart(burger);
    setAddedProductId(burger._id);
    setIsBouncing(true);

    setTimeout(() => setAddedProductId(null), 2000);
    setTimeout(() => setIsBouncing(false), 300);
  };

  const currentUserRole = user?.role?.toLowerCase();
  const isBuyer =
    !user || (currentUserRole !== "admin" && currentUserRole !== "staff");

  const cartTotal = cart
    ? cart.reduce((total, item) => total + item.price * item.quantity, 0)
    : 0;

  if (loadingProducts) {
    return (
      <div className="text-center py-5 text-secondary fs-5">
        Caricamento del delizioso menu MMG... ⏳🍔
      </div>
    );
  }

  return (
    <PageTransition>
      <div className={styles.menuPage}>
        <header className={styles.menuHeader}>
          <h1 className={styles.menuTitle}>Il Nostro Menu</h1>
          <p className={styles.menuSubtitle}>
            Scegli il tuo burger preferito e ordinalo in un click!
          </p>
        </header>

        <div
          className={`${styles.menuGrid} ${isBuyer && cart && cart.length > 0 ? styles.menuGridWithCart : ""}`}
        >
          <ProductGrid
            products={products}
            isBuyer={isBuyer}
            onAddToCart={handleOrderClick}
            addedProductId={addedProductId}
          />

          {isBuyer && cart && cart.length > 0 && (
            <CartSidebar
              cart={cart}
              total={cartTotal}
              isBouncing={isBouncing}
              onRemoveFromCart={removeFromCart}
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}

export default Home;
