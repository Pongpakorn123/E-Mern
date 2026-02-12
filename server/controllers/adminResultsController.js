import QuizUser from '../models/QuizUser.js';

export const getAdminQuizResults = async (req, res) => {
  try {
    // ดึงข้อมูล QuizUser และ populate ข้อมูล userId และ quizId
    const results = await QuizUser.find().populate('userId', 'name email').populate('quizResults.quizId', 'title');

    // ตรวจสอบผลลัพธ์หลังจาก populate userId
    console.log("Results after populate userId:", results);

    const quizResults = results.flatMap(result =>
      result.quizResults.map(quiz => ({
        userId: result.userId._id,
        userName: result.userId ? result.userId.name : 'Unknown User', // ถ้าไม่เจอ userId จะแสดง Unknown User
        quizTitle: quiz.quizId ? quiz.quizId.title : 'Unknown Quiz',
        score: quiz.score,
        totalQuestions: quiz.totalQuestions,
        dateTaken: quiz.dateTaken,
      }))
    );

    res.status(200).json({ quizResults });
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    res.status(500).json({ message: "Server error" });
  }
};

