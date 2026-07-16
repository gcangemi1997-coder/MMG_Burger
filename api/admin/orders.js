import connectDB from "../config/db.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // Accettiamo solo GET e PUT
  if (req.method !== "GET" && req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, message: "Metodo non consentito." });
  }

  try {
    await connectDB();
  } catch (dbError) {
    return res
      .status(500)
      .json({ success: false, message: "Errore database." });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Accesso negato. Token mancante." });
  }

  let token = authHeader.split(" ")[1];

  // 📝 LOG DI DIAGNOSTICA: Vediamo cosa arriva esattamente nel terminale
  console.log("--- DEBUG TOKEN RICEVUTO ---");
  console.log("Contenuto originario:", token);
  console.log("----------------------------");

  // Pulizia di emergenza per stringhe sporche o JSON serializzati male
  try {
    if (token.startsWith("{")) {
      const parsed = JSON.parse(token);
      token = parsed.token || token;
    }
    token = token
      .replace(/[\r\n\t]/g, "")
      .replace(/^["']|["']$/g, "")
      .trim();
  } catch (e) {
    // Non è un JSON, proseguiamo
  }

  // 🔐 VERIFICA DEL TOKEN ISOLATA (Previene il crash 500)
  let decoded;
  try {
    const jwtSecret = process.env.JWT_SECRET || "MMG_BURGER_SECRET_KEY_2026";
    decoded = jwt.verify(token, jwtSecret);
  } catch (jwtError) {
    console.error("Firma JWT non valida:", jwtError.message);
    // Se il token è malformato, scaduto o errato, rispondiamo con 401 invece di crashare!
    return res.status(401).json({
      success: false,
      message: `Problema di Autenticazione: ${jwtError.message}. Controlla cosa hai salvato in mmg_token.`,
    });
  }

  // Controllo ruolo Admin
  if (decoded.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Accesso vietato. Non sei un amministratore.",
    });
  }

  // --- LOGICA DI BUSINESS ENPPOINT ---
  try {
    if (req.method === "GET") {
      const orders = await Order.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
      return res.status(200).json({ success: true, orders });
    }

    if (req.method === "PUT") {
      const { orderId, newStatus } = req.body;
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: newStatus },
        { new: true },
      );
      return res.status(200).json({
        success: true,
        message: "Stato aggiornato!",
        order: updatedOrder,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
