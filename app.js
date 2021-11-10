const express = require('express');
// const bodyParser = require('body-parser')
const hpp = require('hpp');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 1000,
  message: 'Too many requests from this IP',
});
app.use(hpp());
app.use(xss());
app.use(mongoSanitize());
app.use('/api', limiter);

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
