const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY is missing from environment variables");
}

const ai = new GoogleGenAI({
  apiKey,
});

const generateText = async (prompt) => {
  try {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("========== GEMINI ERROR ==========");
    console.error("Message:", error.message);
    console.error("Name:", error.name);
    console.error("Status:", error.status);
    console.error("==================================");

    throw error;
  }
};

module.exports = {
  generateText,
};