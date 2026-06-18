const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

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
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'Company',
        company: {
          create: {
            companyName,
            ownerName,
            gstNumber,
            phone,
            address,
          }
        }
      },
      include: {
        company: true
      }
    });

    res.status(201).json({
      _id: user.id,
      email: user.email,
      role: user.role,
      companyDetails: user.company,
      token: generateToken(user.id, user.role),
    });
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
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'Driver',
        driver: {
          create: {
            fullName,
            phone,
            aadhaarNumber,
            drivingLicenseNumber,
            bankAccountNo: bankDetails?.accountNo,
            bankIfsc: bankDetails?.ifsc,
            upiId,
          }
        }
      },
      include: {
        driver: true
      }
    });

    res.status(201).json({
      _id: user.id,
      email: user.email,
      role: user.role,
      driverDetails: user.driver,
      token: generateToken(user.id, user.role),
    });
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
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { company: true, driver: true }
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const details = user.role === 'Company' ? user.company : user.driver;

      res.json({
        _id: user.id,
        email: user.email,
        role: user.role,
        details,
        token: generateToken(user.id, user.role),
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
    // req.user could have _id or id depending on the auth middleware
    const userId = req.user._id || req.user.id;
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      include: { company: true, driver: true }
    });
    
    if (user) {
      const details = user.role === 'Company' ? user.company : user.driver;
      delete user.password;
      delete user.company;
      delete user.driver;

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
