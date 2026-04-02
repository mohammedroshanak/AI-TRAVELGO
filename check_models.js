import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

// Try to load from .env.local
let apiKey = null;
try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const apiKeyMatch = envContent.match(/VITE_GEMINI_API_KEY=([^\s]+)/);
    apiKey = apiKeyMatch ? apiKeyMatch[1] : null;
} catch (e) {
    console.error("Could not read .env.local");
}

if (!apiKey) {
    console.error("API Key not found in .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    const testPrompt = "Hi";
    // Test the names exactly as they appeared or were hinted
    const models = [
        "gemini-1.5-flash",
        "gemini-flash-latest", 
        "gemini-pro-latest",
        "gemini-2.0-flash",
        "gemini-2.5-flash"
    ];
    
    console.log("Testing API Access...");
    
    for (const m of models) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent(testPrompt);
            const response = await result.response;
            console.log(`✅ ${m}: OK`);
        } catch (e) {
            console.log(`❌ ${m}: FAILED - ${e.message}`);
        }
    }
}

listModels();
