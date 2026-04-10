const axios = require('axios');

/**
 * Service to handle external API calls for real-time travel data
 * 1. AviationStack for Flights
 * 2. RailRadar for Trains and Stations
 * 3. RapidAPI for PNR Status
 */

const AVIATIONSTACK_URL = 'http://api.aviationstack.com/v1';
const RAILRADAR_URL = 'https://api.railradar.org/api/v1';
const RAPIDAPI_PNR_URL = 'https://irctc-indian-railway-pnr-status.p.rapidapi.com';

// City IATA codes for Flights (MAS -> MAA etc)
const IATA_MAPPING = {
  'MAS': 'MAA', // Chennai Central -> Chennai Airport
  'MDU': 'IXM', // Madurai
  'CBE': 'CJB', // Coimbatore
  'TPJ': 'TRZ', // Trichy
  'TUT': 'TCR', // Tuticorin
  'SBC': 'BLR', // Bangalore
  'BOM': 'BOM', // Mumbai
  'DEL': 'DEL', // Delhi
};

/**
 * Search flights using AviationStack
 */
const searchFlights = async (source, destination, date) => {
  try {
    const sourceIATA = IATA_MAPPING[source] || source;
    const destIATA = IATA_MAPPING[destination] || destination;
    
    const params = {
      access_key: process.env.AVIATIONSTACK_API_KEY,
      dep_iata: sourceIATA,
      arr_iata: destIATA,
      limit: 20
    };

    // NOTE: flight_date is removed as it triggers 403 on the Free plan.
    // We will return the current live flights.

    console.log(`[AviationStack] Requesting live flights: ${sourceIATA} -> ${destIATA}`);

    const response = await axios.get(`${AVIATIONSTACK_URL}/flights`, { params });
    const flights = response.data.data || [];

    return flights.map(f => ({
      _id: `ext-flight-${f.flight.iata}-${f.flight_date}`,
      type: 'flight',
      flightNumber: f.flight.iata,
      airline: f.airline.name,
      source: source,
      sourceName: f.departure.airport,
      destination: destination,
      destinationName: f.arrival.airport,
      departureTime: f.departure.scheduled ? f.departure.scheduled.split('T')[1].substring(0, 5) : '00:00',
      arrivalTime: f.arrival.scheduled ? f.arrival.scheduled.split('T')[1].substring(0, 5) : '00:00',
      duration: 'Variable', // Can calculate if needed
      pricing: [
        { class: 'Economy', price: 4500, totalSeats: 60, availableSeats: 15 },
        { class: 'Business', price: 8500, totalSeats: 12, availableSeats: 4 }
      ],
      isActive: true,
      isRealTime: true
    }));
  } catch (error) {
    console.error('AviationStack Error:', error.message);
    return [];
  }
};

/**
 * Search trains between stations using RailRadar
 */
const searchTrains = async (source, destination) => {
  try {
    const params = {
      from: source,
      to: destination
    };

    const response = await axios.get(`${RAILRADAR_URL}/trains/between`, {
      params,
      headers: { 'x-api-key': process.env.RAILRADAR_API_KEY }
    });

    // console.log('RailRadar Response:', JSON.stringify(response.data, null, 2));

    if (!response.data || !response.data.success || !response.data.data) return [];

    const trains = response.data.data.trains || [];

    return trains.map(t => {
      const departure = t.journeySegment?.departureTime || '00:00';
      const arrival = t.journeySegment?.arrivalTime || '00:00';
      const duration = t.journeySegment?.travelTime || '00:00';

      return {
        _id: `ext-train-${t.trainNumber}`,
        type: 'train',
        trainNumber: t.trainNumber,
        trainName: t.trainName,
        source: source,
        sourceName: t.sourceStationName || source,
        destination: destination,
        destinationName: t.destinationStationName || destination,
        departureTime: departure,
        arrivalTime: arrival,
        duration: duration,
        pricing: [
          { class: 'SL', price: 450, totalSeats: 72, availableSeats: 10 },
          { class: '3A', price: 1200, totalSeats: 64, availableSeats: 5 },
          { class: '2A', price: 1800, totalSeats: 48, availableSeats: 2 }
        ],
        days: t.runDays || [],
        isActive: true,
        isRealTime: true
      };
    });
  } catch (error) {
    console.error('RailRadar Error:', error.message);
    return [];
  }
};

/**
 * Check PNR Status using RapidAPI
 */
const checkPNRStatus = async (pnr) => {
  try {
    const response = await axios.get(`${RAPIDAPI_PNR_URL}/getPNRStatus/${pnr}`, {
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST
      }
    });

    // Structure depends on API response, mapping to our Ticket model
    const data = response.data;
    if (!data || data.status === 'error') return null;

    return {
      pnrNumber: pnr,
      isValid: true,
      journeyDetails: {
        transportName: data.trainName || 'Unknown Train',
        transportNumber: data.trainNumber || '',
        source: data.sourceStation || '',
        destination: data.destinationStation || '',
        travelDate: data.dateOfJourney || '',
        departureTime: data.departureTime || '',
      },
      passengerInfo: (data.passengers || []).map(p => ({
        name: `Passenger ${p.number}`,
        seatClass: p.bookingStatus,
        seatNumber: p.currentStatus
      })),
      isRealTime: true
    };
  } catch (error) {
    console.error('RapidAPI PNR Error:', error.message);
    return null;
  }
};

module.exports = {
  searchFlights,
  searchTrains,
  checkPNRStatus
};
