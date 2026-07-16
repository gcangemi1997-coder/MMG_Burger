import connectDB from "../config/db.js";
import Order from "../models/Order.js";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Metodo non consentito." });
  }

  try {
    await connectDB();
  } catch (dbError) {
    return res
      .status(500)
      .json({ success: false, message: "Errore di connessione al database." });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Non autorizzato. Token mancante." });
  }

  let token = authHeader.split(" ")[1];

  // 🧼 Sanificazione del token
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
    // Proseguiamo
  }

  // 🔐 Definizione della chiave segreta e verifica del Token
  const jwtSecret = process.env.JWT_SECRET || "MMG_BURGER_SECRET_KEY_2026";
  let decoded;

  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch (jwtError) {
    return res.status(401).json({
      success: false,
      message: `Token non valido: ${jwtError.message}`,
    });
  }

  // RECUPERO GLI ORDINI DAL DATABASE
  try {
    const userId = decoded.id;
    const myOrders = await Order.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, orders: myOrders });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Errore nel recupero degli ordini: ${error.message}`,
    });
  }
}
