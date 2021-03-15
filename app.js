// Here we configurate things that has to do with Express application
const express = require('express');
const morgan = require('morgan');

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
  console.log('Hello from the middleware!');
  next();
});

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
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

module.exports = app;
