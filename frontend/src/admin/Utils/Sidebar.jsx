import React from "react";
import "./common.css";
import { Link } from "react-router-dom";
import { AiFillHome, AiOutlineLogout } from "react-icons/ai";
import { FaBook, FaUserAlt, FaQuestionCircle, FaListAlt } from "react-icons/fa";
import { UserData } from "../../context/UserContext";

const Sidebar = () => {
  const { user } = UserData();

  return (
    <div className="sidebar">
      <ul>

        {/* ===== HOME (ทุก admin เห็น) ===== */}
        <li>
          <Link to={"/admin/dashboard"}>
            <div className="icon">
              <AiFillHome />
            </div>
            <span>Home</span>
          </Link>
        </li>

        {/* ===== ADMIN MENU ===== */}
        {user?.role === "admin" && (
          <>
            <li>
              <Link to={"/admin/course"}>
                <div className="icon">
                  <FaBook />
                </div>
                <span>Courses</span>
              </Link>
            </li>

            <li>
              <Link to={"/admin/quizzes"}>
                <div className="icon">
                  <FaQuestionCircle />
                </div>
                <span>Quizzes</span>
              </Link>
            </li>

            <li>
              <Link to={"/admin/results"}>
                <div className="icon">
                  <FaListAlt />
                </div>
                <span>Results</span>
              </Link>
            </li>
          </>
        )}

        {/* ===== SUPERADMIN MENU ===== */}
        {user?.role === "superadmin" && (
          <li>
            <Link to={"/admin/users"}>
              <div className="icon">
                <FaUserAlt />
              </div>
              <span>Update Role</span>
            </Link>
          </li>
        )}

        {/* ===== LOGOUT ===== */}
        <li>
          <Link to={"/account"}>
            <div className="icon">
              <AiOutlineLogout />
            </div>
            <span>Logout</span>
          </Link>
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;
