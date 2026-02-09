import Quiz from "../models/Quiz.js";
import QuizUser from "../models/QuizUser.js";
import TryCatch from "../middlewares/TryCatch.js";

/* =========================
   GET USER QUIZ RESULTS
========================= */
export const getUserResults = TryCatch(async (req, res) => {
  const userId = req.user._id;

  const results = await QuizUser.findOne({ userId }).select("quizResults");

  if (!results || results.quizResults.length === 0) {
    return res.json({ quizResults: [] });
  }

  res.json({ quizResults: results.quizResults });
});

/* =========================
   CREATE QUIZ (ADMIN)
========================= */
export const createQuiz = TryCatch(async (req, res) => {
  const { title, questions } = req.body;

  if (!title || !questions || questions.length === 0) {
    return res.status(400).json({
      message: "Title and questions are required",
    });
  }

  const existingQuiz = await Quiz.findOne({ title });
  if (existingQuiz) {
    return res.status(400).json({
      message: "Quiz with this title already exists",
    });
  }

  const quiz = await Quiz.create({ title, questions });

  res.status(201).json({
    message: "Quiz created successfully",
    quiz,
  });
});

/* =========================
   DELETE QUIZ (ADMIN)
========================= */
export const deleteQuiz = TryCatch(async (req, res) => {
  const { quizId } = req.params;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  await Quiz.findByIdAndDelete(quizId);

  res.json({ message: "Quiz deleted successfully" });
});

/* =========================
   SUBMIT QUIZ
========================= */
export const submitQuiz = TryCatch(async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body;
  const userId = req.user._id;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  let score = 0;
  const wrongQuestions = [];

  answers.forEach((userAnswer) => {
    const question = quiz.questions.find(
      (q) => q._id.toString() === userAnswer.questionId
    );

    if (question && userAnswer.selectedOption === question.correctOption) {
      score++;
    } else if (question) {
      wrongQuestions.push(question);
    }
  });

  await QuizUser.updateOne(
    { userId },
    {
      $push: {
        quizResults: {
          quizId,
          quizTitle: quiz.title,
          score,
          totalQuestions: quiz.questions.length,
          dateTaken: new Date(),
        },
      },
    },
    { upsert: true }
  );

  res.json({
    score,
    totalQuestions: quiz.questions.length,
    wrongQuestions,
  });
});
