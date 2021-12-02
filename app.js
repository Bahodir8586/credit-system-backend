const express = require('express');
// const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const cors = require('cors');
const hpp = require('hpp');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const branchRouter = require('./routes/branchRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 1000,
  message: 'Too many requests from this IP',
});
app.use(hpp());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser());

app.use(cors({ origin: 'http://localhost', credentials: true }));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', 'http://localhost');
  res.header(
    'Access-Control-Allow-Methods',
    'GET,PUT, PATCH,POST,DELETE,UPDATE,OPTIONS'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
  );
  next();
});
app.use('/api', limiter);

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/branches', branchRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
