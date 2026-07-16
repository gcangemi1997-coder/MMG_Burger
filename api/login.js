import connectDB from "./config/db.js";
import User from "./models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Endpoint Serverless per il login dei clienti di MMG Burger.
// Si attiva quando arriva una richiesta HTTP all'indirizzo /api/login.
export default async function handler(req, res) {
  // ACCETO SOLO RICHIESTE POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Metodo non consentito. Usa una richiesta POST.",
    });
  }

  // CONNESSIONE DEL DATABASE

  try {
    await connectDB();
  } catch (dbError) {
    return res.status(500).json({
      success: false,
      message: "Errore interno del server durante la connessione al database",
    });
  }

  //  ESTRAZIONE DATI REACT

  const { email, password } = req.body;

  try {
    //  1o CONTROLLO - CONTROLLO CREDENZIALI INVIATE A REACT
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email e/o password obbligatorie",
      });
    }

    // 2o CONTROLLO - RICERCA UTENTE NEL DATABASE TRAMITE EMAIL
    const user = await User.findOne({ email });

    // 3o CONTROLLO - SE L'UTENTE NON ESISTE O LA PASSWORD NON COINCIDE, DO UN ERRORE GENERICO
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenziali non valide. Controlla email e password",
      });
    }

    // 4o CONTROLLO - SE L'UTENTE ESISTE, VERIFICO LA PASSWORD CON IL METODO BCRYPT
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Credenziali non valide. Controlla email e password",
      });
    }

    // GENERAZIONE DEL JWT
    const jwtSecret = process.env.JWT_SECRET || "MMG_BURGER_SECRET_KEY_2026";

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      }, // DATI INCORPORATI NEL TOKEN
      jwtSecret, // STRINGA SEGRETA
      { expiresIn: "30d" }, // DURATA DEL TOKEN
    );

    return res.status(200).json({
      success: true,
      message: `Login avvenuto con successo. Benvenuto ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // COSI` REACT SCEGLIE LA DASHBOARD DA RENDERIZZARE
      },
    });
  } catch (error) {
    console.error(`Errore durante il login: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Errore del server durante il login",
    });
  }
}
