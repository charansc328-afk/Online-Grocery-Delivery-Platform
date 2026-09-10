import mongoose from 'mongoose';

const darkStoreSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    // Simplified location for educational purposes. 
    // Real apps would use GeoJSON for geospatial queries.
    pincode: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const DarkStore = mongoose.model('DarkStore', darkStoreSchema);

export default DarkStore;
