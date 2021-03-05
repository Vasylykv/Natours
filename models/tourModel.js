const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], // mongoose Validator
    unique: true,
    trim: true, // Remove white space
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cove image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(), // Mongodb will automatically convert it to a meaningful date
    select: false, // It will never send this "createdAt" to the client
  },
  startingDates: [Date], // '2021-03-21' again Mongodb will try to parse it
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
