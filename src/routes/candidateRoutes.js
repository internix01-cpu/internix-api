const express = require('express');
const {
  registerCandidate,
  loginCandidate,
  getCandidateProfile
} = require('../controllers/candidateController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerCandidate);
router.post('/login', loginCandidate);
router.get('/me', protect, getCandidateProfile);

module.exports = router;
