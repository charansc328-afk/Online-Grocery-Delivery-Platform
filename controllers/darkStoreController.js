import DarkStore from '../models/darkStoreModel.js';

// @desc    Create a dark store
// @route   POST /api/darkstores
// @access  Private/Admin
const createDarkStore = async (req, res, next) => {
  try {
    const { name, address, pincode } = req.body;

    const store = new DarkStore({
      name,
      address,
      pincode,
    });

    const createdStore = await store.save();
    res.status(201).json(createdStore);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all dark stores
// @route   GET /api/darkstores
// @access  Public (or Private depending on business rule)
const getDarkStores = async (req, res, next) => {
  try {
    const stores = await DarkStore.find({});
    res.json(stores);
  } catch (error) {
    next(error);
  }
};

export { createDarkStore, getDarkStores };
