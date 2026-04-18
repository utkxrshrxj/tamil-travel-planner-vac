const { generateTravelDataAI } = require('../backend/src/services/aiService');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

async function runTests() {
  console.log('--- STARTING AI OPTIMIZATION TESTS ---');
  
  // Test case 1: Cache checking
  console.log('\n[Test 1] Searching for flights (First time - should hit AI or fallback)');
  const results1 = await generateTravelDataAI('flight', 'MAS', 'DLI', '2026-05-26');
  console.log(`Results received: ${results1.length}`);
  
  console.log('\n[Test 2] Searching for same flights (Second time - should hit CACHE)');
  const startTime = Date.now();
  const results2 = await generateTravelDataAI('flight', 'MAS', 'DLI', '2026-05-26');
  const duration = Date.now() - startTime;
  console.log(`Results received: ${results2.length}`);
  console.log(`Time taken: ${duration}ms (Expected < 10ms for cache hit)`);

  // Test case 2: Demo data fallback (Simulate missing key)
  console.log('\n[Test 3] Simulating missing API Key fallback');
  const originalKey = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = '';
  const results3 = await generateTravelDataAI('bus', 'CBE', 'BLR', '2026-04-20');
  console.log(`Results received: ${results3.length}`);
  console.log(`Sample operator: ${results3[0]?.busOperator}`);
  console.log(`Is Demo Data: ${results3[0]?.isDemoData ? 'YES' : 'NO'}`);
  process.env.GEMINI_API_KEY = originalKey;

  console.log('\n--- TESTS COMPLETED ---');
}

runTests().catch(console.error);
