import React, { useEffect, useState } from "react";
import "./adminUsers.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Layout from "../Utils/Layout";
import toast from "react-hot-toast";

const AdminUsers = ({ user }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user) return;

    if (user.role !== "superadmin") {
      navigate("/");
      return;
    }

    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUsers(data.users);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const updateRole = async (id) => {
    if (!window.confirm("Are you sure you want to update this user role?"))
      return;

    try {
      const { data } = await axios.put(
        `${server}/api/admin/user/${id}`,
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
      toast.error(
        error.response?.data?.message || "Failed to update role"
      );
    }
  };

  if (!user || user.role !== "superadmin") return null;

  return (
    <Layout>
      <div className="users-container">
        <h1 className="users-title">User Management</h1>

        <div className="users-card">
          <table className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((e, i) => (
                <tr key={e._id}>
                  <td>{i + 1}</td>
                  <td>{e.name}</td>
                  <td>{e.email}</td>
                  <td>
                    <span
                      className={`role-badge ${e.role}`}
                    >
                      {e.role}
                    </span>
                  </td>
                  <td>
                    {e.role !== "superadmin" && (
                      <button
                        onClick={() => updateRole(e._id)}
                        className="update-btn"
                      >
                        Update Role
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUsers;
