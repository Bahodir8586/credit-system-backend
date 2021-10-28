const express = require('express');
const bodyParser = require('body-parser');
const hpp = require('hpp');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');

const app = express();
app.use(helmet());
app.use(bodyParser.json());
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 1000,
  message: 'Too many requests from this IP',
});
app.use(hpp());
app.use('/api', limiter);
module.exports = app;
