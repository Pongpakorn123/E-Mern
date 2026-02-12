import axios from "axios";

const API = axios.create({
  baseURL: "https://e-mern-j72c.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.token = token; // 🔥 สำคัญมาก (backend อ่าน req.headers.token)
  }
  return req;
});

export default API;


