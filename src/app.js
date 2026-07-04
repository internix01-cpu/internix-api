const express = require('express');
const cors = require('cors');

const candidateRoutes = require('./routes/candidateRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const offerLetterRoutes = require('./routes/offerLetterRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Internix API is running'
  });
});

app.use('/api/candidates', candidateRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/offer-letter', offerLetterRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
