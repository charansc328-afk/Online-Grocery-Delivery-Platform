import StoreStock from '../models/storeStockModel.js';

// @desc    Update or create stock for a product in a dark store
// @route   POST /api/stock
// @access  Private/Admin/StoreStaff
const updateStock = async (req, res, next) => {
  try {
    const { darkStore, product, quantity, reorderPoint } = req.body;

    let stock = await StoreStock.findOne({ darkStore, product });

    if (stock) {
      // Update existing stock
      stock.quantity = quantity !== undefined ? quantity : stock.quantity;
      stock.reorderPoint = reorderPoint !== undefined ? reorderPoint : stock.reorderPoint;
      const updatedStock = await stock.save();
      res.json(updatedStock);
    } else {
      // Create new stock entry
      stock = new StoreStock({
        darkStore,
        product,
        quantity,
        reorderPoint,
      });
      const createdStock = await stock.save();
      res.status(201).json(createdStock);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get stock for a specific dark store
// @route   GET /api/stock/:storeId
// @access  Public/Private
const getStockByStore = async (req, res, next) => {
  try {
    // Populate product details so the client sees what the item is
    const stock = await StoreStock.find({ darkStore: req.params.storeId }).populate('product', 'name price category');
    res.json(stock);
  } catch (error) {
    next(error);
  }
};

// @desc    Get replenishment alerts (low stock)
// @route   GET /api/stock/replenishment-alerts
// @access  Private/Admin/StoreStaff
const getReplenishmentAlerts = async (req, res, next) => {
  try {
    let query = {};
    
    // Authorization: Store staff can only see their own store. Admin can see all.
    if (req.user.role === 'store_staff') {
      if (!req.user.darkStore) {
        res.status(403);
        throw new Error('You are not authorized. No dark store assigned.');
      }
      query.darkStore = req.user.darkStore;
    } else if (req.user.role === 'admin' && req.query.storeId) {
      // Optional store filter for admin
      query.darkStore = req.query.storeId;
    }

    // $expr is used to compare two fields within the same document: quantity <= reorderPoint
    query.$expr = { $lte: ['$quantity', '$reorderPoint'] };

    const lowStockItems = await StoreStock.find(query)
      .populate('product', 'name category')
      .populate('darkStore', 'name');

    const alerts = lowStockItems.map(item => ({
      store: item.darkStore,
      product: item.product,
      quantity: item.quantity,
      reorderPoint: item.reorderPoint,
      suggestedQuantity: item.reorderPoint - item.quantity,
    }));

    res.json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    next(error);
  }
};

export { updateStock, getStockByStore, getReplenishmentAlerts };
