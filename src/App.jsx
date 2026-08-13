import React, { useContext, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AppProvider, AppContext } from "./context/AppContext.jsx";
import Register from "./components/register.jsx";
import Login from "./components/login.jsx";
import Home from "./components/Home.jsx";
import Cart from "./components/Cart.jsx";
import Dashboard from "./components/Dashboard.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import UserOrders from "./components/UserOrders.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import useScrollDirection from "./hooks/useScrollDirection.js";

// NAVBAR IN PURO BOOTSTRAP
function NavbarBootstrap() {
  const location = useLocation();
  const { user, logout, cart } = useContext(AppContext);
  const isVisible = useScrollDirection();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalItems = cart
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const userRole = user?.role;
  const isBuyer = userRole !== "admin" && userRole !== "staff";

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-3 rounded-3 mb-4"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1030,
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

            {userRole === "user" && (
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

            {userRole === "staff" && (
              <li className="nav-item">
                <Link
                  className={`nav-link fw-semibold text-warning ${location.pathname === "/dashboard" ? "active border-bottom border-warning" : ""}`}
                  to="/dashboard"
                  onClick={closeMenu}
                >
                  Pannello Cucina 👨‍🍳
                </Link>
              </li>
            )}

            {userRole === "admin" && (
              <li className="nav-item">
                <Link
                  className={`nav-link fw-semibold text-danger ${location.pathname === "/admin" ? "active border-bottom border-danger" : ""}`}
                  to="/admin"
                  onClick={closeMenu}
                >
                  Amministrazione 👑
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {isBuyer && (
              <Link
                to="/cart"
                className="btn btn-outline-light btn-sm me-2 d-flex align-items-center gap-2 rounded-pill px-3"
                title="Vai al carrello"
                onClick={closeMenu}
              >
                <span>🛒 Carrello</span>
                {totalItems > 0 && (
                  <span className="badge bg-danger rounded-pill fw-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <>
                <span className="text-light me-2 small d-none d-md-inline">
                  Loggato come:{" "}
                  <strong className="text-warning">
                    {userRole === "admin"
                      ? `👑 Admin: ${user.name}`
                      : userRole === "staff"
                        ? `👨‍🍳 Staff: ${user.name}`
                        : `👋 ${user.name}`}
                  </strong>
                </span>
                <button
                  className="btn btn-outline-danger btn-sm fw-bold px-3"
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                >
                  Logout 🚪
                </button>
              </>
            ) : (
              <div className="d-flex gap-2">
                <Link
                  className="btn btn-outline-success btn-sm fw-bold px-3"
                  to="/login"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  className="btn btn-warning btn-sm fw-bold px-3"
                  to="/register"
                  onClick={closeMenu}
                >
                  Registrati
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// IL COMPONENTE PRINCIPALE APP
function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div
          className="container-fluid py-4"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            fontFamily: "sans-serif",
          }}
        >
          <ScrollToTop />
          {/* Richiamiamo la barra di navigazione Bootstrap */}
          <NavbarBootstrap />

          {/* Lo smistatore delle rotte */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/i-miei-ordini" element={<UserOrders />} />
            {/* Fallback di sicurezza */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
