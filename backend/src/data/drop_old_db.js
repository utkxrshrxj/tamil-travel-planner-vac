const mongoose = require('mongoose');

const dropOldDatabase = async () => {
  const OLD_URI = 'mongodb://localhost:27017/namma_yatri';
  
  try {
    console.log('🔗 Connecting to old database: namma_yatri...');
    const conn = await mongoose.connect(OLD_URI);
    
    console.log('🗑️ Dropping database: namma_yatri...');
    await conn.connection.db.dropDatabase();
    
    console.log('✅ Success! Database namma_yatri has been removed.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error dropping database:', err.message);
    process.exit(1);
  }
};

dropOldDatabase();
