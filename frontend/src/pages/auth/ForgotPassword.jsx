import React, { useState } from "react";
import "./auth.css";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext"; // เรียก context
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { btnLoading, forgotPassword } = UserData(); // ดึง function จาก context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email); // เรียก function จาก context
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Enter Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button disabled={btnLoading} className="common-btn">
            {btnLoading ? "Please Wait..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
