const prisma = require('../config/prisma');

// @desc    Create a new transport order
// @route   POST /api/orders
// @access  Private (Company only)
const createOrder = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const company = await prisma.company.findUnique({ where: { userId } });
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    const {
      pickupLocation, dropLocation, materialType, materialWeight,
      vehicleTypeRequired, numberOfVehicles, pickupDate, deliveryDate,
      charges, billingMethod, extraNotes
    } = req.body;

    const parsedMaterialWeight = parseFloat(materialWeight) || 0;
    const parsedNumberOfVehicles = parseInt(numberOfVehicles, 10) || 1;
    const parsedLoadingCharge = parseFloat(charges?.loading) || 0;
    const parsedUnloadingCharge = parseFloat(charges?.unloading) || 0;
    const parsedTollCharge = parseFloat(charges?.toll) || 0;

    const basePrice = 5000;
    const weightPrice = parsedMaterialWeight * 10;
    const estimatedCost = basePrice + weightPrice + parsedLoadingCharge + parsedUnloadingCharge + parsedTollCharge;

    const order = await prisma.order.create({
      data: {
        companyId: company.id,
        pickupAddress: pickupLocation?.address || '',
        pickupLat: pickupLocation?.lat ? parseFloat(pickupLocation.lat) : null,
        pickupLng: pickupLocation?.lng ? parseFloat(pickupLocation.lng) : null,
        dropAddress: dropLocation?.address || '',
        dropLat: dropLocation?.lat ? parseFloat(dropLocation.lat) : null,
        dropLng: dropLocation?.lng ? parseFloat(dropLocation.lng) : null,
        materialType,
        materialWeight: parsedMaterialWeight,
        vehicleTypeRequired,
        numberOfVehicles: parsedNumberOfVehicles,
        pickupDate: new Date(pickupDate),
        deliveryDate: new Date(deliveryDate),
        loadingCharge: parsedLoadingCharge,
        unloadingCharge: parsedUnloadingCharge,
        tollCharge: parsedTollCharge,
        billingMethod,
        estimatedCost,
        extraNotes
      },
      include: {
        company: {
          select: { companyName: true, phone: true }
        }
      }
    });

    const io = req.app.get('socketio');
    if (io) {
      io.emit('new_order', order);
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active orders for a company
// @route   GET /api/orders/company
// @access  Private (Company only)
const getCompanyOrders = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const company = await prisma.company.findUnique({ where: { userId } });
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    const orders = await prisma.order.findMany({ 
      where: { companyId: company.id },
      orderBy: { createdAt: 'desc' }
    });
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
    const orders = await prisma.order.findMany({ 
      where: { status: 'Created' },
      include: {
        company: {
          select: { companyName: true, phone: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
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
    const orderId = req.params.id;
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Created') {
      return res.status(400).json({ message: 'Order is no longer available' });
    }

    const userId = req.user._id || req.user.id;
    const driver = await prisma.driver.findUnique({ where: { userId } });
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'Accepted',
        driverId: driver.id
      }
    });

    const io = req.app.get('socketio');
    if (io) {
      io.to(`company_${order.companyId}`).emit('order_accepted', { order: updatedOrder, driver });
    }

    res.json({ message: 'Order accepted successfully', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get driver requests (accepted orders) for a company
// @route   GET /api/orders/company/requests
// @access  Private (Company only)
const getDriverRequests = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const company = await prisma.company.findUnique({ where: { userId } });
    const requests = await prisma.order.findMany({ 
      where: { 
        companyId: company.id, 
        status: 'Accepted' 
      },
      include: { driver: true },
      orderBy: { updatedAt: 'desc' }
    });
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
    const orderId = req.params.id;
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'InProgress' }
    });
    
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
    const userId = req.user._id || req.user.id;
    const driver = await prisma.driver.findUnique({ where: { userId } });
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    const orders = await prisma.order.findMany({ 
      where: { driverId: driver.id },
      include: {
        company: {
          select: { companyName: true, phone: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
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
