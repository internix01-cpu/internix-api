const jwt = require('jsonwebtoken');

const generateToken = (candidateId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }

  return jwt.sign({ candidateId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

module.exports = generateToken;
