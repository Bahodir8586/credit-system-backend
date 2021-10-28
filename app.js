const express = require('express');
const bodyParser = require('body-parser');
const hpp = require('hpp');
const rateLimiter = require('express-rate-limit');

const app = express();
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 1000,
  message: 'Too many requests from this IP',
});
app.use(hpp());
app.use('/api', limiter);
module.exports = app;
