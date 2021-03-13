const mongoose = require('mongoose');
const slufify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], // mongoose Validator
      unique: true,
      trim: true, // Remove white space
    },
    slug: String,
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
    startDates: [Date], // '2021-03-21' again Mongodb will try to parse it
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

tourSchema.virtual('halfGroupSize').get(function () {
  return this.maxGroupSize / 2;
});

tourSchema.virtual('durationWeeks').get(function () {
  return (this.duration / 7).toFixed(1);
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create() NOT runs when .insertMany()
tourSchema.pre('save', function (next) {
  // this = currently proccessed document
  // pre save hook// hook it "save" || pre save middleware
  this.slug = slufify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// // Post Document Middleware functions are executed after all .pre() middleware
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.startTime = Date.now();
  next();
});

// Runs after the query has already executed, docs = all documents in the query
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.startTime} milliseconds`);

  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
