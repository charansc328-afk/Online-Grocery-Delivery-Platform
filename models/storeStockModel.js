import mongoose from 'mongoose';

const storeStockSchema = mongoose.Schema(
  {
    darkStore: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'DarkStore',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    reorderPoint: {
      type: Number,
      required: true,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate product entries in the same store
storeStockSchema.index({ darkStore: 1, product: 1 }, { unique: true });

const StoreStock = mongoose.model('StoreStock', storeStockSchema);

export default StoreStock;
