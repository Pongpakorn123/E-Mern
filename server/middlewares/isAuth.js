import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(403).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.Jwt_Sec);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};
