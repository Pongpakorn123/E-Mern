import React from "react";
import { Link } from "react-router-dom";


const QuizCard = ({ quiz }) => {
  return (
    <div className="quiz-card">
      <h3>{quiz.title}</h3>
      <Link to={`/quizzes/${quiz._id}`} className="quiz-link">
        Start Quiz
      </Link>
    </div>
  );
};

export default QuizCard;