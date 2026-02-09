import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String, // cloudinary secure_url
    required: true,
  },

  imagePublicId: {
    type: String, // 🔥 สำคัญมาก สำหรับลบรูป
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  createdBy: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Courses = mongoose.model("Courses", schema);
