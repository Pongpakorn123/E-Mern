import TryCatch from "../middlewares/TryCatch.js";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";

/* ================= UPLOAD BUFFER ================= */
const uploadFromBuffer = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/* =========================
   CREATE COURSE (IMAGE)
========================= */
export const createCourse = TryCatch(async (req, res) => {
  const { title, description, category, createdBy, duration } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  const imageUpload = await uploadFromBuffer(req.file.buffer, {
    folder: "courses",
  });

  await Courses.create({
    title,
    description,
    category,
    createdBy,
    duration,
    image: imageUpload.secure_url,
    imagePublicId: imageUpload.public_id,
  });

  res.status(201).json({
    message: "Course Created Successfully",
  });
});

/* ================= ADD LECTURE ================= */
export const addLectures = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const { title, description } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Video is required" });
  }

  const videoUpload = await uploadFromBuffer(req.file.buffer, {
    resource_type: "video",
    folder: "lectures",
  });

  const lecture = await Lecture.create({
    title,
    description,
    video: videoUpload.secure_url,
    videoPublicId: videoUpload.public_id,
    course: course._id,
  });

  res.status(201).json({
    message: "Lecture Added Successfully",
    lecture,
  });
});

/* =========================
   DELETE LECTURE
========================= */
export const deleteLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  if (!lecture) {
    return res.status(404).json({ message: "Lecture not found" });
  }

  // ลบ video จาก Cloudinary
  if (lecture.videoPublicId) {
    await cloudinary.uploader.destroy(lecture.videoPublicId, {
      resource_type: "video",
    });
  }

  await lecture.deleteOne();

  res.json({ message: "Lecture Deleted Successfully" });
});

/* =========================
   DELETE COURSE
========================= */
export const deleteCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const lectures = await Lecture.find({ course: course._id });

  // ลบ video ทุกตัวในคอร์ส
  await Promise.all(
    lectures.map(async (lecture) => {
      if (lecture.videoPublicId) {
        await cloudinary.uploader.destroy(lecture.videoPublicId, {
          resource_type: "video",
        });
      }
    })
  );

  // ลบ image คอร์ส
  if (course.imagePublicId) {
    await cloudinary.uploader.destroy(course.imagePublicId);
  }

  await Lecture.deleteMany({ course: course._id });
  await course.deleteOne();

  // เอาคอร์สออกจาก subscription user
  await User.updateMany({}, { $pull: { subscription: course._id } });

  res.json({ message: "Course Deleted Successfully" });
});

/* =========================
   STATS
========================= */
export const getAllStats = TryCatch(async (req, res) => {
  const totalCourses = await Courses.countDocuments();
  const totalLectures = await Lecture.countDocuments();
  const totalUsers = await User.countDocuments();

  res.json({
    stats: {
      totalCourses,
      totalLectures,
      totalUsers,
    },
  });
});

/* =========================
   GET ALL USERS
========================= */
export const getAllUser = TryCatch(async (req, res) => {
  const users = await User.find({
    _id: { $ne: req.user._id },
  }).select("-password");

  res.json({ users });
});

/* =========================
   UPDATE ROLE (SUPERADMIN ONLY)
========================= */
export const updateRole = TryCatch(async (req, res) => {
  // 
  if (req.user.role !== "superadmin") {
    return res.status(403).json({
      message: "Only superadmin can change roles",
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role === "superadmin") {
    return res.status(403).json({
      message: "Cannot modify superadmin role",
    });
  }

  // toggle role
  user.role = user.role === "user" ? "admin" : "user";

  await user.save();

  res.json({
    message: `Role updated to ${user.role}`,
  });
});

