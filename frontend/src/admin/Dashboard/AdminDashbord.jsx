import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";
import toast from "react-hot-toast";
import "./dashboard.css";

const AdminDashbord = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user) return;

    if (user.role !== "admin" && user.role !== "superadmin") {
      navigate("/");
      return;
    }

    fetchStats();

    if (user.role === "superadmin") {
      fetchUsers();
    }
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

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${server}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUsers(data.users);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const updateRole = async (id) => {
    if (window.confirm("Are you sure you want to update this user role?")) {
      try {
        const { data } = await axios.put(
          `${server}/api/user/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        toast.success(data.message);
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || "Update failed");
      }
    }
  };

  if (!stats) return <p>Loading...</p>;

  return (
    <Layout>
      <div className="main-content">
        {/* ====== Stats ====== */}
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

      {/* ====== UPDATE ROLE (Superadmin Only) ====== */}
      
    </Layout>
  );
};

export default AdminDashbord;
