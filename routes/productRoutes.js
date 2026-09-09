import express from 'express';
import { createProduct, getProducts } from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('admin'), createProduct)
  .get(getProducts);

export default router;
