const Candidate = require('../models/Candidate');
const generateToken = require('../utils/generateToken');

const candidateFields = [
  'fullName',
  'email',
  'phone',
  'gender',
  'coordinator',
  'companyHiredIn',
  'password',
  'confirmPassword'
];

const formatCandidate = (candidate) => ({
  _id: candidate._id,
  fullName: candidate.fullName,
  email: candidate.email,
  phone: candidate.phone,
  gender: candidate.gender,
  coordinator: candidate.coordinator,
  companyHiredIn: candidate.companyHiredIn,
  paymentStatus: candidate.paymentStatus,
  offerLetterUrl: candidate.offerLetterUrl
});

const validateRegistrationBody = (body) => {
  const missingFields = candidateFields.filter((field) => !String(body[field] || '').trim());

  if (missingFields.length > 0) {
    return `${missingFields.join(', ')} ${missingFields.length === 1 ? 'is' : 'are'} required`;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) {
    return 'Please provide a valid email address';
  }

  if (body.password.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  if (body.password !== body.confirmPassword) {
    return 'Password and confirm password do not match';
  }

  return null;
};

const validateLoginBody = (body) => {
  if (!String(body.email || '').trim()) {
    return 'Email is required';
  }

  if (!String(body.password || '').trim()) {
    return 'Password is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) {
    return 'Please provide a valid email address';
  }

  return null;
};

const registerCandidate = async (req, res, next) => {
  try {
    const validationMessage = validateRegistrationBody(req.body);

    if (validationMessage) {
      return res.status(400).json({
        success: false,
        message: validationMessage
      });
    }

    const email = req.body.email.toLowerCase().trim();
    const existingCandidate = await Candidate.findOne({ email });

    if (existingCandidate) {
      return res.status(409).json({
        success: false,
        message: 'A candidate with this email already exists'
      });
    }

    const candidate = await Candidate.create({
      fullName: req.body.fullName.trim(),
      email,
      phone: req.body.phone.trim(),
      password: req.body.password,
      gender: req.body.gender,
      coordinator: req.body.coordinator.trim(),
      companyHiredIn: req.body.companyHiredIn.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Candidate registered successfully',
      token: generateToken(candidate._id),
      candidate: formatCandidate(candidate)
    });
  } catch (error) {
    next(error);
  }
};

const loginCandidate = async (req, res, next) => {
  try {
    const validationMessage = validateLoginBody(req.body);

    if (validationMessage) {
      return res.status(400).json({
        success: false,
        message: validationMessage
      });
    }

    const email = req.body.email.toLowerCase().trim();
    const candidate = await Candidate.findOne({ email }).select('+password');
    const passwordMatches = candidate
      ? await candidate.matchPassword(req.body.password)
      : false;

    if (!candidate || !passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.json({
      success: true,
      message: 'Candidate logged in successfully',
      token: generateToken(candidate._id),
      candidate: formatCandidate(candidate)
    });
  } catch (error) {
    next(error);
  }
};

const getCandidateProfile = async (req, res) => {
  res.json({
    success: true,
    candidate: formatCandidate(req.candidate)
  });
};

module.exports = {
  registerCandidate,
  loginCandidate,
  getCandidateProfile,
  formatCandidate
};
