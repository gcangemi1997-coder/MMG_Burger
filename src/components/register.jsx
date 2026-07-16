import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  // CREAZIONE STATI DEL FORM
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // CREAZIONE STATI PER FEEDBACK VISIVI
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // RENDERIZZIAMO UTENTE DOPO LA REGISTRAZIONE
  const navigate = useNavigate();

  // FUNZIONE CHE GESTISCE L'INVIO DEL FORM
  const handleSubmit = async (e) => {
    e.preventDefault(); // EVITIAMO IL RELOAD DELLA PAGINA
    setError("");
    setSuccess("");
    setLoading(true);

    // VALIDAZIONE E CONTROLLO DATI
    if (!name || !email || !password) {
      setError("Compilare tutti i campi obbligatori");
      setLoading(false);
      return;
    }

    // CHIAMATA HTTP POST AL BACK-END
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // GESTISCO EVENTUALE PROBLEMA DEL SERVER
        throw new Error(
          data.message || "Si è verificato un errore durante la registrazione",
        );
      }

      // REGISTRAZIONE AVVENUTA CON SUCCESSO
      setSuccess("Registrazione avvenuta con successo");

      // SVUOTO I CAMPI DEL FORM
      setName("");
      setEmail("");
      setPassword("");

      // REINDIRIZZO L'UTENTE ALLA PAGINA DI LOGIN DOPO 2 SEC
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. INTERFACCIA GRAFICA (Stile base in linea per ora)
  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        📝 Registra Account
      </h2>

      {/* MESSAGGI DI ERRORE O SUCCESSO */}
      {error && (
        <div
          style={{
            color: "red",
            backgroundColor: "#ffe6e6",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "15px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            color: "green",
            backgroundColor: "#e6ffe6",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "15px",
            fontSize: "14px",
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Nome:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
            placeholder="Inserisci il tuo nome"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
            placeholder="esempio@email.com"
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
            placeholder="Minimo 6 caratteri"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: loading ? "#ccc" : "#ffc107",
            border: "none",
            borderRadius: "4px",
            color: "#333",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          {loading ? "Registrazione in corso..." : "Invia Registrazione"}
        </button>
      </form>
    </div>
  );
}

export default Register;
