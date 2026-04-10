require('dotenv').config();
const externalApiService = require('./src/services/externalApiService');

async function testAll() {
  console.log('--- Testing Flight Search (MAS to MDU) ---');
  try {
    const flights = await externalApiService.searchFlights('MAS', 'MDU');
    console.log(`Found ${flights.length} flights`);
    if (flights.length > 0) {
      console.log('Sample Flight:', JSON.stringify(flights[0], null, 2));
    }
  } catch (e) {
    console.error('Flight Test Failed:', e.message);
  }

  console.log('\n--- Testing Train Search (MAS to MDU) ---');
  try {
    const trains = await externalApiService.searchTrains('MAS', 'MDU');
    console.log(`Found ${trains.length} trains`);
    if (trains.length > 0) {
      console.log('Sample Train:', JSON.stringify(trains[0], null, 2));
    }
  } catch (e) {
    console.error('Train Test Failed:', e.message);
  }
  
  console.log('\n--- Testing PNR Status (Dummy 1234567890) ---');
  try {
    const pnr = await externalApiService.checkPNRStatus('1234567890');
    console.log('PNR Result:', pnr ? 'Received Data' : 'No Data/Failed');
    if (pnr) console.log(JSON.stringify(pnr, null, 2));
  } catch (e) {
    console.error('PNR Test Failed:', e.message);
  }
}

testAll().catch(console.error);
