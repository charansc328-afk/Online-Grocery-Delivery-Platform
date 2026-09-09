import DeliveryPartner from '../models/deliveryPartnerModel.js';
import DarkStore from '../models/darkStoreModel.js';

// @desc    Create a new delivery partner
// @route   POST /api/delivery-partners
// @access  Private/Admin
const createDeliveryPartner = async (req, res, next) => {
  try {
    const { name, phone, darkStore, user } = req.body;

    const storeExists = await DarkStore.findById(darkStore);
    if (!storeExists) {
      res.status(400);
      throw new Error('Dark store not found');
    }

    const partner = await DeliveryPartner.create({
      name,
      phone,
      darkStore,
      user,
    });

    res.status(201).json(partner);
  } catch (error) {
    next(error);
  }
};

export { createDeliveryPartner };
