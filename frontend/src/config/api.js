import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // ถ้าใช้ cookie / jwt
});

export default API;
