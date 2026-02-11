import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";
import "./dashboard.css";

const AdminDashbord = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user) return;

    if (user.role !== "admin" && user.role !== "superadmin") {
      navigate("/");
      return;
    }

    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/admin/stats`,
        {
          headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setStats(data.stats);
    } catch (error) {
      console.log(error);
    }
  };

  if (!stats) return <p>Loading...</p>;

  return (
    <Layout>
      <div className="main-content">
        <div className="box">
          <p>Total Courses</p>
          <p>{stats.totalCourses}</p>
        </div>

        <div className="box">
          <p>Total Lectures</p>
          <p>{stats.totalLectures}</p>
        </div>

        <div className="box">
          <p>Total Users</p>
          <p>{stats.totalUsers}</p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashbord;
