const Order = require('../models/Order');
const Company = require('../models/Company');
const Driver = require('../models/Driver');

// @desc    Create a new transport order
// @route   POST /api/orders
// @access  Private (Company only)
const createOrder = async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    const {
      pickupLocation, dropLocation, materialType, materialWeight,
      vehicleTypeRequired, numberOfVehicles, pickupDate, deliveryDate,
      charges, billingMethod, extraNotes
    } = req.body;

    // Basic dynamic pricing mock calculation based on weight
    const basePrice = 5000;
    const weightPrice = materialWeight * 10;
    const estimatedCost = basePrice + weightPrice + (charges?.loading || 0) + (charges?.unloading || 0) + (charges?.toll || 0);

    const order = await Order.create({
      companyId: company._id,
      pickupLocation,
      dropLocation,
      materialType,
      materialWeight,
      vehicleTypeRequired,
      numberOfVehicles,
      pickupDate,
      deliveryDate,
      charges,
      billingMethod,
      estimatedCost,
      extraNotes
    });

    const populatedOrder = await Order.findById(order._id).populate('companyId', 'companyName phone');

    const io = req.app.get('socketio');
    if (io) {
      io.emit('new_order', populatedOrder);
    }

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active orders for a company
// @route   GET /api/orders/company
// @access  Private (Company only)
const getCompanyOrders = async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    const orders = await Order.find({ companyId: company._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available orders for drivers
// @route   GET /api/orders/available
// @access  Private (Driver only)
const getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Created' })
      .populate('companyId', 'companyName phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept an order (Driver)
// @route   PUT /api/orders/:id/accept
// @access  Private (Driver only)
const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Created') {
      return res.status(400).json({ message: 'Order is no longer available' });
    }

    const driver = await Driver.findOne({ userId: req.user._id });
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    // Usually we'd create a Trip here or mark order as Pending Approval
    order.status = 'Accepted';
    order.driverId = driver._id;
    await order.save();

    const io = req.app.get('socketio');
    if (io) {
      // Emit directly to the company's room (using companyId as room name)
      io.to(`company_${order.companyId}`).emit('order_accepted', { order, driver });
    }

    res.json({ message: 'Order accepted successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get driver requests (accepted orders) for a company
// @route   GET /api/orders/company/requests
// @access  Private (Company only)
const getDriverRequests = async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    const requests = await Order.find({ companyId: company._id, status: 'Accepted' })
      .populate('driverId')
      .sort({ updatedAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a driver for an order
// @route   PUT /api/orders/:id/approve
// @access  Private (Company only)
const approveDriver = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.status = 'In Progress'; // This starts the trip
    await order.save();
    
    res.json({ message: 'Driver approved and trip started', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders for a driver (Accepted, In Progress, Delivered)
// @route   GET /api/orders/driver
// @access  Private (Driver only)
const getDriverOrders = async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.user._id });
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    const orders = await Order.find({ driverId: driver._id })
      .populate('companyId', 'companyName phone')
      .sort({ updatedAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getCompanyOrders,
  getAvailableOrders,
  acceptOrder,
  getDriverRequests,
  approveDriver,
  getDriverOrders
};
