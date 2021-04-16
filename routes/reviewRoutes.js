const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// POST /tours/234fdsasd/reviews, mergeParams gives us access to tourId: 234fdsasd
// GET /tours/234fdsasd/reviews
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
