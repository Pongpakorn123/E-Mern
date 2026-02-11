import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";

import { connectDb } from "./database/db.js";

import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";
import quizRoutes from "./routes/quizRoutes.js";
import adminResultsRoutes from "./routes/adminResultsRoutes.js";

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

// static (optional)
app.use("/uploads", express.static("uploads"));

/* =========================
   ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("Server is working");
});

// multipart first
app.use("/api/admin", adminRoutes);

// JSON parser
app.use(express.json());

// other routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api", adminResultsRoutes);

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 5000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1);
  });
