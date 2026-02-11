import React from "react";
import "./courseCard.css";
import { UserData } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();
  const { fetchCourses } = CourseData();

  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const { data } = await axios.delete(
        `${server}/api/admin/course/${id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="course-card">
      {/* Cloudinary URL ใช้ตรง ๆ ได้เลย */}
      <img src={course.image} alt="" className="course-image" />

      <h3>{course.title}</h3>
      <p>Instructor - {course.createdBy}</p>
      <p>Duration - {course.duration} weeks</p>

      {isAuth ? (
        <>
          {user?.role === "admin" || user?.role === "superadmin" ? (
            <>
              <button
                onClick={() => navigate(`/course/study/${course._id}`)}
                className="common-btn"
              >
                Study
              </button>

              <button
                onClick={() => deleteHandler(course._id)}
                className="common-btn"
                style={{ background: "red", marginTop: "5px" }}
              >
                Delete
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate(`/course/${course._id}`)}
              className="common-btn"
            >
              Get Started
            </button>
          )}
        </>
      ) : (
        <button onClick={() => navigate("/login")} className="common-btn">
          Get Started
        </button>
      )}
    </div>
  );
};

export default CourseCard;
