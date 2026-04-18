const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: './backend/.env' });

async function list() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // There is no easy 'listModels' in the basic SDK, but we can try to guess or use a specific one
    // Newer SDKs might have it. Let's try to just hit one that is almost certainly there: 'gemini-1.5-flash'
    // If that fails, let's try 'gemini-1.0-pro'
    console.log('Testing gemini-1.5-flash...');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hi");
    console.log('Success with gemini-1.5-flash!');
    console.log(result.response.text());
  } catch (err) {
    console.error('Failed with gemini-1.5-flash:', err.message);
    
    console.log('\nTesting gemini-pro (legacy)...');
    try {
      const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result2 = await model2.generateContent("Hi");
      console.log('Success with gemini-pro!');
    } catch (err2) {
       console.error('Failed with gemini-pro:', err2.message);
    }
  }
}

list();
