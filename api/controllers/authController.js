import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import {
  createUser as createMemoryUser,
  findUserByEmail as findMemoryUser,
} from "../config/store.js";
import { initializeAppData, isUsingMongo } from "../config/bootstrap.js";

export const login = async (req, res) => {
  await initializeAppData();

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email e password obbligatorie." });
  }

  if (isUsingMongo()) {
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
};

export const register = async (req, res) => {
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

  if (isUsingMongo()) {
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
};
