import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const { btnLoading, verifyOtp } = UserData();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    await verifyOtp(otp, navigate); // ✅ ส่ง OTP เป็น string
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Verify Account</h2>
        <form onSubmit={submitHandler}>
          <label htmlFor="otp">OTP</label>
          <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          <button disabled={btnLoading} type="submit">
            {btnLoading ? "Please Wait..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;
