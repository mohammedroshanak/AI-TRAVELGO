import { GoogleGenerativeAI } from "@google/generative-ai";

export const getChatSession = (apiKey) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: "gemini-flash-latest", // Replaced gemini-2.5-flash for stability
  });
};

export const generateSharedTrip = async (parsedParams, apiKey) => {
  const { location, totalDays, budget, traveler } = parsedParams;
  const chatSession = getChatSession(apiKey);
  
  const FINAL_PROMPT = AI_PROMPT
    .replace('{location}', location)
    .replace('{totalDays}', totalDays)
    .replace('{traveler}', String(traveler))
    .replace('{budget}', budget);

  const result = await chatSession.generateContent(FINAL_PROMPT);
  let tripDataText = result.response.text();
  
  // Clean potential markdown blocks
  const match = tripDataText.match(/\{[\s\S]*\}/);
  if (match) tripDataText = match[0];
  
  return JSON.parse(tripDataText);
};

export const AI_PROMPT = `
Generate a travel itinerary based on the following details:
Destination: {location}
For: {totalDays} Days
Budget: {budget}
Travelers: {traveler}

Please provide the response in a structured JSON format matching the following schema:
{
  "hotelOptions": [
    {
      "hotelName": "string",
      "hotelAddress": "string",
      "price": "string",
      "hotelImageUrl": "string",
      "geoCoordinates": "string",
      "rating": "number",
      "description": "string"
    }
  ],
  "itinerary": [
    {
      "day": "string (e.g., Day 1)",
      "plan": [
        {
          "time": "string (e.g., 09:00 AM)",
          "placeName": "string",
          "placeDetails": "string",
          "placeImageUrl": "string",
          "geoCoordinates": "string",
          "ticketPricing": "string",
          "travelTimeToNextLocation": "string"
        }
      ]
    }
  ],
  "estimatedCosts": {
    "totalFlights": "number",
    "dailyFoodPerPerson": "number",
    "transportationPerDay": "number",
    "totalActivities": "number"
  },
  "travelTips": [
    "string"
  ],
  "smartRecommendations": {
    "shopping": [
      { "item": "string", "reason": "string" }
    ],
    "localDelicacies": [
      { "food": "string", "description": "string" }
    ],
    "experienceScores": {
      "nightlife": "number (1-10)",
      "culture": "number (1-10)",
      "relaxation": "number (1-10)",
      "adventure": "number (1-10)"
    },
    "crowdPredictor": {
      "level": "Low | Medium | High",
      "description": "string (predict based on month/season)"
    },
    "safetyScore": {
      "overall": "number (out of 5)",
      "factors": {
        "crime": "number (1-5)",
        "travel": "number (1-5)",
        "women": "number (1-5)",
        "night": "number (1-5)"
      }
    },
    "foodExplorer": {
      "mustTry": ["string"],
      "recommendedRestaurants": [
        { "name": "string", "cuisine": "string", "rating": "number" }
      ]
    }
  }
}
Return only the raw JSON object. Do not include markdown codeblocks or any additional text.
`;

export const getDestinationPrompt = (fromLocation, budget, duration, travelers, preference) => {
  return `
    Suggest exactly 4 fantastic travel destinations matching these criteria:
    From Location: ${fromLocation || 'Anywhere'}
    Budget: ${budget} (Local currency)
    Duration: ${duration}
    Travelers: ${travelers}
    Preference: ${preference}

    For each destination, return a structured JSON response matching EXACTLY this array format:
    [
      {
        "destinationName": "City/Region",
        "country": "Country",
        "estimatedCost": "Approx total cost in ${budget}'s currency",
        "shortDescription": "1-2 sentences about why this fits.",
        "topHighlight": "One major highlight/activity.",
        "bestTravelTime": "Best month/season to visit."
      }
    ]
    Return ONLY the raw JSON array. Exclude ANY AND ALL markdown wrapper blocks like \`\`\`json.
  `;
};

export const generateSharedDestinations = async (fromLocation, budget, duration, travelers, preference, apiKey) => {
  const chatSession = getChatSession(apiKey);
  const prompt = getDestinationPrompt(fromLocation, budget, duration, travelers, preference);

  const result = await chatSession.generateContent(prompt);
  let text = result.response.text();
  
  const jsonMatch = text.match(/\[[\s\S]*\]/); // Match array
  if (jsonMatch) text = jsonMatch[0];

  const data = JSON.parse(text);
  if (Array.isArray(data) && data.length > 0) return data;
  if (data.destinations) return data.destinations;
  throw new Error("Invalid format received");
};
