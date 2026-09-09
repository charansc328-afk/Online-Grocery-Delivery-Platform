import express from 'express';
import { placeOrder, startPicking, packOrder, assignDeliveryPartner, getOrderById, outForDelivery, deliverOrder, getDeliverySlots, getMyOrders, reorderOrder } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('customer'), placeOrder);

router.route('/delivery-slots')
  .get(protect, authorize('customer'), getDeliverySlots);

router.route('/my-orders')
  .get(protect, authorize('customer'), getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/reorder')
  .post(protect, authorize('customer'), reorderOrder);

router.route('/:id/pick')
  .put(protect, authorize('store_staff', 'admin'), startPicking);

router.route('/:id/pack')
  .put(protect, authorize('store_staff', 'admin'), packOrder);

router.route('/:id/assign')
  .put(protect, authorize('store_staff', 'admin'), assignDeliveryPartner);

router.route('/:id/out-for-delivery')
  .put(protect, authorize('delivery_partner', 'admin'), outForDelivery);

router.route('/:id/deliver')
  .put(protect, authorize('delivery_partner', 'admin'), deliverOrder);

export default router;
