import React, { useEffect, useState } from "react";
import { useQuizContext } from "../../context/QuizContext";
import "./Quizzes.css";

const Quizzes = () => {
  const { quizzes, loading } = useQuizContext();  // Make sure `loading` is provided by context

  console.log("Quizzes data:", quizzes); // ตรวจสอบข้อมูล
  
  // Loading state
  if (loading) {
    return <p>Loading quizzes...</p>;
  }

  // No quizzes available
  if (!quizzes || quizzes.length === 0) {
    return <p>No quizzes available.</p>;
  }

  return (
    <div className="quizzes-container">
      <h2 className="quizzes-title">Available Quizzes</h2>
      <div className="quizzes-list">
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="quiz-card">
            <h3>{quiz.title}</h3>
            <p>Number of Questions: {quiz.questions.length}</p>
            <button
              className="quiz-button"
              onClick={() => {
                window.location.href = `/quiz/${quiz._id}`;
              }}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quizzes;
