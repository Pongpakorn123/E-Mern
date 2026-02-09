import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/quizzes`
        );
        setQuizzes(res.data.quizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <QuizContext.Provider value={{ quizzes }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = () => useContext(QuizContext);
