import express from 'express';
import { createDarkStore, getDarkStores } from '../controllers/darkStoreController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('admin'), createDarkStore)
  .get(getDarkStores);

export default router;
