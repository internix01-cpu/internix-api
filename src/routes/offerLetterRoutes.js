const express = require('express');
const { getOfferLetter } = require('../controllers/offerLetterController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getOfferLetter);

module.exports = router;
