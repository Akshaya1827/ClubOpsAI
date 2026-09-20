const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const generateEmbedding = async (text) => {
    try {
        const response = await ai.models.embedContent({
            model: "gemini-embedding-001",
            contents: text,
        });

        return response.embeddings[0].values;
    } catch (error) {
        console.error("Embedding generation error:", error);
        throw new Error("Failed to generate text embedding");
    }
};

module.exports = {
    generateEmbedding,
};