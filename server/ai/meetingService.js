const { generateAIResponse } = require("./aiService");

const analyzeMeeting = async (transcript) => {
    const currentDate = new Date().toISOString().split("T")[0];
    const prompt = `
You are an AI assistant for a college club event management system.
Today's date is: ${currentDate}
Analyze the following meeting transcript.

Return ONLY valid JSON in this exact structure:

{
    "summary": "short summary of the meeting",
    "decisions": [
        "decision 1",
        "decision 2"
    ],
    "actionItems": [
        {
            "description": "task that needs to be done",
            "owner": "person responsible, or null if unknown",
            "deadline": "deadline in YYYY-MM-DD format, or null if unknown"
        }
    ]
}

Important rules:
- Do not invent information.
- If an owner is not mentioned, use null.
- If a deadline is explicitly mentioned or clearly stated in the transcript, extract it.
- Convert deadlines such as "September 25" into YYYY-MM-DD format.
- If the year is not mentioned, assume the current year.
- Relative deadlines such as "tomorrow", "next week", etc. should be converted to an actual date when possible.
- If no deadline is mentioned, use null.
- Keep the summary concise.
- Extract only actual decisions and action items.
- Return JSON only. No markdown.

Meeting transcript:

${transcript}
`;

    const response = await generateAIResponse(prompt);

    try {
        return JSON.parse(response);
    } catch (error) {
        console.error("Failed to parse AI response:", response);
        throw new Error("AI returned invalid JSON");
    }
};

module.exports = {
    analyzeMeeting
};