const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const generateAIResponse = async (prompt) => {

    // Demo mode: do not call Gemini
    if (process.env.DEMO_MODE === "true") {
    console.log("Demo mode enabled. Using local AI response.");

    // Meeting AI requires JSON
    if (
        prompt.includes("actionItems") &&
        prompt.includes("summary") &&
        prompt.includes("decisions")
    ) {
        return JSON.stringify({
            summary:
                "The team discussed College Fest preparation and assigned responsibilities to team members.",

            decisions: [
                "Responsibilities for event preparation were assigned."
            ],

            actionItems: [
                {
                    description: "Coordinate the College Fest event",
                    owner: "Rahul",
                    deadline: "2026-09-25"
                },
                {
                    description: "Prepare the volunteer list",
                    owner: "Akshaya",
                    deadline: "2026-09-20"
                },
                {
                    description: "Handle technical arrangements",
                    owner: "Tirtha",
                    deadline: "2026-09-25"
                },
                {
                    description: "Prepare event documentation",
                    owner: "Pritika",
                    deadline: "2026-09-25"
                }
            ]
        });
    }

    // RAG question answering requires normal text
    if (
        prompt.includes("Answer the user's question") &&
        prompt.includes("Context:")
    ) {
        if (
            prompt.includes(
                "Tirtha is responsible for technical arrangements"
            )
        ) {
            return "Tirtha is responsible for technical arrangements.";
        }

        if (
            prompt.includes(
                "Akshaya is responsible for volunteer coordination"
            )
        ) {
            return "Akshaya is responsible for volunteer coordination.";
        }

        if (
            prompt.includes(
                "Rahul is responsible for event coordination"
            )
        ) {
            return "Rahul is responsible for event coordination.";
        }

        if (
            prompt.includes(
                "Pritika is responsible for documentation"
            )
        ) {
            return "Pritika is responsible for documentation.";
        }

        return "I could not find this information in the uploaded documents.";
    }

    // Generic fallback
    return JSON.stringify({
        summary:
            "The team discussed event preparation tasks and assigned responsibilities to members.",

        decisions: [
            "Event preparation responsibilities were assigned."
        ],

        actionItems: [
            {
                description: "Complete the assigned event preparation task",
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

    // Real Gemini mode
    try {
        const interaction = await ai.interactions.create({
            model: "gemini-3.6-flash",
            input: prompt
        });

        console.log("Using Gemini AI");

        return interaction.output_text;

    } catch (error) {
        console.warn(
            "Gemini unavailable. Using mock AI response."
        );

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