import mongoose from 'mongoose';

const orderItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

export const validDeliverySlots = [
  '09:00-11:00',
  '11:00-13:00',
  '13:00-15:00',
  '15:00-17:00',
  '17:00-19:00',
  '19:00-21:00'
];

const orderSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    darkStore: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'DarkStore',
    },
    orderItems: [orderItemSchema],
    deliveryAddress: {
      address: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    deliveryTimeSlot: {
      type: String,
      enum: validDeliverySlots,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      enum: [
        'PLACED',
        'CONFIRMED',
        'PICKING',
        'PACKED',
        'ASSIGNED',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED',
      ],
      default: 'PLACED',
    },
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryPartner',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
