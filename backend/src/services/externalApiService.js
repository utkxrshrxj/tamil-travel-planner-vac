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

// Mapping for cities where Airport IATA and Train Station codes differ
const STATION_MAPPING = {
  'DEL': 'NDLS', // Delhi/Airport -> New Delhi Station
  'MAA': 'MAS',  // Chennai Airport -> Chennai Central
  'BLR': 'SBC',  // Bangalore Airport -> Bangalore City
  'BOM': 'CSMT', // Mumbai Airport -> Mumbai CSMT
  'HYD': 'HYB',  // Hyderabad Airport -> Hyderabad Deccan
  'CCU': 'HWH',  // Kolkata Airport -> Howrah
};

/**
 * Converts minutes from midnight to HH:mm format
 */
const minutesToTime = (minutes) => {
  if (minutes === undefined || minutes === null) return '00:00';
  const hrs = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// City IATA codes for Flights (MAS -> MAA etc)
const IATA_MAPPING = {
  'MAS': 'MAA', // Chennai Central -> Chennai Airport
  'MSB': 'MAA', // Chennai Beach -> Chennai Airport
  'MDU': 'IXM', // Madurai
  'CBE': 'CJB', // Coimbatore
  'TPJ': 'TRZ', // Trichy
  'TUT': 'TCR', // Tuticorin
  'SBC': 'BLR', // Bangalore
  'BOM': 'BOM', // Mumbai
  'DEL': 'DEL', // Delhi
  'DLI': 'DEL', // Old Delhi -> Delhi Airport
  'HYB': 'HYD', // Hyderabad
  'HWH': 'CCU', // Kolkata
};

const { generateTravelDataAI } = require('./aiService');

/**
 * Search flights using AI (Simulation)
 */
const searchFlights = async (source, destination, date) => {
  try {
    /* 
    // Legacy AviationStack logic preserved
    const sourceIATA = IATA_MAPPING[source] || source;
    // ... axial call ...
    */
    
    console.log(`[AI Search] Generating flights: ${source} -> ${destination} on ${date}`);
    return await generateTravelDataAI('flight', source, destination, date || new Date().toISOString().split('T')[0]);
  } catch (error) {
    console.error('AI Flight Search Error:', error.message);
    return [];
  }
};

/**
 * Search trains using a multi-stage fallback strategy
 * Order: Gemini AI -> RailRadar API -> Demo Data Fallback
 */
const searchTrains = async (source, destination, date) => {
  const travelDate = date || new Date().toISOString().split('T')[0];
  
  try {
    // Stage 1: Try Gemini AI first (as requested)
    console.log(`[Stage 1] Trying Gemini AI for trains: ${source} -> ${destination}`);
    const aiResults = await generateTravelDataAI('train', source, destination, travelDate);
    
    // Check if results are "real" (not demo data automatically returned by aiService)
    if (aiResults && aiResults.length > 0 && !aiResults[0].isDemoData) {
      console.log(`[Stage 1] SUCCESS: Gemini returned ${aiResults.length} real train options.`);
      return aiResults;
    }

    // Stage 2: Gemini failed or returned demo data - Try RailRadar
    console.log(`[Stage 2] Gemini failed/no real results. Trying RailRadar API...`);
    
    if (process.env.RAILRADAR_API_KEY) {
      const response = await axios.get(`${RAILRADAR_URL}/trains/between-stations`, {
        params: { from: source, to: destination, date: travelDate },
        headers: { 'x-api-key': process.env.RAILRADAR_API_KEY },
        timeout: 10000
      });

      if (response.data && response.data.trains && response.data.trains.length > 0) {
        console.log(`[Stage 2] SUCCESS: RailRadar returned ${response.data.trains.length} trains.`);
        // Map RailRadar data to our app's internal schema
        return response.data.trains.map(t => ({
          _id: `ext-train-${t.train_number}`,
          type: 'train',
          trainName: t.train_name,
          trainNumber: t.train_number,
          source: source,
          destination: destination,
          sourceName: t.from_station_name || source,
          destinationName: t.to_station_name || destination,
          departureTime: t.departure_time || '00:00',
          arrivalTime: t.arrival_time || '00:00',
          duration: t.duration || '0h 0m',
          pricing: [
            { class: 'SL', price: 450, totalSeats: 72, availableSeats: 15 },
            { class: '3A', price: 1200, totalSeats: 64, availableSeats: 8 }
          ],
          isActive: true,
          isRealTime: true
        }));
      }
    } else {
      console.log(`[Stage 2] SKIP: RAILRADAR_API_KEY missing.`);
    }

    // Stage 3: RailRadar failed or no results - Final Fallback (already prepared by aiService)
    console.log(`[Stage 3] Final Fallback: Returning high-quality demo data.`);
    return aiResults || []; // This will be the demo data if Stage 1 returned it
    
  } catch (error) {
    console.error('Train Search Strategy Error:', error.message);
    // Ultimate fallback if everything crashes
    return await generateTravelDataAI('train', source, destination, travelDate);
  }
};

/**
 * Search buses using AI (Simulation)
 */
const searchBuses = async (source, destination, date) => {
  try {
    console.log(`[AI Search] Generating buses: ${source} -> ${destination} on ${date}`);
    return await generateTravelDataAI('bus', source, destination, date || new Date().toISOString().split('T')[0]);
  } catch (error) {
    console.error('AI Bus Search Error:', error.message);
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
  searchBuses,
  checkPNRStatus
};
