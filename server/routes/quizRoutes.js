import express from "express";
import mongoose from "mongoose";
import {
  createQuiz,
  submitQuiz,
  deleteQuiz,
  getUserResults,
} from "../controllers/quizController.js";
import Quiz from "../models/Quiz.js";
import { isAuth, isAdmin } from "../middlewares/isAuth.js";

const router = express.Router();

// ================== GET ALL QUIZZES ==================
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json({ quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Error fetching quizzes" });
  }
});

// ================== GET USER RESULTS ==================
// ⚠️ ต้องมาก่อน /:quizId
router.get("/results", isAuth, getUserResults);

// ================== GET QUIZ BY ID ==================
router.get("/:quizId", isAuth, async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ message: "Invalid quiz ID format" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({ quiz });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Server error while fetching quiz" });
  }
});

// ================== CREATE QUIZ (ADMIN) ==================
router.post("/new", isAuth, isAdmin, createQuiz);

// ================== SUBMIT QUIZ ==================
router.post("/submit/:quizId", isAuth, submitQuiz);

// ================== DELETE QUIZ (ADMIN) ==================
router.delete("/:quizId", isAuth, isAdmin, deleteQuiz);

export default router;
