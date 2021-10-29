const express = require('express');
const bodyParser = require('body-parser');
const hpp = require('hpp');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const app = express();
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 1000,
  message: 'Too many requests from this IP',
});
app.use(hpp());
app.use(xss());
app.use(mongoSanitize());
app.use('/api', limiter);

module.exports = app;
