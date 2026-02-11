import React, { useState, useEffect } from "react";
import Layout from "../Utils/Layout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";
import "./adminQuizzes.css";

const AdminCreateQuiz = ({ user }) => {
  const navigate = useNavigate();

  // ✅ allow admin + superadmin
  if (
    user &&
    user.role !== "admin" &&
    user.role !== "superadmin"
  ) {
    return navigate("/");
  }

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctOption: "" },
  ]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);

  /* ================= FETCH QUIZZES ================= */

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data } = await axios.get(`${server}/api/quizzes`, {
          headers: {
           Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setQuizzes(data.quizzes);
      } catch (error) {
        toast.error("Failed to fetch quizzes");
      }
    };

    fetchQuizzes();
  }, []);

  /* ================= FORM HANDLERS ================= */

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctOption: "" },
    ]);
  };

  const handleChangeQuestion = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleChangeOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleChangeCorrectOption = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctOption = value;
    setQuestions(updated);
  };

  /* ================= CREATE QUIZ ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/quizzes/new`,
        { title, questions },
        {
          headers: {
           Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(data.message);
      setTitle("");
      setQuestions([
        { question: "", options: ["", "", "", ""], correctOption: "" },
      ]);
      setQuizzes([...quizzes, data.quiz]);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create quiz"
      );
    } finally {
      setBtnLoading(false);
    }
  };

  /* ================= DELETE QUIZ ================= */

  const handleDeleteQuiz = async (quizId) => {
    try {
      const { data } = await axios.delete(
        `${server}/api/quizzes/${quizId}`,
        {
          headers: {
           Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(data.message);
      setQuizzes(quizzes.filter((q) => q._id !== quizId));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete quiz"
      );
    }
  };

  return (
    <Layout>
      <div className="admin-courses">
        <div className="content-container">

          <div className="existing-quizzes">
            <h2>Existing Quizzes</h2>
            <ul>
              {quizzes.map((quiz) => (
                <li key={quiz._id}>
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
                <label>Quiz Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                {questions.map((q, qIndex) => (
                  <div key={qIndex}>
                    <label>Question {qIndex + 1}</label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) =>
                        handleChangeQuestion(qIndex, e.target.value)
                      }
                      required
                    />

                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex}>
                        <label>Option {optIndex + 1}</label>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) =>
                            handleChangeOption(
                              qIndex,
                              optIndex,
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                    ))}

                    <label>Correct Option</label>
                    <input
                      type="text"
                      value={q.correctOption}
                      onChange={(e) =>
                        handleChangeCorrectOption(
                          qIndex,
                          e.target.value
                        )
                      }
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
