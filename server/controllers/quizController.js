import Quiz from '../models/Quiz.js';
import QuizUser from '../models/QuizUser.js';

// ฟังก์ชันสำหรับดึงผลสอบ
export const getUserResults = async (req, res) => {
  const userId = req.query.userId || req.user.id;

  try {
    const results = await QuizUser.findOne({ userId }).select('quizResults');
    if (!results || results.quizResults.length === 0) {
      return res.status(404).json({ message: "No quiz results found for this user." });
    }
    res.status(200).json({ quizResults: results.quizResults });
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// สร้างข้อสอบใหม่
export const createQuiz = async (req, res) => {
  const { title, questions } = req.body;

  try {
    const existingQuiz = await Quiz.findOne({ title });
    if (existingQuiz) {
      return res.status(400).json({ message: "Quiz with this title already exists" });
    }

    const newQuiz = new Quiz({ title, questions });
    await newQuiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating quiz" });
  }
};

// ฟังก์ชันลบ quiz ตาม quizId
export const deleteQuiz = async (req, res) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    await Quiz.findByIdAndDelete(quizId);
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ message: 'Server error while deleting quiz' });
  }
};

export const submitQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { answers, userId, userName, userEmail } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;
    const wrongQuestions = [];

    // Match answers by questionId, not by index
    answers.forEach((userAnswer) => {
      const question = quiz.questions.find(q => q._id.toString() === userAnswer.questionId);
      if (question && userAnswer.selectedOption === question.correctOption) {
        score++; // Increment score if the answer is correct
      } else {
        wrongQuestions.push(question); // Track wrong questions
      }
    });

    const dateTaken = new Date();

    // Save the result in QuizUser
    await QuizUser.updateOne(
      { userId },
      {
        $push: {
          quizResults: {
            quizId,
            quizTitle: quiz.title,
            score,
            totalQuestions: quiz.questions.length,
            dateTaken,
            userName,
            userEmail,
          },
        },
      },
      { upsert: true }
    );

    return res.status(200).json({ score, wrongQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error submitting quiz" });
  }
};



