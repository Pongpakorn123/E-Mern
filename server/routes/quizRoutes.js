import express from 'express';
import mongoose from 'mongoose';
import { createQuiz, submitQuiz, deleteQuiz, getUserResults } from '../controllers/quizController.js';
import Quiz from '../models/Quiz.js';

const router = express.Router();

// Route สำหรับดึงข้อมูล quizzes ทั้งหมด
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json({ quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Error fetching quizzes" });
  }
});

// Route สำหรับดึงข้อมูล quiz ตาม quizId
router.get('/:quizId', async (req, res) => {
  try {
    const quizId = req.params.quizId;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ message: 'Invalid quiz ID format' });
    }

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    console.log(`Quiz with ID ${quizId} fetched successfully`);
    res.status(200).json({ quiz });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: 'Server error while fetching quiz' });
  }
});

// Route สำหรับสร้างข้อสอบใหม่
router.post('/new', async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Title and questions are required' });
    }

    const newQuiz = new Quiz({ title, questions });
    await newQuiz.save();

    res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Error creating quiz' });
  }
});

// Route สำหรับส่งคำตอบ
router.post('/submit/:quizId', submitQuiz);

// Route สำหรับลบ quiz ตาม quizId
router.delete('/:quizId', deleteQuiz);

// Route สำหรับดึงผลการสอบ
router.get('/results', getUserResults);

export default router;

