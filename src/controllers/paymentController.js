const Candidate = require('../models/Candidate');

const getPlacementFeeDetails = async (req, res) => {
  const amount = Number(process.env.PLACEMENT_FEE_AMOUNT || 0);
  const currency = process.env.PAYMENT_CURRENCY || 'INR';

  res.json({
    success: true,
    payment: {
      candidateId: req.candidate._id,
      fullName: req.candidate.fullName,
      email: req.candidate.email,
      phone: req.candidate.phone,
      companyHiredIn: req.candidate.companyHiredIn,
      paymentPurpose: 'Placement Fees',
      amount,
      currency,
      paymentStatus: req.candidate.paymentStatus
    }
  });
};

const markPaymentVerifying = async (req, res, next) => {
  try {
    if (req.candidate.paymentStatus === 'verified') {
      return res.status(409).json({
        success: false,
        message: 'Payment is already verified',
        paymentStatus: req.candidate.paymentStatus
      });
    }

    req.candidate.paymentStatus = 'verifying';
    await req.candidate.save();

    res.json({
      success: true,
      message: 'Payment details are verifying',
      paymentStatus: req.candidate.paymentStatus
    });
  } catch (error) {
    next(error);
  }
};

const markPaymentVerified = async (req, res, next) => {
  try {
    const { candidateId } = req.body;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: 'candidateId is required'
      });
    }

    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    candidate.paymentStatus = 'verified';
    await candidate.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      paymentStatus: candidate.paymentStatus
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlacementFeeDetails,
  markPaymentVerifying,
  markPaymentVerified
};
