import express from "express";
import { isAdmin, isAuth, isSuperAdmin } from "../middlewares/isAuth.js";
import {
  addLectures,
  createCourse,
  deleteCourse,
  deleteLecture,
  getAllStats,
  getAllUser,
  updateRole,
} from "../controllers/admin.js";
import { uploadImage, uploadVideo } from "../middlewares/multer.js";

const router = express.Router();

/* COURSE */
router.post("/course/new", isAuth, isAdmin, uploadImage, createCourse);

/* LECTURE */
router.post("/course/:id", isAuth, isAdmin, uploadVideo, addLectures);

router.delete("/course/:id", isAuth, isAdmin, deleteCourse);

router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);

/* ADMIN PANEL */
router.get("/stats", isAuth, isAdmin, getAllStats);

router.get("/users", isAuth, isAdmin, getAllUser);

router.put("/user/:id", isAuth, isSuperAdmin, updateRole);

export default router;

