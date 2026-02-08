import React, { useState, useEffect } from "react";
import Layout from "../Utils/Layout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";
import "./adminQuizzes.css";

const AdminCreateQuiz = ({ user }) => {
  const navigate = useNavigate();

  if (user && user.role !== "admin") return navigate("/");

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], correctOption: "" }]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);

  // Fetch existing quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data } = await axios.get(`${server}/api/quizzes`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        setQuizzes(data.quizzes);
      } catch (error) {
        toast.error("Failed to fetch quizzes");
      }
    };

    fetchQuizzes();
  }, []);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctOption: "" }]);
  };

  const handleChangeQuestion = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleChangeOption = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  const handleChangeCorrectOption = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctOption = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const { data } = await axios.post(`${server}/api/quizzes/new`, { title, questions }, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      toast.success(data.message);
      setTitle("");
      setQuestions([{ question: "", options: ["", "", "", ""], correctOption: "" }]);
      setBtnLoading(false);
      setQuizzes([...quizzes, data.quiz]); // เพิ่ม quiz ใหม่ใน state
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };

  // Delete quiz
  const handleDeleteQuiz = async (quizId) => {
    try {
      const { data } = await axios.delete(`${server}/api/quizzes/${quizId}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      toast.success(data.message);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId)); // ลบ quiz ออกจาก state
    } catch (error) {
      toast.error("Failed to delete quiz");
    }
  };

  return (
    <Layout>
      <div className="admin-courses">
        {/* เพิ่มคอนเทนเนอร์ที่ครอบทั้งสองส่วน */}
        <div className="content-container">
          <div className="existing-quizzes">
            <h2>Existing Quizzes</h2>
            <ul>
              {quizzes.map((quiz) => (
                <li key={quiz._id} style={{ display: "flex", alignItems: "center" }}>
                  <button 
                    onClick={() => handleDeleteQuiz(quiz._id)} 
                    style={{ marginRight: "10px" }}
                  >
                    Delete
                  </button>
                  {quiz.title}
                </li>
              ))}
            </ul>
          </div>

          <div className="add-course">
            <div className="course-form">
              <h2>Add Quiz</h2>
              <form onSubmit={handleSubmit}>
                <label htmlFor="text">Quiz Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                {questions.map((q, qIndex) => (
                  <div key={qIndex}>
                    <label htmlFor={`question-${qIndex}`}>Question {qIndex + 1}</label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => handleChangeQuestion(qIndex, e.target.value)}
                      required
                    />
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex}>
                        <label htmlFor={`option-${qIndex}-${optIndex}`}>Option {optIndex + 1}</label>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleChangeOption(qIndex, optIndex, e.target.value)}
                          required
                        />
                      </div>
                    ))}
                    <label htmlFor={`correctOption-${qIndex}`}>Correct Option</label>
                    <input
                      type="text"
                      value={q.correctOption}
                      onChange={(e) => handleChangeCorrectOption(qIndex, e.target.value)}
                      required
                    />
                  </div>
                ))}

                <button type="button" onClick={handleAddQuestion}>
                  Add Question
                </button>

                <button
                  type="submit"
                  disabled={btnLoading}
                  className="common-btn"
                >
                  {btnLoading ? "Please Wait..." : "Add Quiz"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminCreateQuiz;
