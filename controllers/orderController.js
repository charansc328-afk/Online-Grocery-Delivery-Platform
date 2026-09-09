import mongoose from 'mongoose';
import Order, { validDeliverySlots } from '../models/orderModel.js';
import DarkStore from '../models/darkStoreModel.js';
import Product from '../models/productModel.js';
import StoreStock from '../models/storeStockModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Customer
const placeOrder = async (req, res, next) => {
  // Start a Mongoose session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, deliveryAddress, deliveryTimeSlot } = req.body;

    // 1. Validate request payload
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400);
      throw new Error('No order items provided');
    }

    if (!deliveryAddress || !deliveryAddress.pincode || !deliveryAddress.address) {
      res.status(400);
      throw new Error('Delivery address and pincode are required');
    }

    if (!deliveryTimeSlot) {
      res.status(400);
      throw new Error('Delivery time slot is required');
    }

    if (!validDeliverySlots.includes(deliveryTimeSlot)) {
      res.status(400);
      throw new Error('Invalid delivery time slot');
    }

    // 2. Dark Store Selection based on Pincode
    const darkStore = await DarkStore.findOne({
      pincode: deliveryAddress.pincode,
      isActive: true,
    }).session(session);

    if (!darkStore) {
      res.status(400);
      throw new Error('No active dark store serves this pincode.');
    }

    // 3. Product and Stock Validation & Total Calculation
    const orderItemsProcessed = [];
    let calculatedTotalAmount = 0;

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        res.status(400);
        throw new Error('Invalid item data (missing productId or quantity)');
      }

      // Verify product exists and get its real current price
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.productId}`);
      }

      // Verify store stock exists and is sufficient
      const storeStock = await StoreStock.findOne({
        darkStore: darkStore._id,
        product: product._id,
      }).session(session);

      if (!storeStock) {
        res.status(400);
        throw new Error(`Product ${product.name} is not available in the selected dark store.`);
      }

      if (storeStock.quantity < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for ${product.name}. Requested: ${item.quantity}, Available: ${storeStock.quantity}`);
      }

      // Calculate Subtotal and Total
      const subtotal = product.price * item.quantity;
      calculatedTotalAmount += subtotal;

      // Construct item snapshot
      orderItemsProcessed.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal: subtotal,
      });

      // 4. Reduce Stock
      storeStock.quantity -= item.quantity;
      await storeStock.save({ session });
    }

    // 5. Create Order
    const order = new Order({
      customer: req.user._id,
      darkStore: darkStore._id,
      orderItems: orderItemsProcessed,
      deliveryAddress,
      deliveryTimeSlot,
      totalAmount: calculatedTotalAmount,
      status: 'PLACED',
    });

    const createdOrder = await order.save({ session });

    // 6. Commit Transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json(createdOrder);
  } catch (error) {
    // Abort transaction on any error
    await session.abortTransaction();
    session.endSession();
    
    // Pass the error to the global error handler
    next(error);
  }
};

