import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js"; 
import cors from "cors";
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";
import quizRoutes from "./routes/quizRoutes.js"; 
import adminResultsRoutes from './routes/adminResultsRoutes.js'; 

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.use("/uploads", express.static("uploads"));
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);
app.use("/api/quizzes", quizRoutes);
app.use('/api', adminResultsRoutes); // ปรับเส้นทางนี้ให้ถูกต้อง

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch((error) => {
  console.error("Failed to connect to database:", error);
  process.exit(1);
});
