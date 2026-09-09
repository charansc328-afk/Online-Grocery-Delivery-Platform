import express from 'express';
import { updateStock, getStockByStore, getReplenishmentAlerts } from '../controllers/storeStockController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('admin', 'store_staff'), updateStock);

router.route('/replenishment-alerts')
  .get(protect, authorize('admin', 'store_staff'), getReplenishmentAlerts);

router.route('/:storeId')
  .get(getStockByStore);

export default router;
