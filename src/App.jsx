import React, { useContext } from "react";
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

// NAVBAR IN PURO BOOTSTRAP
function NavbarBootstrap() {
  const location = useLocation();
  const { user, logout, cart } = useContext(AppContext);

  // Calcoliamo il numero totale di panini nel carrello
  const totalItems = cart
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  // Ruolo utente
  const userRole = user?.role;
  const isBuyer = userRole !== "admin" && userRole !== "staff";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-3 rounded-3 mb-4">
      <div className="container-fluid">
        {/* LOGO / NOME SITO */}
        <Link className="navbar-brand fw-bold fs-4 text-warning" to="/">
          MMG Burger 🍔
        </Link>

        {/* Pulsante Hamburger per dispositivi Mobile */}
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

            {/* Mostra "I Miei Ordini" solo se l'utente è un cliente loggato */}
            {userRole === "user" && (
              <li className="nav-item">
                <Link
                  className={`nav-link fw-semibold ${location.pathname === "/i-miei-ordini" ? "active text-warning" : ""}`}
                  to="/i-miei-ordini"
                >
                  I Miei Ordini
                </Link>
              </li>
            )}

            {/* Mostra "Pannello Cucina" SOLO se l'utente è staff */}
            {userRole === "staff" && (
              <li className="nav-item">
                <Link
                  className={`nav-link fw-semibold text-warning ${location.pathname === "/dashboard" ? "active border-bottom border-warning" : ""}`}
                  to="/dashboard"
                >
                  Pannello Cucina 👨‍🍳
                </Link>
              </li>
            )}

            {/* Mostra "Pannello Amministrazione" SOLO se l'utente è un admin */}
            {userRole === "admin" && (
              <li className="nav-item">
                <Link
                  className={`nav-link fw-semibold text-danger ${location.pathname === "/admin" ? "active border-bottom border-danger" : ""}`}
                  to="/admin"
                >
                  Amministrazione 👑
                </Link>
              </li>
            )}
          </ul>

          {/* SEZIONE DESTRA: CARRELLO + LOGIN / LOGOUT */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* CARRELLO CON BADGE DI FIANCO */}
            {isBuyer && (
              <Link
                to="/cart"
                className="btn btn-outline-light btn-sm me-2 d-flex align-items-center gap-2 rounded-pill px-3"
                title="Vai al carrello"
              >
                <span>🛒 Carrello</span>

                {/* Se ci sono elementi, creiamo un badge Bootstrap rosso visibilissimo */}
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
                  onClick={logout}
                >
                  Logout 🚪
                </button>
              </>
            ) : (
              <div className="d-flex gap-2">
                <Link
                  className="btn btn-outline-success btn-sm fw-bold px-3"
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="btn btn-warning btn-sm fw-bold px-3"
                  to="/register"
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
