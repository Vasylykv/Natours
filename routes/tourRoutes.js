const express = require('express');
const tourController = require('../controllers/tourController');
const router = express.Router();
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');
// router.param('id', tourController.checkID);

// Create a checkBody middleware
// Check if body contains the name and price property
// If not, send back 400 (bad request)
// Add it to the post handler stack

// POST /tours/234fdsasd/reviews
// GET /tours/234fdsasd/reviews
// GET /tours/234fdsasd/reviews/ad8asd92

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

// ROUTE REDIRECTION
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

// prettier-ignore
router
  .route('/tour-stats')
  .get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// prettier-ignore
router
  .route('/')
  .get(authController.protect ,tourController.getAllTours)
  .post(tourController.createTour);
// prettier-ignore
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;
