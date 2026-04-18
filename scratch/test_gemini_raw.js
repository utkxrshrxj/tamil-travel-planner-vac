const axios = require('axios');
require('dotenv').config({ path: './backend/.env' });

async function testRaw() {
  const key = process.env.GEMINI_API_KEY;
  // Try v1 instead of v1beta
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`;
  
  try {
    console.log('Testing raw v1 API with gemini-1.5-flash...');
    const res = await axios.post(url, {
      contents: [{ parts: [{ text: "Hi" }] }]
    });
    console.log('Success with Raw v1!');
    console.log(res.data.candidates[0].content.parts[0].text);
  } catch (err) {
    console.error('Raw v1 failed:', err.response ? err.response.data : err.message);
    
    // Try v1beta as fallback
    console.log('\nTesting raw v1beta API...');
    const urlBeta = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    try {
      const resBeta = await axios.post(urlBeta, {
        contents: [{ parts: [{ text: "Hi" }] }]
      });
      console.log('Success with Raw v1beta!');
    } catch (errBeta) {
      console.error('Raw v1beta failed too:', errBeta.response ? errBeta.response.data : errBeta.message);
    }
  }
}

testRaw();
