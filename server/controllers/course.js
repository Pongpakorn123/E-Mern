import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";
import { Progress } from "../models/Progress.js";

export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find();
  res.json({
    courses,
  });
});

export const getSingleCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  res.json({
    course,
  });
});

export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });

  if (!lectures.length) {
    return res.status(404).json({
      message: "No lectures found for this course",
    });
  }

  // No subscription check here
  res.json({ lectures });
});

export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  if (!lecture) {
    return res.status(404).json({
      message: "Lecture not found",
    });
  }

  // No subscription check here
  res.json({ lecture });
});

export const getMyCourses = TryCatch(async (req, res) => {
  // ดึงข้อมูลคอร์สทั้งหมดจากฐานข้อมูล
  const courses = await Courses.find();
  res.json({
    courses,
  });
});
export const checkout = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  const course = await Courses.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  // No subscription check here
  // const options = {
  //   amount: Number(course.price * 100), // Razorpay expects amount in paise
  //   currency: "INR",
  // };

  const order = await instance.orders.create(options);

  res.status(201).json({
    order,
    course,
  });
});

export const addProgress = TryCatch(async (req, res) => {
  const progress = await Progress.findOne({
    user: req.user._id,
    course: req.query.course,
  });

  const { lectureId } = req.query;

  if (!progress) {
    const newProgress = await Progress.create({
      user: req.user._id,
      course: req.query.course,
      completedLectures: [],
    });
    return res.status(201).json({
      message: "New Progress created",
      progress: newProgress,
    });
  }

  if (progress.completedLectures.includes(lectureId)) {
    return res.json({
      message: "Progress recorded",
    });
  }

  progress.completedLectures.push(lectureId);
  await progress.save();

  res.status(201).json({
    message: "New Progress added",
  });
});

export const getYourProgress = TryCatch(async (req, res) => {
  const progress = await Progress.find({
    user: req.user._id,
    course: req.query.course,
  });

  if (progress.length === 0) {
    return res.status(404).json({ message: "null" });
  }

  const allLectures = (await Lecture.find({ course: req.query.course })).length;
  const completedLectures = progress[0].completedLectures.length;
  const courseProgressPercentage = (completedLectures * 100) / allLectures;

  res.json({
    courseProgressPercentage,
    completedLectures,
    allLectures,
    progress,
  });
});
