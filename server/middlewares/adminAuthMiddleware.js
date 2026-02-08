import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const isAuthenticated = async (req, res, next) => {
    const token = req.header('token');
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.Jwt_Sec);
      req.user = await User.findById(decoded._id);
      
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Token is not valid" });
    }
  };
  
  export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied, admin only" });
    }
    next();
  };
  