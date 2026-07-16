import React, { useContext } from "react"; // 🌟 Importato useContext
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx"; // 🌟 Importato il contesto per leggere il carrello

export default function Navbar({ userRole, onLogout }) {
  const location = useLocation();

  // 🌟 Estraiamo il carrello dal Context globale
  const { cart } = useContext(AppContext);

  // 🌟 Calcoliamo il numero totale di panini nel carrello (sommando le quantità)
  const totalItems = cart
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  // Definiamo se l'utente è un semplice acquirente (non cuoco/admin) per mostrargli il carrello
  const isBuyer = userRole !== "admin";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-3">
      <div className="container-fluid">
        {/* LOGO / NOME SITO (Porta alla Home) */}
        <Link className="navbar-brand fw-bold fs-4 text-warning" to="/">
          MMG Burger 🍔
        </Link>

        {/* Hamburger menu per mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* LINK DI NAVIGAZIONE */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link fw-semibold ${location.pathname === "/" ? "active text-warning" : ""}`}
                to="/"
              >
                Menu
              </Link>
            </li>

            {/* Mostra "I Miei Ordini" solo se l'utente è loggato */}
            {userRole && (
              <li className="nav-item">
                <Link
                  className={`nav-link fw-semibold ${location.pathname === "/i-miei-ordini" ? "active text-warning" : ""}`}
                  to="/i-miei-ordini"
                >
                  I Miei Ordini
                </Link>
              </li>
            )}

            {/* Mostra "Pannello Cuochi" SOLO se l'utente è un admin/cuoco */}
            {userRole === "admin" && (
              <li className="nav-item">
                <Link
                  className={`nav-link fw-semibold text-info ${location.pathname === "/admin" ? "active border-bottom border-info" : ""}`}
                  to="/admin"
                >
                  Pannello Cuochi 👨‍🍳
                </Link>
              </li>
            )}
          </ul>

          {/* SEZIONE DESTRA: CARRELLO + LOGIN / LOGOUT */}
          <div className="d-flex align-items-center">
            {/* 🌟 CARRELLO CON BADGE INLINE INFALLIBILE */}
            {isBuyer && (
              <Link
                to="/cart"
                className="btn btn-outline-light btn-sm me-3 d-flex align-items-center gap-2"
                title="Vai al carrello"
                style={{ borderRadius: "20px", padding: "5px 12px" }}
              >
                <span>🛒</span>

                {/* Se ci sono elementi, creiamo un badge Bootstrap visibilissimo di fianco */}
                {totalItems > 0 && (
                  <span className="badge bg-danger rounded-pill fw-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {userRole ? (
              <>
                <span className="text-light me-3 small d-none d-md-inline">
                  Loggato come:{" "}
                  <strong className="text-warning">
                    {userRole === "admin" ? "Cuoco" : "Cliente"}
                  </strong>
                </span>
                <button
                  className="btn btn-outline-danger btn-sm fw-bold px-3"
                  onClick={onLogout}
                >
                  Logout 🚪
                </button>
              </>
            ) : (
              <Link className="btn btn-warning btn-sm fw-bold px-4" to="/login">
                Accedi
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;