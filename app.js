// Here we configurate things that has to do with Express application
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`public`, { extensions: ['htm', 'html'] }));

app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});

// 'api/v1/tours/:id/:x/:y?' === :id(param) :y?(optional param) -- we can get in from req.params

// This is a middleware too, so if we define our own middleware after this one. It will not use this middleware

// 3) ROUTES

// Mount the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
