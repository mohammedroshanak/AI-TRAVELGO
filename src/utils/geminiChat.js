import { GoogleGenerativeAI } from "@google/generative-ai";

const systemInstruction = `You are a travel expert assistant helping users plan trips. Only respond with travel-related advice such as destinations, weather, safety, packing, transportation, budgeting, food, and attractions.
If the user asks non-travel questions, respond politely: "I'm here to help with travel planning and advice."
Format your responses beautifully using markdown list structures and emojis. Keep them concise, helpful, and friendly.`;

const getModel = (apiKey) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction
  });
};

export const getTravelAIResponse = async (message, history = [], context = null, apiKey) => {
  if (!apiKey) {
    throw new Error("No API key available");
  }

  const model = getModel(apiKey);
  try {
    const formattedHistory = history
      .filter(msg => msg.content && typeof msg.content === 'string' && msg.content.trim().length > 0)
      .map(msg => ({
        role: msg.role === 'ai' || msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content.trim() }]
      }));
    
    // Inject trip context if provided securely
    let finalMessage = message || "";
    if (context && message) {
      const dest = context.destination || "a destination";
      const dur = context.duration || "multiple";
      finalMessage = `[TRIP CONTEXT: Destination: ${dest}, Duration: ${dur} days, Budget: ${context.budget || 'N/A'}]\n\nQuestion: ${message}`;
    }

    if (!finalMessage.trim()) {
      throw new Error("Cannot send an empty message");
    }

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    });

    const result = await chat.sendMessage(finalMessage.trim());
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error details:", error);
    // Rethrow with cleaner message if it's a known proto error
    if (error.message?.includes('initialized field')) {
      throw new Error("AI request structure was invalid. Please try clearing your chat history.");
    }
    throw error;
  }
};
