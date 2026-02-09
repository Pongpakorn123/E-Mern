import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { Progress } from "../models/Progress.js";

/* =======================
   COURSE
======================= */

export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find();
  res.json({ courses });
});

export const getSingleCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.json({ course });
});

/* =======================
   LECTURE
======================= */

export const fetchLectures = TryCatch(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Course id is required" });
  }

  const lectures = await Lecture.find({ course: id });

  res.json({ lectures });
});

export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  if (!lecture) {
    return res.status(404).json({ message: "Lecture not found" });
  }

  res.json({ lecture });
});

/* =======================
   USER COURSES
======================= */

export const getMyCourses = TryCatch(async (req, res) => {
  // ถ้าอยาก strict จริง → filter ตาม user ได้ภายหลัง
  const courses = await Courses.find();
  res.json({ courses });
});

/* =======================
   PROGRESS
======================= */

export const addProgress = TryCatch(async (req, res) => {
  const courseId = req.query.course;
  const lectureId = req.query.lectureId;

  if (!courseId || !lectureId) {
    return res.status(400).json({
      message: "course and lectureId are required",
    });
  }

  let progress = await Progress.findOne({
    user: req.user._id,
    course: courseId,
  });

 
  if (!progress) {
    progress = await Progress.create({
      user: req.user._id,
      course: courseId,
      completedLectures: [lectureId],
    });

    return res.status(201).json({
      message: "Progress created",
      progress,
    });
  }


  if (!progress.completedLectures.includes(lectureId)) {
    progress.completedLectures.push(lectureId);
    await progress.save();
  }

  res.json({ message: "Progress updated" });
});

export const getYourProgress = TryCatch(async (req, res) => {
  const courseId = req.query.course;

  if (!courseId) {
    return res.status(400).json({
      message: "course query is required",
    });
  }

  const progress = await Progress.findOne({
    user: req.user._id,
    course: courseId,
  });

  const allLectures = await Lecture.countDocuments({ course: courseId });


  if (!progress) {
    return res.json({
      courseProgressPercentage: 0,
      completedLectures: 0,
      allLectures,
      progress: [],
    });
  }

  const completedLectures = progress.completedLectures.length;

  const courseProgressPercentage =
    allLectures === 0 ? 0 : (completedLectures * 100) / allLectures;

  res.json({
    courseProgressPercentage,
    completedLectures,
    allLectures,
    progress: [progress], // 🔥 frontend ใช้ progress[0]
  });
});
