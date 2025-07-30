import jwt from 'jsonwebtoken';
export const isAuthenticated = async (req, res, next) => {
    const token = req.header('token');
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.Jwt_Sec);
      req.user = decoded; // set req.user to decoded token
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
  