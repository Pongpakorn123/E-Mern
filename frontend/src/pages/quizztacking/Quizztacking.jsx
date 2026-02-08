import React, { useState, useEffect } from "react";
import Layout from "../Utils/Layout";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";
import "./quizTaking.css";

const QuizTakingPage = () => {
  const navigate = useNavigate();
  const { quizId } = useParams(); // ดึง quizId จาก URL

  const [quiz, setQuiz] = useState(null); // เก็บข้อมูลข้อสอบ
  const [answers, setAnswers] = useState([]); // เก็บคำตอบของผู้ใช้
  const [submitted, setSubmitted] = useState(false); // เช็คว่าผู้ใช้ทำข้อสอบเสร็จแล้วหรือยัง

  // ดึงข้อมูล quiz จากเซิร์ฟเวอร์
  const fetchQuizData = async () => {
    try {
      const { data } = await axios.get(`${server}/api/quizzes/${quizId}`);
      setQuiz(data.quiz);
    } catch (error) {
      toast.error("Failed to load quiz.");
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, [quizId]);

  const handleAnswerChange = (qIndex, selectedOption) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = selectedOption;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (answers.length !== quiz.questions.length) {
      toast.error("Please answer all the questions.");
      return;
    }

    try {
      const { data } = await axios.post(`${server}/api/quizzes/submit/${quizId}`, {
        answers,
      });

      toast.success(`You scored ${data.score} out of ${quiz.questions.length}`);
      setSubmitted(true);
    } catch (error) {
      toast.error("Error submitting the quiz.");
    }
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="quiz-taking">
        <h1>{quiz.title}</h1>
        <form onSubmit={handleSubmit}>
          {quiz.questions.map((q, qIndex) => (
            <div key={qIndex} className="question">
              <h2>Question {qIndex + 1}: {q.question}</h2>
              {q.options.map((opt, optIndex) => (
                <div key={optIndex}>
                  <input
                    type="radio"
                    id={`question-${qIndex}-option-${optIndex}`}
                    name={`question-${qIndex}`}
                    value={opt}
                    onChange={() => handleAnswerChange(qIndex, opt)}
                  />
                  <label htmlFor={`question-${qIndex}-option-${optIndex}`}>{opt}</label>
                </div>
              ))}
            </div>
          ))}
          <button type="submit" className="submit-quiz" disabled={submitted}>
            {submitted ? "Quiz Submitted" : "Submit Quiz"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default QuizTakingPage;
