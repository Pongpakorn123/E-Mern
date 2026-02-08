import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./QuizStudy.css";

const QuizStudy = ({ user }) => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]); // เก็บคำตอบของผู้ใช้
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // เก็บสถานะคำถามปัจจุบัน
  const [showResult, setShowResult] = useState(false); // เก็บสถานะการแสดงผลลัพธ์
  const [score, setScore] = useState(0); // คะแนนที่ได้
  const [wrongQuestions, setWrongQuestions] = useState([]); // คำถามที่ตอบผิด
  const [submitError, setSubmitError] = useState(null);

  // ฟังก์ชันสับเปลี่ยน (shuffle) เพื่อสุ่มคำถาม
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/quizzes/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });

      // สุ่มคำถามใน quiz ก่อนเก็บลงใน state
      const shuffledQuiz = { ...response.data.quiz, questions: shuffle(response.data.quiz.questions) };
      setQuiz(shuffledQuiz);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleAnswerChange = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = option; // บันทึกคำตอบของคำถามปัจจุบัน
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleSubmitQuiz = async () => {
    try {
      const answersWithIds = quiz.questions.map((question, index) => ({
        questionId: question._id,
        selectedOption: answers[index],
      }));
  
      const response = await axios.post(`http://localhost:5000/api/quizzes/submit/${quiz._id}`, {
        answers: answersWithIds,  // Submit the answers with question IDs
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
      });
  
      const resultScore = response.data.score;
      const incorrectQuestions = quiz.questions.filter(
        (q, index) => answers[index] !== q.correctOption
      );
  
      setScore(resultScore);
      setWrongQuestions(incorrectQuestions);
      setShowResult(true); // Display results
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };
  
  useEffect(() => {
    fetchQuiz();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (showResult) {
    const isPass = score / quiz.questions.length >= 0.5; // คำนวณว่าได้คะแนนเกินครึ่งหรือไม่

    return (
      <div className="result-container">
        <h2>Your Score: {score}</h2>
        {isPass ? (
          <p>Congratulations! You passed the quiz.</p>
        ) : (
          <>
            <p>You scored below 50%. Please try again.</p>
            <h3>Questions you got wrong:</h3>
            <ul>
  {wrongQuestions.map((q, index) => (
    <li key={index}>
      <strong>Question:</strong> {q.question} <br />
      <strong>Your Answer:</strong> {answers[index]} <br />
      <strong>Correct Answer:</strong> {q.correctOption}
    </li>
  ))}
</ul>

          </>
        )}
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">{quiz.title}</h2>
      <div className="quiz-question">
        <p>{currentQuestion.question}</p>
        <div className="quiz-options">
          {currentQuestion.options.map((opt, i) => (
            <label key={i}>
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={opt}
                checked={answers[currentQuestionIndex] === opt}
                onChange={() => handleAnswerChange(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {currentQuestionIndex < quiz.questions.length - 1 ? (
        <button onClick={handleNextQuestion}>Next</button>
      ) : (
        <button onClick={handleSubmitQuiz}>Submit Quiz</button>
      )}
    </div>
  );
};

export default QuizStudy;
