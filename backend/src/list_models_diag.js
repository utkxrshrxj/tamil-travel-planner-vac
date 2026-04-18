const axios = require('axios');
require('dotenv').config({ path: './backend/.env' });

async function listAll() {
  const key = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${key}`;
  
  try {
    console.log('Fetching available models from v1 API...');
    const res = await axios.get(url);
    console.log('--- AVAILABLE MODELS ---');
    console.log(JSON.stringify(res.data.models.map(m => m.name), null, 2));
  } catch (err) {
    console.error('List status failed (v1):', err.response ? err.response.data : err.message);
    
    console.log('\nFetching from v1beta API...');
    const urlBeta = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    try {
      const resBeta = await axios.get(urlBeta);
      console.log('--- AVAILABLE MODELS (v1beta) ---');
      console.log(JSON.stringify(resBeta.data.models.map(m => m.name), null, 2));
    } catch (errBeta) {
      console.error('List status failed (v1beta):', errBeta.response ? errBeta.response.data : errBeta.message);
    }
  }
}

listAll();
