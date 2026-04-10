require('dotenv').config();
const mongoose = require('mongoose');
const TravelOption = require('./src/models/TravelOption');

const debugSearch = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/namma-yatra');
    console.log('Connected to MongoDB.');

    // Mock resolveCity logic
    const CITY_ALIASES = { 'சென்னை': 'MAS', 'டெல்லி': 'DEL' };
    const source = 'சென்னை';
    const destination = 'டெல்லி';
    const sourceCode = CITY_ALIASES[source] || source;
    const destCode = CITY_ALIASES[destination] || destination;

    console.log(`Searching for: ${sourceCode} -> ${destCode}`);

    const query = {
      source: sourceCode,
      destination: destCode,
      isActive: true,
      type: 'flight'
    };

    // Date logic
    const date = '2026-04-10';
    const travelDate = new Date(date);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[travelDate.getDay()];
    query.$or = [{ days: { $exists: false } }, { days: { $size: 0 } }, { days: dayName }];

    console.log('Final Query:', JSON.stringify(query, null, 2));

    const options = await TravelOption.find(query);
    console.log(`Found ${options.length} options in database.`);
    
    if (options.length === 0) {
        const all = await TravelOption.find({ source: sourceCode, destination: destCode });
        console.log(`Total options for route (no filters): ${all.length}`);
        if (all.length > 0) {
            console.log('Sample option from DB:', JSON.stringify(all[0], null, 2));
        }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

debugSearch();
