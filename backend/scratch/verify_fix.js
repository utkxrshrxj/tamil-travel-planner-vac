const axios = require('axios');

async function testNLPLimiter() {
  const url = 'http://localhost:5000/api/nlp/parse';
  const data = { text: 'சென்னையிலிருந்து டெல்லிக்கு விமானம்' };
  
  console.log('--- Testing NLP Rate Limiter ---');
  for (let i = 1; i <= 25; i++) {
    try {
      const response = await axios.post(url, data);
      console.log(`Request ${i}: Success (${response.status})`);
    } catch (error) {
      console.log(`Request ${i}: Failed (${error.response ? error.response.status : error.message}) - ${error.response ? JSON.stringify(error.response.data) : ''}`);
      if (error.response && error.response.status === 429) {
        console.log('✅ Rate limit triggered successfully!');
        break;
      }
    }
  }
}

async function testGeminiStability() {
    const url = 'http://localhost:5000/api/nlp/parse';
    const data = { text: 'மதுரையிலிருந்து கோவைக்கு பேருந்து' };
    
    console.log('\n--- Testing Gemini Stability (gemini-1.5-flash) ---');
    try {
        const response = await axios.post(url, data);
        console.log('Response:', JSON.stringify(response.data, null, 2));
        if (response.data.success) {
            console.log('✅ AI parsing working correctly!');
        } else {
            console.log('❌ AI parsing failed (likely hit the fallback or error).');
        }
    } catch (error) {
        console.log('❌ Request failed:', error.message);
    }
}

// Run tests
(async () => {
    await testGeminiStability();
    await testNLPLimiter();
})();
