const rateLimit = require('express-rate-limit');

const tutorLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 50, // 50 messages per user per day
  keyGenerator: (req) => req.userId, // per logged-in user, not per IP
  message: { message: 'Daily question limit reached. Try again tomorrow.' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { tutorLimiter };