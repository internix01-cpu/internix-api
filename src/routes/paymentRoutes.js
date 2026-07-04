const express = require('express');
const {
  getPlacementFeeDetails,
  markPaymentVerifying,
  markPaymentVerified
} = require('../controllers/paymentController');
const { protect, adminPlaceholder } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/placement-fee', protect, getPlacementFeeDetails);
router.post('/mark-verifying', protect, markPaymentVerifying);
router.post('/mark-verified', adminPlaceholder, markPaymentVerified);

module.exports = router;
