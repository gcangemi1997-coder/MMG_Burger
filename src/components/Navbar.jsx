import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import useScrollDirection from "../hooks/useScrollDirection.js";

export default function Navbar({ userRole, onLogout }) {
  const location = useLocation();
  const { cart } = useContext(AppContext);
  const isVisible = useScrollDirection();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalItems = cart
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const isBuyer = userRole !== "admin";

  // Chiude il menu ogni volta che si clicca un link (utile su mobile)
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-3"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1030,
        // 🌟 Se il menu mobile è aperto, la navbar resta sempre visibile
        transform:
          isVisible || isMenuOpen ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <div className="container-fluid">
        <Link
          className="navbar-brand fw-bold fs-4 text-warning"
          to="/"
          onClick={closeMenu}
        >
          MMG Burger 🍔
        </Link>

        {/* Hamburger menu per mobile — ora controllato da React, non da data-bs-toggle */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link fw-semibold ${location.pathname === "/" ? "active text-warning" : ""}`}
                to="/"
                onClick={closeMenu}
              >
                Menu
              </Link>
            </li>

            {userRole && (
              <li className="nav-item">
                <Link
                  className={`nav-link fw-semibold ${location.pathname === "/i-miei-ordini" ? "active text-warning" : ""}`}
                  to="/i-miei-ordini"
                  onClick={closeMenu}
                >
                  I Miei Ordini
                </Link>
              </li>
            )}

            {userRole === "admin" && (
              <li className="nav-item">
                <Link
                  className={`nav-link fw-semibold text-info ${location.pathname === "/admin" ? "active border-bottom border-info" : ""}`}
                  to="/admin"
                  onClick={closeMenu}
                >
                  Pannello Cuochi 👨‍🍳
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {isBuyer && (
              <Link
                to="/cart"
                className="btn btn-outline-light btn-sm me-3 d-flex align-items-center gap-2"
                title="Vai al carrello"
                style={{ borderRadius: "20px", padding: "5px 12px" }}
                onClick={closeMenu}
              >
                <span>🛒</span>
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
                  onClick={() => {
                    closeMenu();
                    onLogout();
                  }}
                >
                  Logout 🚪
                </button>
              </>
            ) : (
              <Link
                className="btn btn-warning btn-sm fw-bold px-4"
                to="/login"
                onClick={closeMenu}
              >
                Accedi
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
