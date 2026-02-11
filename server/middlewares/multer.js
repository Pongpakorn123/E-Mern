import multer from "multer";

const storage = multer.memoryStorage();

const videoUpload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // ✅ แนะนำ 500MB ก่อน (Cloudinary free ก็จำกัด)
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
      return res.status(413).json({
        message: err.message || "Video too large",
      });
    }
    next();
  });
};

export const uploadImage = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("image");
