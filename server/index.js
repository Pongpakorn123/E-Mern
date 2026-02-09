import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDb } from "./database/db.js";

import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";
import quizRoutes from "./routes/quizRoutes.js";
import adminResultsRoutes from "./routes/adminResultsRoutes.js";

dotenv.config();

const app = express();

/* =========================
   MIDDLEWARE
========================= */

// body parser
app.use(express.json());

// CORS (สำคัญมากสำหรับ Vercel ↔ Render)
app.use(
  cors({
    origin: "*", // ถ้าจะ strict ค่อยเปลี่ยนเป็น domain frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "token", "Authorization"],
  })
);

// static files
app.use("/uploads", express.static("uploads"));

/* =========================
   ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("Server is working");
});

// user / auth
app.use("/api", userRoutes);

// courses
app.use("/api", courseRoutes);

// admin
app.use("/api", adminRoutes);

// quizzes
app.use("/api/quizzes", quizRoutes);

// admin results
app.use("/api", adminResultsRoutes);

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
