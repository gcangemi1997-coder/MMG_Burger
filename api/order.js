import connectDB from "./config/db.js";
import Order from "./models/Order.js";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // ACCETTIAMO SOLO RICHIESTE POST PER CREARE GLI ORDINI
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Metodo non consentito." });
  }

  try {
    await connectDB();
  } catch (dbError) {
    return res
      .status(500)
      .json({ success: false, message: "Errore connessione database." });
  }

  // 🔐 CONTROLLO AUTENTICAZIONE (LETTURA DEL TOKEN JWT)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Accesso negato. Devi essere loggato per ordinare un burger!",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Decodifichiamo il token usando la stessa chiave del login
    const jwtSecret = process.env.JWT_SECRET || "MMG_BURGER_SECRET_KEY_2026";
    const decoded = jwt.verify(token, jwtSecret);

    const { items, totalPrice } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Il carrello è vuoto." });
    }

    // CREAZIONE REALE DELL'ORDINE SU MONGO
    const newOrder = new Order({
      userId: decoded.id, // Estraiamo l'ID utente direttamente dal Token sicuro!
      items,
      totalPrice,
    });

    await newOrder.save();

    return res.status(201).json({
      success: true,
      message: "Ordine inviato in cucina con successo! 🍔",
      order: newOrder,
    });
  } catch (error) {
    console.error("ERRORE CREAZIONE ORDINE:", error);
    return res.status(500).json({
      success: false,
      message: `Errore durante l'invio dell'ordine: ${error.message}`,
    });
  }
}
