import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

/* =========================
   AUTH
========================= */

export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.Jwt_Sec);

    if (!decoded?._id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* =========================
   ADMIN
========================= */

export const isAdmin = (req, res, next) => {
  if (!["admin", "superadmin"].includes(req.user.role)) {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

/* =========================
   SUPER ADMIN
========================= */

export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({
      message: "Superadmin only",
    });
  }
  next();
};