// @desc    Start picking an order
// @route   PUT /api/orders/:id/pick
// @access  Private/StoreStaff/Admin
const startPicking = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Authorization: Check store ownership
    if (req.user.role === 'store_staff') {
      if (!req.user.darkStore || req.user.darkStore.toString() !== order.darkStore.toString()) {
        res.status(403);
        throw new Error('You are not authorized to process orders for this dark store');
      }
    }

    // State validation
    if (order.status !== 'PLACED') {
      res.status(400);
      throw new Error(`Invalid status transition. Order is currently ${order.status}. Only PLACED orders can start PICKING.`);
    }

    // Update status
    order.status = 'PICKING';
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Pack an order
// @route   PUT /api/orders/:id/pack
// @access  Private/StoreStaff/Admin
const packOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Authorization: Check store ownership
    if (req.user.role === 'store_staff') {
      if (!req.user.darkStore || req.user.darkStore.toString() !== order.darkStore.toString()) {
        res.status(403);
        throw new Error('You are not authorized to process orders for this dark store');
      }
    }

    // State validation
    if (order.status !== 'PICKING') {
      res.status(400);
      throw new Error(`Invalid status transition. Order is currently ${order.status}. Only PICKING orders can be PACKED.`);
    }

    // Update status
    order.status = 'PACKED';
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Assign delivery partner to order
// @route   PUT /api/orders/:id/assign
// @access  Private/StoreStaff/Admin
const assignDeliveryPartner = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { deliveryPartnerId } = req.body;

    if (!deliveryPartnerId) {
      res.status(400);
      throw new Error('Delivery partner ID is required');
    }

    const order = await Order.findById(req.params.id).session(session);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Authorization: Check store ownership
    if (req.user.role === 'store_staff') {
      if (!req.user.darkStore || req.user.darkStore.toString() !== order.darkStore.toString()) {
        res.status(403);
        throw new Error('You are not authorized to process orders for this dark store');
      }
    }

    // State validation
    if (order.status !== 'PACKED') {
      res.status(400);
      throw new Error(`Invalid status transition. Order is currently ${order.status}. Only PACKED orders can be assigned.`);
    }

    // import DeliveryPartner locally to avoid circular dependencies if any, or just at top. 
    // Wait, orderController doesn't have DeliveryPartner imported. Let's assume it doesn't and import it at the top later, or use mongoose.model.
    const DeliveryPartner = mongoose.model('DeliveryPartner');
    const partner = await DeliveryPartner.findById(deliveryPartnerId).session(session);

    if (!partner) {
      res.status(404);
      throw new Error('Delivery partner not found');
    }

    // Partner darkStore matching
    if (partner.darkStore.toString() !== order.darkStore.toString()) {
      res.status(403);
      throw new Error('Delivery partner belongs to a different dark store');
    }

    // Partner availability validation
    if (partner.status !== 'AVAILABLE') {
      res.status(400);
      throw new Error(`Delivery partner is currently ${partner.status} and cannot be assigned`);
    }

    // Update partner
    partner.status = 'BUSY';
    partner.currentOrder = order._id;
    await partner.save({ session });

    // Update order
    order.status = 'ASSIGNED';
    order.deliveryPartner = partner._id;
    const updatedOrder = await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json(updatedOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('deliveryPartner', 'name phone user');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Customer can only view their own order
    if (req.user.role === 'customer' && order.customer._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You are not authorized to view this order');
    }

    // Store staff can only view orders from their assigned store
    if (req.user.role === 'store_staff') {
      if (!req.user.darkStore || order.darkStore.toString() !== req.user.darkStore.toString()) {
        res.status(403);
        throw new Error('You are not authorized to view orders for this dark store');
      }
    }

    // Delivery partner can only view assigned orders
    if (req.user.role === 'delivery_partner') {
      if (!order.deliveryPartner || order.deliveryPartner.user?.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('You are not authorized to view this order');
      }
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to out for delivery
// @route   PUT /api/orders/:id/out-for-delivery
// @access  Private/DeliveryPartner/Admin
const outForDelivery = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('deliveryPartner');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (req.user.role === 'delivery_partner') {
      if (!order.deliveryPartner || order.deliveryPartner.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('You are not the assigned delivery partner for this order');
      }
    }

    if (order.status !== 'ASSIGNED') {
      res.status(400);
      throw new Error(`Invalid status transition. Order is currently ${order.status}. Only ASSIGNED orders can be OUT_FOR_DELIVERY.`);
    }

    order.status = 'OUT_FOR_DELIVERY';
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/DeliveryPartner/Admin
const deliverOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(req.params.id).populate('deliveryPartner').session(session);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (req.user.role === 'delivery_partner') {
      if (!order.deliveryPartner || order.deliveryPartner.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('You are not the assigned delivery partner for this order');
      }
    }

    if (order.status !== 'OUT_FOR_DELIVERY') {
      res.status(400);
      throw new Error(`Invalid status transition. Order is currently ${order.status}. Only OUT_FOR_DELIVERY orders can be DELIVERED.`);
    }

    // Update order
    order.status = 'DELIVERED';
    const updatedOrder = await order.save({ session });

    // Update partner
    const DeliveryPartner = mongoose.model('DeliveryPartner');
    const partner = await DeliveryPartner.findById(order.deliveryPartner._id).session(session);
    if (partner) {
      partner.status = 'AVAILABLE';
      partner.currentOrder = undefined;
      await partner.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.json(updatedOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc    Get valid delivery slots
// @route   GET /api/orders/delivery-slots
// @access  Private
const getDeliverySlots = (req, res) => {
  res.json({
    success: true,
    slots: validDeliverySlots
  });
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private/Customer
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder an existing order
// @route   POST /api/orders/:id/reorder
// @access  Private/Customer
const reorderOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { deliveryTimeSlot } = req.body;
    
    // 1. Validate Time Slot
    if (!deliveryTimeSlot) {
      res.status(400);
      throw new Error('Delivery time slot is required');
    }
    if (!validDeliverySlots.includes(deliveryTimeSlot)) {
      res.status(400);
      throw new Error('Invalid delivery time slot');
    }

    // 2. Fetch original order
    const oldOrder = await Order.findById(req.params.id);
    if (!oldOrder) {
      res.status(404);
      throw new Error('Order not found');
    }

    // 3. Check ownership
    if (oldOrder.customer.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You can only reorder your own orders');
    }

    // 4. Map old items to new items format
    const items = oldOrder.orderItems.map(item => ({
      productId: item.product,
      quantity: item.quantity
    }));
    const deliveryAddress = oldOrder.deliveryAddress;

    // --- Core order placement logic ---
    const { address, pincode } = deliveryAddress;
    const darkStore = await DarkStore.findOne({
      pincode: pincode,
      isActive: true,
    }).session(session);

    if (!darkStore) {
      res.status(400);
      throw new Error('No active dark store serves this pincode.');
    }

    const orderItemsProcessed = [];
    let calculatedTotalAmount = 0;
    const StoreStock = mongoose.model('StoreStock');

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.productId}`);
      }

      const storeStock = await StoreStock.findOne({
        darkStore: darkStore._id,
        product: product._id,
      }).session(session);

      if (!storeStock) {
        res.status(400);
        throw new Error(`Product ${product.name} is not available in the selected dark store.`);
      }

      if (storeStock.quantity < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for ${product.name}. Requested: ${item.quantity}, Available: ${storeStock.quantity}`);
      }

      const subtotal = product.price * item.quantity;
      calculatedTotalAmount += subtotal;

      orderItemsProcessed.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal: subtotal,
      });

      storeStock.quantity -= item.quantity;
      await storeStock.save({ session });
    }

    const order = new Order({
      customer: req.user._id,
      darkStore: darkStore._id,
      orderItems: orderItemsProcessed,
      deliveryAddress,
      deliveryTimeSlot,
      totalAmount: calculatedTotalAmount,
      status: 'PLACED',
    });

    const createdOrder = await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(createdOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export { placeOrder, startPicking, packOrder, assignDeliveryPartner, getOrderById, outForDelivery, deliverOrder, getDeliverySlots, getMyOrders, reorderOrder };
