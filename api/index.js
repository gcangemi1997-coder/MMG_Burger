import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", orderRoutes);

export const createApp = () => app;
export default app;

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}
