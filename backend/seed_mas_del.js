require('dotenv').config();
const mongoose = require('mongoose');
const TravelOption = require('./src/models/TravelOption');

const seedExtraData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/namma-yatra');
    console.log('Connected to MongoDB...');

    const extraOptions = [
      {
        type: 'flight',
        flightNumber: 'AI-439',
        airline: 'Air India',
        source: 'MAS',
        sourceName: 'Chennai International Airport',
        destination: 'DEL',
        destinationName: 'Indira Gandhi International Airport',
        departureTime: '06:15',
        arrivalTime: '09:05',
        duration: '2h 50m',
        pricing: [
          { class: 'Economy', price: 5800, totalSeats: 120, availableSeats: 45 },
          { class: 'Business', price: 12500, totalSeats: 12, availableSeats: 4 }
        ],
        isActive: true
      },
      {
        type: 'flight',
        flightNumber: '6E-2134',
        airline: 'IndiGo',
        source: 'MAS',
        sourceName: 'Chennai International Airport',
        destination: 'DEL',
        destinationName: 'Indira Gandhi International Airport',
        departureTime: '18:45',
        arrivalTime: '21:35',
        duration: '2h 50m',
        pricing: [
          { class: 'Economy', price: 4200, totalSeats: 180, availableSeats: 22 }
        ],
        isActive: true
      },
      {
        type: 'train',
        trainNumber: '12615',
        trainName: 'GRAND TRUNK EXP',
        source: 'MAS',
        sourceName: 'MGR Chennai Ctrl',
        destination: 'DEL',
        destinationName: 'New Delhi',
        departureTime: '18:50',
        arrivalTime: '06:30',
        duration: '35h 40m',
        pricing: [
          { class: 'SL', price: 820, totalSeats: 300, availableSeats: 50 },
          { class: '3A', price: 2150, totalSeats: 120, availableSeats: 15 },
          { class: '2A', price: 3100, totalSeats: 40, availableSeats: 5 }
        ],
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        isActive: true
      }
    ];

    for (const opt of extraOptions) {
      // Use findOneAndUpdate to avoid duplicates
      await TravelOption.findOneAndUpdate(
        { type: opt.type, flightNumber: opt.flightNumber, trainNumber: opt.trainNumber, source: opt.source, destination: opt.destination },
        opt,
        { upsert: true, new: true }
      );
    }

    console.log('Seeded MAS-DEL travel options successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedExtraData();
