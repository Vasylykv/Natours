const express = require('express');
const tourController = require('../controllers/tourController');
const router = express.Router();

// router.param('id', tourController.checkID);

// Create a checkBody middleware
// Check if body contains the name and price property
// If not, send back 400 (bad request)
// Add it to the post handler stack

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

// prettier-ignore
router
  .route('/tour-stats')
  .get(tourController.getTourStats);

// prettier-ignore
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
// prettier-ignore
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updatedTour)
  .delete(tourController.deleteTour);

module.exports = router;
