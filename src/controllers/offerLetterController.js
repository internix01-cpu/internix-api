const getOfferLetter = async (req, res) => {
  if (req.candidate.paymentStatus === 'pending' || req.candidate.paymentStatus === 'failed') {
    return res.status(403).json({
      success: false,
      locked: true,
      message: 'Please pay placement fees to access offer letter'
    });
  }

  if (req.candidate.paymentStatus === 'verifying') {
    return res.status(403).json({
      success: false,
      locked: true,
      message: 'Payment details are verifying'
    });
  }

  res.json({
    success: true,
    locked: false,
    offerLetterUrl: req.candidate.offerLetterUrl
  });
};

module.exports = {
  getOfferLetter
};
