import TryCatch from "../middlewares/TryCatch.js";
import cloudinary from "../config/cloudinary.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";

/* =========================
   CREATE COURSE
========================= */
export const createCourse = TryCatch(async (req, res) => {
  const { title, description, category, createdBy, duration, price } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  const imageUpload = await cloudinary.v2.uploader.upload(
    `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
    {
      folder: "courses",
    }
  );

  await Courses.create({
    title,
    description,
    category,
    createdBy,
    duration,
    price,
    image: imageUpload.secure_url,
    imagePublicId: imageUpload.public_id,
  });

  res.status(201).json({
    message: "Course Created Successfully",
  });
});

/* =========================
   ADD LECTURE
========================= */
export const addLectures = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      message: "No Course with this id",
    });
  }

  const { title, description } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Video is required" });
  }

  const videoUpload = await cloudinary.v2.uploader.upload(
    `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
    {
      resource_type: "video",
      folder: "lectures",
    }
  );

  const lecture = await Lecture.create({
    title,
    description,
    video: videoUpload.secure_url,
    videoPublicId: videoUpload.public_id,
    course: course._id,
  });

  res.status(201).json({
    message: "Lecture Added",
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

  // delete video from cloudinary
  if (lecture.videoPublicId) {
    await cloudinary.v2.uploader.destroy(lecture.videoPublicId, {
      resource_type: "video",
    });
  }

  await lecture.deleteOne();

  res.json({ message: "Lecture Deleted" });
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

  // delete all lecture videos
  await Promise.all(
    lectures.map(async (lecture) => {
      if (lecture.videoPublicId) {
        await cloudinary.v2.uploader.destroy(lecture.videoPublicId, {
          resource_type: "video",
        });
      }
    })
  );

  // delete course image
  if (course.imagePublicId) {
    await cloudinary.v2.uploader.destroy(course.imagePublicId);
  }

  await Lecture.deleteMany({ course: course._id });
  await course.deleteOne();

  // remove course from user subscriptions
  await User.updateMany({}, { $pull: { subscription: course._id } });

  res.json({
    message: "Course Deleted",
  });
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
   USERS
========================= */
export const getAllUser = TryCatch(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select(
    "-password"
  );

  res.json({ users });
});

/* =========================
   UPDATE ROLE
========================= */
export const updateRole = TryCatch(async (req, res) => {
  if (req.user.mainrole !== "superadmin") {
    return res.status(403).json({
      message: "This endpoint is assigned to superadmin only",
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.role = user.role === "user" ? "admin" : "user";
  await user.save();

  res.status(200).json({
    message: `Role updated to ${user.role}`,
  });
});
