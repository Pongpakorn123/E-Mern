import multer from "multer";

const storage = multer.memoryStorage();

/* ================= VIDEO ================= */
const videoUpload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 👈 ปรับตามต้องการ เช่น 200MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"), false);
    }
  },
});

export const uploadVideo = (req, res, next) => {
  videoUpload.single("video")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "Video size too large (Max 200MB allowed)",
        });
      }

      return res.status(400).json({
        message: err.message,
      });
    }
    next();
  });
};

/* ================= IMAGE ================= */
export const uploadImage = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("image");

