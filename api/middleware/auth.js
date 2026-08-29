import jwt from "jsonwebtoken";

export const ensureAdmin = (req, res, next) => {
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
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Token non valido." });
  }
};

export const ensureUser = (req, res, next) => {
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
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Token non valido." });
  }
};
