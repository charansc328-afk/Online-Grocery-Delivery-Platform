import express from 'express';
import { createDeliveryPartner } from '../controllers/deliveryPartnerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('admin'), createDeliveryPartner);

export default router;
