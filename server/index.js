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

//  FIXED CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://e-mern.vercel.app", // domain หลัก
  "https://e-mern-6152vxca-pongpakorn123s-projects.vercel.app", // preview domain
  process.env.CLIENT_URL, // จาก Render env
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow Postman / mobile apps
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json());

// static
app.use("/uploads", express.static("uploads"));

/* =========================
   ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("Server is working");
});

// admin routes
app.use("/api/admin", adminRoutes);

// other routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api", adminResultsRoutes);

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
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
      console.log(`✅ MongoDB connected`);
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1);
  });
