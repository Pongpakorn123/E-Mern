import multer from "multer";

const storage = multer.memoryStorage();

export const uploadFiles = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 500, // 500MB
  },
}).single("file");