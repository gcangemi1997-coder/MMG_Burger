import bcrypt from "bcryptjs";

import connectDB from "./db.js";
import {
  createUser as createMemoryUser,
  findUserByEmail as findMemoryUser,
} from "./store.js";
import User from "../models/User.js";

export let dbReadyChecked = false;
export let usingMongo = false;

let initPromise = null;

export const ensureDatabase = async () => {
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

export const initializeAppData = async () => {
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

export const isUsingMongo = () => usingMongo;
