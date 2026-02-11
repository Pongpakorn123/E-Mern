import multer from "multer";

const storage = multer.memoryStorage();

/* ================= VIDEO ================= */
const videoUpload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"), false);
    }
  },
});

export const uploadVideo = videoUpload.single("video");

/* ================= IMAGE ================= */
export const uploadImage = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("image");
