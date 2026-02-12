import express from 'express';
import { getAdminQuizResults } from '../controllers/adminResultsController.js';
import { isAuthenticated, isAdmin } from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

// เส้นทางสำหรับการดึงผลสอบของผู้ดูแลระบบ
router.get('/admin/results', isAuthenticated, isAdmin, getAdminQuizResults);

export default router;

