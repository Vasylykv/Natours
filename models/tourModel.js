const mongoose = require('mongoose');
const slufify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], // mongoose Validator
      unique: true,
      trim: true, // Remove white space
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      validate: {
        validator: function (val) {
          return validator.isAlpha(val.replace(/ /g, ''));
        },
        message: 'A tour name must only contain letters',
      },
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
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Raiting must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // this onlypoints to current doc on NEW document creation
          return value < this.price; // 100 < 200 true || 200 < 100 false
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
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
    startLocation: {
      // GeoJSON = at least two fields name type, coordinates
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number], // lon, lat
      address: String,
      description: String,
    },
    locations: [
      // Embedded document
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// tourSchema.index({ price: 1 });

// compound index is also going to work when we query either price or ratingsAverage
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

// tourSchema.virtual('halfGroupSize').get(function () {
//   return this.maxGroupSize / 2;
// });

// tourSchema.virtual('durationWeeks').get(function () {
//   return (this.duration / 7).toFixed(1);
// });

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create() NOT runs when .insertMany()
tourSchema.pre('save', function (next) {
  // this = currently proccessed document
  // pre save hook// hook it "save" || pre save middleware
  this.slug = slufify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);

//   next();
// });

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

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

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
