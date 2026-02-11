import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";
import CourseCard from "../../components/coursecard/CourseCard";
import { CourseData } from "../../context/CourseContext";

const Dashboard = () => {
  const { mycourse, user } = CourseData();
  const [view, setView] = useState("courses");
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (view === "scores" && user) {
      fetchScores();
    }
  }, [view, user]);

  const fetchScores = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token is missing");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/results`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setScores(response.data.quizResults || []);
    } catch (error) {
      console.error(
        "Error fetching scores:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-dashboard">
      <h2>Dashboard</h2>

      <div className="dashboard-buttons">
        <button
          className={view === "courses" ? "active" : ""}
          onClick={() => setView("courses")}
        >
          View Courses
        </button>

        <button
          className={view === "scores" ? "active" : ""}
          onClick={() => setView("scores")}
        >
          View Scores
        </button>
      </div>

      <div className="dashboard-content">
        {view === "courses" ? (
          <>
            <h3>All Enrolled Courses</h3>

            {mycourse && mycourse.length > 0 ? (
              mycourse.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))
            ) : (
              <p>No courses enrolled yet</p>
            )}
          </>
        ) : (
          <>
            <h3>Your Scores</h3>

            {loading ? (
              <p>Loading scores...</p>
            ) : scores.length > 0 ? (
              scores.map((score) => (
                <div key={score._id} className="score-item">
                  <p>Quiz: {score.quizTitle}</p>
                  <p>
                    Score: {score.score}/{score.totalQuestions}
                  </p>
                  <p>
                    Date Taken:{" "}
                    {new Date(score.dateTaken).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No scores available</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
