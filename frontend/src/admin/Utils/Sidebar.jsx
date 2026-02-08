import React from "react";
import "./common.css";
import { Link } from "react-router-dom";
import { AiFillHome, AiOutlineLogout } from "react-icons/ai";
import { FaBook, FaUserAlt, FaQuestionCircle, FaListAlt } from "react-icons/fa";  // เพิ่ม FaListAlt
import { UserData } from "../../context/UserContext";

const Sidebar = () => {
  const { user } = UserData();
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to={"/admin/dashboard"}>
            <div className="icon">
              <AiFillHome />
            </div>
            <span>Home</span>
          </Link>
        </li>

        <li>
          <Link to={"/admin/course"}>
            <div className="icon">
              <FaBook />
            </div>
            <span>Courses</span>
          </Link>
        </li>

        {/* เพิ่มเมนู Quizzes */}
        <li>
          <Link to={"/admin/quizzes"}>
            <div className="icon">
              <FaQuestionCircle />
            </div>
            <span>Quizzes</span>
          </Link>
        </li>

        {/* เพิ่มเมนูสำหรับแสดงผลสอบของนักเรียน */}
        <li>
          <Link to={"/admin/results"}> {/* ลิงก์ไปที่หน้าแสดงผลสอบ */}
            <div className="icon">
              <FaListAlt />  {/* ไอคอนแสดงผลสอบ */}
            </div>
            <span>Results</span>
          </Link>
        </li>

        {user && user.mainrole === "superadmin" && (
          <li>
            <Link to={"/admin/users"}>
              <div className="icon">
                <FaUserAlt />
              </div>
              <span>Users</span>
            </Link>
          </li>
        )}

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
