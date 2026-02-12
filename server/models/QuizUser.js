import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz', // เชื่อมโยงกับโมเดล Quiz เพื่อดึงชื่อ Quiz
    required: true,
  },
  quizTitle: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  dateTaken: {
    type: Date,
    default: Date.now, // เก็บวันที่ทำข้อสอบ
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
});

const quizUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // เชื่อมโยงกับโมเดล User เพื่อเก็บข้อมูลผู้ใช้
    required: true,
  },
  quizResults: [quizResultSchema], // เก็บผลการทำข้อสอบเป็น array ของผลลัพธ์
});

export default mongoose.model('QuizUser', quizUserSchema);

