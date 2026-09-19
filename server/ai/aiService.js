const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const generateAIResponse = async (prompt) => {
    try {
        // Try Gemini first
        const interaction = await ai.interactions.create({
            model: "gemini-3.6-flash",
            input: prompt
        });

        console.log("Using Gemini AI");

        return interaction.output_text;

    } catch (error) {
        console.warn("Gemini unavailable. Using mock AI response.");

        // Mock response for hackathon development/demo
        return JSON.stringify({
            summary:
                "The team discussed event preparation tasks and assigned responsibilities to members.",

            decisions: [
                "Event preparation tasks were assigned to team members."
            ],

            actionItems: [
                {
                    description: "Complete the event preparation task",
                    owner: "Rahul",
                    deadline: "2026-09-25"
                },
                {
                    description: "Prepare the volunteer list",
                    owner: "Akshaya",
                    deadline: "2026-09-20"
                }
            ]
        });
    }
};

module.exports = {
    generateAIResponse
};