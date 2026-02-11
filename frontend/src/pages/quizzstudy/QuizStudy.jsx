import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./quizstudy.css";

const QuizStudy = ({ user }) => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState([]);

  const shuffle = (array) => {
    const copied = [...array];
    for (let i = copied.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copied[i], copied[j]] = [copied[j], copied[i]];
    }
    return copied;
  };

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/quizzes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const shuffledQuiz = {
        ...response.data.quiz,
        questions: shuffle(response.data.quiz.questions),
      };

      setQuiz(shuffledQuiz);
    } catch (error) {
      console.error("Fetch quiz error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = option;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleSubmitQuiz = async () => {
    try {
      const answersWithIds = quiz.questions.map((question, index) => ({
        questionId: question._id,
        selectedOption: answers[index],
      }));

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/quizzes/submit/${quiz._id}`,
        {
          answers: answersWithIds,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const resultScore = response.data.score;

      const incorrectQuestions = quiz.questions.filter(
        (q, index) => answers[index] !== q.correctOption
      );

      setScore(resultScore);
      setWrongQuestions(incorrectQuestions);
      setShowResult(true);
    } catch (error) {
      console.error("Submit quiz error:", error);
    }
  };
  
  useEffect(() => {
    fetchQuiz();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (showResult) {
    const isPass = score / quiz.questions.length >= 0.5;

    return (
      <div className="result-container">
        <h2>Your Score: {score}</h2>
        {isPass ? (
          <p>Congratulations! You passed the quiz 🎉</p>
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
