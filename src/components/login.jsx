import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../context/AppContext.jsx";
import styles from "./Login.module.css";

function Login() {
  const { login } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !password) {
      setError("Compilare tutti i campi obbligatori");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Credenziali non valide");
      }

      login(data.user, data.token);
      setSuccess(`Accesso eseguito! Benvenuto ${data.user.name} ad MMG Burger`);

      setTimeout(() => {
        if (data.user.role === "staff") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authCard}>
      <h2 className={styles.authTitle}>🔑 Accedi al tuo Account</h2>

      {error && (
        <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>
      )}
      {success && (
        <div className={`${styles.alert} ${styles.alertSuccess}`}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="esempio@email.com"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="Inserisci la tua password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Verifica in corso..." : "Accedi"}
        </button>
      </form>
    </div>
  );
}

export default Login;
