require('dotenv').config({ path: '../backend/.env' });
const externalApiService = require('../backend/src/services/externalApiService');

async function testAll() {
  console.log('--- Testing Flight Search (MAA to IXM) ---');
  const flights = await externalApiService.searchFlights('MAS', 'MDU');
  console.log(`Found ${flights.length} flights`);
  if (flights.length > 0) console.log('First flight sample:', flights[0]);

  console.log('\n--- Testing Train Search (MAS to MDU) ---');
  const trains = await externalApiService.searchTrains('MAS', 'MDU');
  console.log(`Found ${trains.length} trains`);
  if (trains.length > 0) console.log('First train sample:', trains[0]);

  console.log('\n--- Testing PNR Status (Dummy PNR 1234567890) ---');
  const pnr = await externalApiService.checkPNRStatus('1234567890');
  console.log('PNR Result:', pnr ? 'Success' : 'Failed/Invalid');
}

testAll().catch(console.error);
