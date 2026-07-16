import connectDB from "./config/db.js";
import Order from "./models/Order.js";
import jwt from "jsonwebtoken";

// ENDPOINT PER LA CREAZIONE DEGLI ORDINI

export default async function handler(req, res) {
  // COLLEGHIAMO IL DATABASE
  try {
    await connectDB();
  } catch (dbError) {
    return res.status(500).json({
      success: false,
      message: "Errore di connessione al database",
    });
  }

  // ESTRAZIONE E RECUPERO TOKEN, SE PRESENTE
  const authHeader = req.headers.authorization;
  let decodedToken = null;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      const token = authHeader.split("")[1];
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      // SE IL JWT NON È VALIDO, BLOCCO LA RICHIESTA
      return res.status(401).json({
        success: false,
        message:
          "Sessione scaduta o Token non valido. Effettua nuovamente il login.",
      });
    }
  }

  // INVIARE RICHIESTA (POST) PER LA CREAZIONE DEGLI ORDINI ( CLIENTI E OSPITI)

  if (req.method === "POST") {
    try {
      const { customerName, deliveryAddress, phoneNumber, items, totalPrice } =
        req.body;

      if (
        !customerName ||
        !deliveryAddress ||
        !phoneNumber ||
        !items ||
        items.length === 0
      ) {
        return res.status(400).json({
          success: false,
          messagge: "Dati dell'ordine incompleti.",
        });
      }

      // SCONTO DEL 10% PER I CLIENTI REGISTRATI
      let finalPrice = totalPrice;
      let userRef = null;

      if (decodedToken) {
        // VERIFICA PRESENZA DEL TOKEN DEL CLIENTE E RECUPERO DEL REF DEL CLIENTE
        userRef = decodedToken.id;
        ((finalPrice = totalPrice * 0), 9);
      }

      const newOrder = await Order.create({
        user: userRef,
        customerName,
        deliveryAddress,
        phoneNumber,
        items,
        totalPrice: finalPrice,
      });

      return res.status(201).json({
        success: true,
        message: decodedToken
          ? "Ordine creato con successo. Sconto del 10% applicato automaticamente."
          : "Ordine creato con successo. Registrati per ottenere un sconto del 10%.",
        order: newOrder,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // LETTURA ORDINE (GET) - AUTORIZZAZIONE OBBLIGATORIA

  if (req.method === "GET") {
    if (!decodedToken) {
      return res.status(401).json({
        success: false,
        message: "Accesso negato!",
      });
    }
    try {
      // 1o CASO - ACCESSO STAFF
      if (decodedToken.role === "staff") {
        const allOrders = await Order.find({}).sort({ createdAt: -1 });
        return res.status(200).json({
          success: true,
          orders: allOrders,
        });
      }

      // 2o CASO - ACCESSO CLIENTI E STORICO DEI SUOI ORDINI

      if (decodedToken.role === "customer") {
        const myOrders = await Order.find({ user: decodedToken.id }).sort({
          createdAt: -1,
        });
        return res.status(200).json({
          success: true,
          orders: myOrders,
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // AGGIORNAMENTO STATO ORDINE (PUT) - SOLO PER STAFF

  if (req.method === "PUT") {
    if (!decodedToken || decodedToken.role !== "staff") {
      return res.status(401).json({
        success: false,
        error: "Accesso riservato solo allo staff.",
      });
    }
    try {
      const { orderId, newStatus } = req.body;

      const allowedStatus = [
        "In attesa",
        "In preparazione",
        "Pronto",
        "Consegnato",
        "Annullato",
      ];

      if (!allowedStatus.includes(newStat)) {
        return res.status(400).json({
          success: false,
          message: "Stato dell'ordine non valido.",
        });
      }

      const updatedOrder = await Order.findbyIdAndUpdate(
        orderId,
        { status: newStatus },
        { new: true },
      );

      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: "Ordine non trovato.",
        });
      }
      return res.status(200).json({
        success: true,
        message: `Ordine ${newStatus}`,
        order: updatedOrder,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: erro.message,
      });
    }
  }

  // METODO HTTP NON SUPPORTATO (DELETE)
  return res.status(405).json({
    success: false,
    message: "Metodo non consentito.",
  });
}
