import express from 'express';
import { getPerformanceReport } from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/performance')
  .get(protect, authorize('admin'), getPerformanceReport);

export default router;
