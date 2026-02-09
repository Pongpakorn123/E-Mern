import express from "express";
import {
  getAllCourses,
  getSingleCourse,
  fetchLectures,
  fetchLecture,
  getMyCourses,
} from "../controllers/course.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// ================== PUBLIC ==================
router.get("/course/all", getAllCourses);
router.get("/course/:id", getSingleCourse);

// เปิดดูบทเรียนได้ทุกคน
router.get("/lectures/:id", fetchLectures);
router.get("/lecture/:id", fetchLecture);

// mycourse = แค่ดึงคอร์สทั้งหมด → ไม่ต้อง auth
router.get("/mycourse", getMyCourses);

export default router;
