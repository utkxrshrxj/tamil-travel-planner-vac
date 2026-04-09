const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Journey snapshot (denormalized for quick ticket rendering)
    journeyDetails: {
      travelType: { type: String, enum: ['train', 'bus', 'flight'] },
      transportName: { type: String },      // Train name / Bus operator / Airline
      transportNumber: { type: String },    // Train no / Bus no / Flight no
      travelClass: { type: String },
      source: { type: String },
      sourceName: { type: String },
      destination: { type: String },
      destinationName: { type: String },
      travelDate: { type: Date },
      departureTime: { type: String },
      arrivalTime: { type: String },
      duration: { type: String },
      platformOrGate: { type: String },
    },

    passengerInfo: [
      {
        name: { type: String },
        age: { type: Number },
        gender: { type: String },
        seatNumber: { type: String },
        seatClass: { type: String },
        idType: { type: String },
        idNumber: { type: String },
      },
    ],

    fareDetails: {
      baseFare: { type: Number },
      taxes: { type: Number },
      totalAmount: { type: Number },
      foodPreference: { type: String },
      luggageAllowance: { type: Number },
    },

    pnrNumber: { type: String, unique: true },
    qrCode: { type: String }, // base64 QR or URL
    isValid: { type: Boolean, default: true },
    validUntil: { type: Date },
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ticketSchema.pre('save', function (next) {
  if (!this.ticketId) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    this.ticketId = `NYT-TKT-${timestamp}-${random}`;
  }
  if (!this.pnrNumber) {
    const pnr = Math.floor(Math.random() * 9000000000 + 1000000000).toString();
    this.pnrNumber = pnr;
  }
  next();
});

ticketSchema.index({ bookingId: 1 });
ticketSchema.index({ 'passengers.name': 1 });
ticketSchema.index({ userId: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);
