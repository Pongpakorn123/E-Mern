import express from 'express';
import { uploadFiles } from '../middlewares/multer.js'; // Import multer middleware

const router = express.Router();

// Route สำหรับการอัปโหลดรูปภาพ
router.post('/upload', uploadFiles, (req, res) => {
  try {
    // ตรวจสอบว่ามีไฟล์ถูกอัปโหลดหรือไม่
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // ส่งการตอบกลับเมื่อไฟล์ถูกอัปโหลดสำเร็จ
    res.status(201).json({
      message: 'File uploaded successfully',
      filename: req.file.filename, // ชื่อไฟล์ที่ถูกอัปโหลด
      path: req.file.path, // พาธไฟล์
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
