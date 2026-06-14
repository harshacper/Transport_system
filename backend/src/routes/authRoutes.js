const express = require('express');
const router = express.Router();
const {
  registerCompany,
  registerDriver,
  loginUser,
  getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register/company', registerCompany);
router.post('/register/driver', registerDriver);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
