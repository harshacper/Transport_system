const express = require('express');
const router = express.Router();
const {
  createOrder,
  getCompanyOrders,
  getAvailableOrders,
  acceptOrder,
  getDriverRequests,
  approveDriver,
  getDriverOrders
} = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, authorize('Company'), createOrder);
router.get('/company', protect, authorize('Company'), getCompanyOrders);
router.get('/company/requests', protect, authorize('Company'), getDriverRequests);
router.get('/available', protect, authorize('Driver'), getAvailableOrders);
router.get('/driver', protect, authorize('Driver'), getDriverOrders);
router.put('/:id/accept', protect, authorize('Driver'), acceptOrder);
router.put('/:id/approve', protect, authorize('Company'), approveDriver);

module.exports = router;
