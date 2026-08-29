import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { ensureAdmin, ensureUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/order", ensureUser, createOrder);
router.get("/orders", ensureUser, getOrders);
router.get("/orders/my-orders", ensureUser, getMyOrders);
router.put("/admin/orders", ensureAdmin, updateOrderStatus);

export default router;
