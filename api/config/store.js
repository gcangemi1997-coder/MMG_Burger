import { randomUUID } from "crypto";

const memoryUsers = [];
const memoryOrders = [];

export const getMemoryStore = () => ({
  users: memoryUsers,
  orders: memoryOrders,
});

export const findUserByEmail = (email) => {
  const normalizedEmail = email?.toLowerCase();
  return memoryUsers.find((user) => user.email === normalizedEmail) || null;
};

export const createUser = (userData) => {
  const newUser = {
    _id: randomUUID(),
    ...userData,
    email: userData.email.toLowerCase(),
    role: userData.role || "user",
    createdAt: new Date().toISOString(),
  };

  memoryUsers.push(newUser);
  return newUser;
};

export const createOrder = (orderData) => {
  const newOrder = {
    _id: randomUUID(),
    ...orderData,
    status: orderData.status || "In preparazione",
    createdAt: new Date().toISOString(),
  };

  memoryOrders.push(newOrder);
  return newOrder;
};

export const getOrdersByUser = (userId) =>
  memoryOrders
    .filter((order) => order.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

export const getAllOrders = () =>
  [...memoryOrders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

export const updateOrderStatus = (orderId, newStatus) => {
  const order = memoryOrders.find((item) => item._id === orderId);
  if (!order) return null;

  order.status = newStatus;
  return order;
};
