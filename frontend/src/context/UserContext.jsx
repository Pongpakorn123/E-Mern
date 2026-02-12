import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { server } from "../main"; // VITE_API_URL

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // LOGIN
  async function loginUser(email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, { email, password });
      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      setIsAuth(false);
    } finally {
      setBtnLoading(false);
    }
  }

  // REGISTER
  async function registerUser(name, email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/register`, { name, email, password });
      toast.success(data.message);
      localStorage.setItem("activationToken", data.activationToken);
      navigate("/verify");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setBtnLoading(false);
    }
  }

  // VERIFY OTP
  async function verifyOtp(otp, navigate) {
    setBtnLoading(true);
    try {
      const activationToken = localStorage.getItem("activationToken");
      const { data } = await axios.post(`${server}/api/user/verify`, { otp, activationToken });
      toast.success(data.message);
      localStorage.removeItem("activationToken");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setBtnLoading(false);
    }
  }

  // FORGOT PASSWORD
  async function forgotPassword(email) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/forgot`, { email });
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setBtnLoading(false);
    }
  }

  // FETCH LOGGED IN USER
  async function fetchUser() {
    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUser(data.user);
      setIsAuth(true);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) fetchUser();
    else setLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{
      user, setUser, isAuth, setIsAuth, btnLoading, loading,
      loginUser, registerUser, verifyOtp, forgotPassword
    }}>
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
