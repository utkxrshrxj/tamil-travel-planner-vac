const { resolveCity, TRANSPORT_CODE_MAP } = require('./backend/src/controllers/travelController');

const testCities = ['சென்னை', 'ஹைதராபாத்', 'கொல்கத்தா', 'டெல்லி', 'மும்பை'];

console.log('--- Testing resolveCity ---');
testCities.forEach(city => {
  const code = resolveCity(city);
  console.log(`${city} -> ${code}`);
});

console.log('\n--- Testing TRANSPORT_CODE_MAP ---');
testCities.forEach(city => {
  const baseCode = resolveCity(city);
  const trainCode = (TRANSPORT_CODE_MAP[baseCode] && TRANSPORT_CODE_MAP[baseCode].train) || baseCode;
  const flightCode = (TRANSPORT_CODE_MAP[baseCode] && TRANSPORT_CODE_MAP[baseCode].flight) || baseCode;
  console.log(`${city} (${baseCode}): Train=${trainCode}, Flight=${flightCode}`);
});
