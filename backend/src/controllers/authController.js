const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const Driver = require('../models/Driver');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new company
// @route   POST /api/auth/register/company
// @access  Public
const registerCompany = async (req, res) => {
  const { email, password, companyName, ownerName, gstNumber, phone, address } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      password,
      role: 'Company',
    });

    if (user) {
      const company = await Company.create({
        userId: user._id,
        companyName,
        ownerName,
        gstNumber,
        phone,
        address,
      });

      res.status(201).json({
        _id: user._id,
        email: user.email,
        role: user.role,
        companyDetails: company,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new driver
// @route   POST /api/auth/register/driver
// @access  Public
const registerDriver = async (req, res) => {
  const { email, password, fullName, phone, aadhaarNumber, drivingLicenseNumber, bankDetails, upiId } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      password,
      role: 'Driver',
    });

    if (user) {
      const driver = await Driver.create({
        userId: user._id,
        fullName,
        phone,
        aadhaarNumber,
        drivingLicenseNumber,
        bankDetails,
        upiId,
      });

      res.status(201).json({
        _id: user._id,
        email: user.email,
        role: user.role,
        driverDetails: driver,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      
      let details = null;
      if (user.role === 'Company') {
        details = await Company.findOne({ userId: user._id });
      } else if (user.role === 'Driver') {
        details = await Driver.findOne({ userId: user._id });
      }

      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        details,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let details = null;
    
    if (user.role === 'Company') {
      details = await Company.findOne({ userId: user._id });
    } else if (user.role === 'Driver') {
      details = await Driver.findOne({ userId: user._id });
    }
    
    if (user) {
      res.json({
        user,
        details
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerCompany,
  registerDriver,
  loginUser,
  getUserProfile,
};
