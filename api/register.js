import connectDB from "./config/db.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Endpoint Serverless per la registrazione dei clienti di MMG Burger.
// Si attiva quando arriva una richiesta HTTP all'indirizzo /api/register.
export default async function handler(req, res) {
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
      message: "Errore del server durante la connessione al database",
    });
  }

  // ESTRAZIONE DATI REACT

  const { name, email, password } = req.body;

  // VALIDAZIONE E CONTROLLO DATI
  try {
    // VERIFICA CORRETTO INSERIMENTO DEI DATI
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Tutti i campi sono obbligatori!",
      });
    }

    // CONTROLLO LUNGHEZZA MINIMA PASSWORD PRIMA DI HASHARE
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La password deve avere almeno 6 caratteri!",
      });
    }

    // VERIFICA ESISTENZA UTENTE NEL DATABASE
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Utente già registrato con questo indirizzo mail!",
      });
    }

    // GENERAZIONE HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // CREAZIONE NUOVO UTENTE
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Utente creato con successo!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(`Errore: ${error.message}`);
    return res.status(500).json({
      success: false,
      message:
        " Si è verificato un errore durante la registrazione dell'utente",
    });
  }
}
