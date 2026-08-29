import Order from "../models/Order.js";
import {
  createOrder as createMemoryOrder,
  getAllOrders as getMemoryOrders,
  getOrdersByUser as getMemoryOrdersByUser,
  updateOrderStatus as updateMemoryOrderStatus,
} from "../config/store.js";
import { initializeAppData, isUsingMongo } from "../config/bootstrap.js";
import { PRODUCT_CATALOG } from "../config/catalog.js";

export const calculateOrderTotal = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return 0;
  }

  return Number(
    items
      .reduce((sum, item) => {
        const productId = String(item?.productId ?? "").trim();
        const quantity = Number(item?.quantity ?? 0);
        const catalogItem = PRODUCT_CATALOG[productId];

        if (!catalogItem) {
          throw new Error(`Prodotto non valido: ${productId || "sconosciuto"}`);
        }

        if (!Number.isFinite(quantity) || quantity <= 0) {
          throw new Error("La quantità di ogni prodotto deve essere valida.");
        }

        return sum + catalogItem.price * quantity;
      }, 0)
      .toFixed(2),
  );
};

const normalizeOrderItems = (items) =>
  items.map((item) => {
    const productId = String(item?.productId ?? "").trim();
    const quantity = Number(item?.quantity ?? 0);
    const catalogItem = PRODUCT_CATALOG[productId];

    if (!catalogItem) {
      throw new Error(`Prodotto non valido: ${productId || "sconosciuto"}`);
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error("La quantità di ogni prodotto deve essere valida.");
    }

    return {
      productId: catalogItem._id,
      name: catalogItem.name,
      quantity,
      price: catalogItem.price,
    };
  });

export const createOrder = async (req, res) => {
  await initializeAppData();

  const { items } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Il carrello è vuoto." });
  }

  try {
    const normalizedItems = normalizeOrderItems(items);
    const totalPrice = calculateOrderTotal(normalizedItems);

    if (isUsingMongo()) {
      const newOrder = await Order.create({
        userId: req.user.id,
        items: normalizedItems,
        totalPrice,
        status: "In preparazione",
      });

      return res.status(201).json({ success: true, order: newOrder });
    }

    const newOrder = createMemoryOrder({
      userId: req.user.id,
      items: normalizedItems,
      totalPrice,
      status: "In preparazione",
    });

    return res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  await initializeAppData();

  if (req.user.role === "admin" || req.user.role === "staff") {
    if (isUsingMongo()) {
      const orders = await Order.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
      return res.status(200).json({ success: true, orders });
    }

    return res.status(200).json({ success: true, orders: getMemoryOrders() });
  }

  if (isUsingMongo()) {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, orders });
  }

  return res
    .status(200)
    .json({ success: true, orders: getMemoryOrdersByUser(req.user.id) });
};

export const getMyOrders = async (req, res) => {
  await initializeAppData();

  if (isUsingMongo()) {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, orders });
  }

  return res
    .status(200)
    .json({ success: true, orders: getMemoryOrdersByUser(req.user.id) });
};

export const updateOrderStatus = async (req, res) => {
  await initializeAppData();

  const { orderId, newStatus } = req.body || {};
  if (!orderId || !newStatus) {
    return res
      .status(400)
      .json({ success: false, message: "Dati ordine incompleti." });
  }

  if (isUsingMongo()) {
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
};
