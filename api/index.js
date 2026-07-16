import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  createUser as createMemoryUser,
  createOrder as createMemoryOrder,
  findUserByEmail as findMemoryUser,
  getAllOrders as getMemoryOrders,
  getOrdersByUser as getMemoryOrdersByUser,
  updateOrderStatus as updateMemoryOrderStatus,
} from "./config/store.js";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Order from "./models/Order.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let dbReadyChecked = false;
let usingMongo = false;
let initPromise = null;

const ensureDatabase = async () => {
  if (dbReadyChecked) {
    return usingMongo;
  }

  if (!process.env.MONGODB_URI) {
    usingMongo = false;
    dbReadyChecked = true;
    return false;
  }

  try {
    await connectDB();
    usingMongo = true;
  } catch (error) {
    console.warn("MongoDB unavailable, using memory fallback.", error.message);
    usingMongo = false;
  }

  dbReadyChecked = true;
  return usingMongo;
};

const initializeAppData = async () => {
  if (!initPromise) {
    initPromise = (async () => {
      const mongoAvailable = await ensureDatabase();

      if (!mongoAvailable) {
        if (!findMemoryUser("admin@mmgburger.test")) {
          createMemoryUser({
            name: "Admin MMG",
            email: "admin@mmgburger.test",
            password: bcrypt.hashSync("admin123", 10),
            role: "admin",
          });
        }

        if (!findMemoryUser("cliente@mmgburger.test")) {
          createMemoryUser({
            name: "Cliente Demo",
            email: "cliente@mmgburger.test",
            password: bcrypt.hashSync("cliente123", 10),
            role: "user",
          });
        }
        return;
      }

      const adminExists = await User.findOne({ email: "admin@mmgburger.test" });
      if (!adminExists) {
        await User.create({
          name: "Admin MMG",
          email: "admin@mmgburger.test",
          password: bcrypt.hashSync("admin123", 10),
          role: "admin",
        });
      }

      const clientExists = await User.findOne({
        email: "cliente@mmgburger.test",
      });
      if (!clientExists) {
        await User.create({
          name: "Cliente Demo",
          email: "cliente@mmgburger.test",
          password: bcrypt.hashSync("cliente123", 10),
          role: "user",
        });
      }
    })();
  }

  return initPromise;
};

const ensureAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ success: false, message: "Token mancante." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "MMG_BURGER_SECRET_KEY_2026",
    );
    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Accesso vietato." });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Token non valido." });
  }
};

const ensureUser = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ success: false, message: "Token mancante." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "MMG_BURGER_SECRET_KEY_2026",
    );
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Token non valido." });
  }
};

app.post("/api/login", async (req, res) => {
  await initializeAppData();

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email e password obbligatorie." });
  }

  if (usingMongo) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Credenziali non valide." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "Credenziali non valide." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "MMG_BURGER_SECRET_KEY_2026",
      { expiresIn: "30d" },
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }

  const user = findMemoryUser(email);
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Credenziali non valide." });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, user.password);
  if (!isPasswordCorrect) {
    return res
      .status(401)
      .json({ success: false, message: "Credenziali non valide." });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "MMG_BURGER_SECRET_KEY_2026",
    { expiresIn: "30d" },
  );

  return res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

app.post("/api/register", async (req, res) => {
  await initializeAppData();

  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Tutti i campi sono obbligatori." });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "La password deve avere almeno 6 caratteri.",
    });
  }

  const normalizedEmail = email.toLowerCase();

  if (usingMongo) {
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Utente già registrato." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
    });

    return res.status(201).json({ success: true, user: newUser });
  }

  if (findMemoryUser(normalizedEmail)) {
    return res
      .status(400)
      .json({ success: false, message: "Utente già registrato." });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = createMemoryUser({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: "user",
  });

  return res.status(201).json({ success: true, user: newUser });
});

app.post("/api/order", ensureUser, async (req, res) => {
  await initializeAppData();

  const { items, totalPrice } = req.body || {};

  if (!items || items.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Il carrello è vuoto." });
  }

  if (usingMongo) {
    const newOrder = await Order.create({
      userId: req.user.id,
      items,
      totalPrice,
      status: "In preparazione",
    });

    return res.status(201).json({ success: true, order: newOrder });
  }

  const newOrder = createMemoryOrder({
    userId: req.user.id,
    items,
    totalPrice,
    status: "In preparazione",
  });

  return res.status(201).json({ success: true, order: newOrder });
});

app.get("/api/orders", ensureUser, async (req, res) => {
  await initializeAppData();

  if (req.user.role === "admin" || req.user.role === "staff") {
    if (usingMongo) {
      const orders = await Order.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
      return res.status(200).json({ success: true, orders });
    }

    return res.status(200).json({ success: true, orders: getMemoryOrders() });
  }

  if (usingMongo) {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, orders });
  }

  return res
    .status(200)
    .json({ success: true, orders: getMemoryOrdersByUser(req.user.id) });
});

app.get("/api/orders/my-orders", ensureUser, async (req, res) => {
  await initializeAppData();

  if (usingMongo) {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, orders });
  }

  return res
    .status(200)
    .json({ success: true, orders: getMemoryOrdersByUser(req.user.id) });
});

app.put("/api/admin/orders", ensureAdmin, async (req, res) => {
  await initializeAppData();

  const { orderId, newStatus } = req.body || {};
  if (!orderId || !newStatus) {
    return res
      .status(400)
      .json({ success: false, message: "Dati ordine incompleti." });
  }

  if (usingMongo) {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true },
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Ordine non trovato." });
    }

    return res.status(200).json({ success: true, order: updatedOrder });
  }

  const updatedOrder = updateMemoryOrderStatus(orderId, newStatus);
  if (!updatedOrder) {
    return res
      .status(404)
      .json({ success: false, message: "Ordine non trovato." });
  }

  return res.status(200).json({ success: true, order: updatedOrder });
});

export const createApp = () => app;
export default app;

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}
