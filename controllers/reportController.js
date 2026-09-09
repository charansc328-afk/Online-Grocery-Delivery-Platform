import Order from '../models/orderModel.js';
import mongoose from 'mongoose';

// @desc    Get performance report
// @route   GET /api/admin/reports/performance
// @access  Private/Admin
const getPerformanceReport = async (req, res, next) => {
  try {
    const { storeId, deliveryPartnerId } = req.query;

    const matchStage = {};

    if (storeId) {
      if (mongoose.Types.ObjectId.isValid(storeId)) {
        matchStage.darkStore = new mongoose.Types.ObjectId(storeId);
      } else {
        res.status(400);
        throw new Error('Invalid storeId filter');
      }
    }

    if (deliveryPartnerId) {
      if (mongoose.Types.ObjectId.isValid(deliveryPartnerId)) {
        matchStage.deliveryPartner = new mongoose.Types.ObjectId(deliveryPartnerId);
      } else {
        res.status(400);
        throw new Error('Invalid deliveryPartnerId filter');
      }
    }

    // 1. Overall Performance Pipeline
    const overallPipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          placedOrders: { $sum: { $cond: [{ $eq: ['$status', 'PLACED'] }, 1, 0] } },
          confirmedOrders: { $sum: { $cond: [{ $eq: ['$status', 'CONFIRMED'] }, 1, 0] } },
          pickingOrders: { $sum: { $cond: [{ $eq: ['$status', 'PICKING'] }, 1, 0] } },
          packedOrders: { $sum: { $cond: [{ $eq: ['$status', 'PACKED'] }, 1, 0] } },
          assignedOrders: { $sum: { $cond: [{ $eq: ['$status', 'ASSIGNED'] }, 1, 0] } },
          outForDeliveryOrders: { $sum: { $cond: [{ $eq: ['$status', 'OUT_FOR_DELIVERY'] }, 1, 0] } },
          deliveredOrders: { $sum: { $cond: [{ $eq: ['$status', 'DELIVERED'] }, 1, 0] } },
          cancelledOrders: { $sum: { $cond: [{ $eq: ['$status', 'CANCELLED'] }, 1, 0] } },
        }
      }
    ];

    // 2. Store Performance Pipeline
    const storePipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$darkStore',
          totalOrders: { $sum: 1 },
          deliveredOrders: { $sum: { $cond: [{ $eq: ['$status', 'DELIVERED'] }, 1, 0] } },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $lookup: {
          from: 'darkstores', // The collection name in MongoDB for dark stores
          localField: '_id',
          foreignField: '_id',
          as: 'storeDetails'
        }
      },
      { $unwind: { path: '$storeDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          store: { $ifNull: ['$storeDetails.name', 'Unknown Store'] },
          totalOrders: 1,
          deliveredOrders: 1,
          revenue: 1
        }
      }
    ];

    // 3. Delivery Partner Performance Pipeline
    const deliveryPipeline = [
      { $match: { ...matchStage, deliveryPartner: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$deliveryPartner',
          assignedOrders: { $sum: 1 },
          deliveredOrders: { $sum: { $cond: [{ $eq: ['$status', 'DELIVERED'] }, 1, 0] } }
        }
      },
      {
        $lookup: {
          from: 'users', // Delivery partners are in the users collection
          localField: '_id',
          foreignField: '_id',
          as: 'partnerDetails'
        }
      },
      { $unwind: { path: '$partnerDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          partnerName: { $ifNull: ['$partnerDetails.name', 'Unknown Partner'] },
          assignedOrders: 1,
          deliveredOrders: 1
        }
      }
    ];

    const [overallResult, storePerformance, deliveryPerformance] = await Promise.all([
      Order.aggregate(overallPipeline),
      Order.aggregate(storePipeline),
      Order.aggregate(deliveryPipeline)
    ]);

    const defaultOverall = {
      totalOrders: 0,
      totalRevenue: 0,
      placedOrders: 0,
      confirmedOrders: 0,
      pickingOrders: 0,
      packedOrders: 0,
      assignedOrders: 0,
      outForDeliveryOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
    };

    const overall = overallResult.length > 0 ? {
      totalOrders: overallResult[0].totalOrders,
      totalRevenue: overallResult[0].totalRevenue,
      placedOrders: overallResult[0].placedOrders,
      confirmedOrders: overallResult[0].confirmedOrders,
      pickingOrders: overallResult[0].pickingOrders,
      packedOrders: overallResult[0].packedOrders,
      assignedOrders: overallResult[0].assignedOrders,
      outForDeliveryOrders: overallResult[0].outForDeliveryOrders,
      deliveredOrders: overallResult[0].deliveredOrders,
      cancelledOrders: overallResult[0].cancelledOrders,
    } : defaultOverall;

    res.json({
      success: true,
      overall,
      storePerformance,
      deliveryPerformance
    });
  } catch (error) {
    next(error);
  }
};

export { getPerformanceReport };
