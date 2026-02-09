import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashbord.css";
import CourseCard from "../../components/coursecard/CourseCard";
import { CourseData } from "../../context/CourseContext";

const Dashbord = () => {
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

      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        throw new Error("User ID or token is missing");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/results?userId=${userId}`,
        {
          headers: {
            token,
          },
        }
      );

      setScores(response.data.quizResults);
    } catch (error) {
      console.error("Error fetching scores:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-dashboard">
      <h2>Dashboard</h2>

      <div className="dashboard-buttons">
        <button onClick={() => setView("courses")}>View Courses</button>
        <button onClick={() => setView("scores")}>View Scores</button>
      </div>

      <div className="dashboard-content">
        {view === "courses" ? (
          <>
            <h3>All Enrolled Courses</h3>
            {mycourse && mycourse.length > 0 ? (
              mycourse.map((e) => (
                <CourseCard key={e._id} course={e} />
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
              scores.map((score, index) => (
                <div key={index} className="score-item">
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

export default Dashbord;
