const Ticket = require('../models/Ticket');

/**
 * Generate a ticket from a confirmed booking + travel option
 */
const generateTicket = async (booking, travelOption) => {
  const transportName =
    travelOption.trainName ||
    travelOption.busOperator ||
    travelOption.airline ||
    'நம்ம யாத்ரி';

  const transportNumber =
    travelOption.trainNumber ||
    travelOption.busNumber ||
    travelOption.flightNumber ||
    'N/A';

  const ticket = await Ticket.create({
    bookingId: booking._id,
    userId: booking.userId,

    journeyDetails: {
      travelType: booking.travelType,
      transportName,
      transportNumber,
      travelClass: booking.travelClass,
      source: booking.source,
      sourceName: booking.sourceName,
      destination: booking.destination,
      destinationName: booking.destinationName,
      travelDate: booking.travelDate,
      departureTime: booking.departureTime,
      arrivalTime: booking.arrivalTime,
      duration: booking.duration,
      platformOrGate: assignPlatformOrGate(booking.travelType),
    },

    passengerInfo: booking.passengers.map((p) => ({
      name: p.name,
      age: p.age,
      gender: p.gender,
      seatNumber: p.seatNumber,
      seatClass: booking.travelClass,
      idType: p.idType,
      idNumber: p.idNumber ? maskIdNumber(p.idNumber) : null,
    })),

    fareDetails: {
      baseFare: booking.baseFare,
      taxes: booking.taxes,
      totalAmount: booking.totalAmount,
      foodPreference: booking.foodPreference,
      luggageAllowance: booking.luggageAllowance,
    },

    isValid: true,
    validUntil: new Date(booking.travelDate.getTime() + 24 * 60 * 60 * 1000), // Valid 24h after travel date
  });

  return ticket;
};

const assignPlatformOrGate = (type) => {
  if (type === 'train') return `Platform ${Math.floor(Math.random() * 10) + 1}`;
  if (type === 'flight') return `Gate ${String.fromCharCode(65 + Math.floor(Math.random() * 8))}${Math.floor(Math.random() * 20) + 1}`;
  if (type === 'bus') return `Bay ${Math.floor(Math.random() * 20) + 1}`;
  return 'TBD';
};

const maskIdNumber = (id) => {
  if (id.length <= 4) return id;
  return 'X'.repeat(id.length - 4) + id.slice(-4);
};

module.exports = { generateTicket };
