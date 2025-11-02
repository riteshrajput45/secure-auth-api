const express = require('express');
const { signup, login } = require('../controller/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const globalCalls = require('../utils/globalCalls');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);


router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected route example
router.get('/profile', verifyToken, (req, res) => {
  return globalCalls.successData(res, "Protected route accessed", { userId: req.user.id });
});

module.exports = router;
