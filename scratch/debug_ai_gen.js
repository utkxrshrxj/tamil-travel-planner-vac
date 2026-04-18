const { generateTravelDataAI } = require('../backend/src/services/aiService');
require('dotenv').config({ path: './backend/.env' });

async function debug() {
  console.log('Testing Flight Generation...');
  const flights = await generateTravelDataAI('flight', 'MAS', 'DLI', '2026-04-21');
  console.log('Flights Response (Length):', flights.length);
  if (flights.length > 0) {
    console.log('Sample Flight:', JSON.stringify(flights[0], null, 2));
  } else {
    console.log('No flights returned.');
  }

  console.log('\nTesting Train Generation...');
  const trains = await generateTravelDataAI('train', 'MAS', 'DLI', '2026-04-21');
  console.log('Trains Response (Length):', trains.length);
  if (trains.length > 0) {
    console.log('Sample Train:', JSON.stringify(trains[0], null, 2));
  }

  console.log('\nTesting Bus Generation...');
  const buses = await generateTravelDataAI('bus', 'MAS', 'CBE', '2026-04-21');
  console.log('Buses Response (Length):', buses.length);
}

debug();
