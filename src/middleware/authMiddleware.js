const jwt = require('jsonwebtoken');
const Candidate = require('../models/Candidate');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token is required'
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const candidate = await Candidate.findById(decoded.candidateId);

    if (!candidate) {
      return res.status(401).json({
        success: false,
        message: 'Candidate linked to this token was not found'
      });
    }

    req.candidate = candidate;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    next(error);
  }
};

const adminPlaceholder = (req, res, next) => {
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret) {
    return res.status(503).json({
      success: false,
      message: 'Admin verification is not configured yet'
    });
  }

  if (req.headers['x-admin-secret'] !== adminSecret) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

module.exports = {
  protect,
  adminPlaceholder
};
