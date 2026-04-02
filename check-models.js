import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyAVXT4hluEQjL495e3piHasyaZ1kK3Ggn4"; // From .env
const genAI = new GoogleGenerativeAI(apiKey);

async function checkModels() {
  try {
    console.log("Fetching available models for this API key...");
    // We fetch using a basic REST call since the SDK doesn't natively expose listModels easily in some versions
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status} - ${await res.text()}`);
    }
    const data = await res.json();
    console.log("AVAILABLE MODELS:");
    data.models.forEach(m => {
        if (m.supportedGenerationMethods.includes("generateContent")) {
            console.log(`- ${m.name}`);
        }
    });
  } catch (e) {
    console.error("Error fetching models:", e);
  }
}

checkModels();
