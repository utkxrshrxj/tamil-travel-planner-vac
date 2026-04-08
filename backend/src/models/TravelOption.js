const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  stationName: { type: String, required: true },
  stationCode: { type: String },
  arrivalTime: { type: String },
  departureTime: { type: String },
  day: { type: Number, default: 1 },
});

const travelOptionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['train', 'bus', 'flight'],
    },
    // Train fields
    trainNumber: { type: String },
    trainName: { type: String },
    // Bus fields
    busNumber: { type: String },
    busOperator: { type: String },
    busType: {
      type: String,
      enum: ['ordinary', 'express', 'super_express', 'ac', 'sleeper'],
    },
    // Flight fields
    flightNumber: { type: String },
    airline: { type: String },

    source: {
      type: String,
      required: true,
      uppercase: true,
    },
    sourceName: { type: String, required: true },
    destination: {
      type: String,
      required: true,
      uppercase: true,
    },
    destinationName: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    duration: { type: String, required: true },
    durationMinutes: { type: Number },

    // Pricing per class/category
    pricing: [
      {
        class: { type: String }, // SL, 3A, 2A, 1A for train | Economy, Business for flight | General, AC for bus
        price: { type: Number, required: true },
        totalSeats: { type: Number, required: true },
        availableSeats: { type: Number, required: true },
      },
    ],

    stops: [stopSchema],
    days: [
      {
        type: String,
        enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    ],
    foodService: {
      available: { type: Boolean, default: false },
      vegOption: { type: Boolean, default: false },
      nonVegOption: { type: Boolean, default: false },
    },
    luggageAllowance: {
      type: Number, // kg
      default: 15,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for fast travel searches
travelOptionSchema.index({ source: 1, destination: 1, type: 1 });

module.exports = mongoose.model('TravelOption', travelOptionSchema);
