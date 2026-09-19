const { GoogleGenAI } = require("@google/genai");

const {
  taskToolDefinitions,
} = require("./toolDefinitions");

const {
  executeTool,
} = require("./toolExecutor");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY is missing from environment variables");
}

const ai = new GoogleGenAI({
  apiKey,
});

const MODEL_NAME = "gemini-3.6-flash";

const SYSTEM_INSTRUCTION = `
You are ClubOps AI, an AI assistant for a college club event-management platform.

Your job is to help users understand and manage their club operations.

You have access only to the ClubOps tools explicitly provided to you.

Use a ClubOps tool when the user's request requires actual ClubOps application data.

For general questions, answer normally without requesting a tool.

Never invent ClubOps data.

When tool data is returned, base your answer on that data.

Be concise, helpful, and clear.

The currently authenticated ClubOps user is:

USER_CONTEXT_PLACEHOLDER
`;

const generateText = async (prompt, context = {}) => {
  try {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    const user = context.user;
    const userContext = user
      ? {
          userId: user.id || user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      : null;
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];
    const systemInstruction = SYSTEM_INSTRUCTION.replace(
  "USER_CONTEXT_PLACEHOLDER",
  JSON.stringify(userContext)
);
    const config = {
      systemInstruction,

      tools: [
        {
          functionDeclarations: taskToolDefinitions,
        },
      ],
    };

    // First Gemini request
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents,
      config,
    });

    // Check whether Gemini requested a tool
    if (response.functionCalls && response.functionCalls.length > 0) {
      const toolResults = [];

      // Preserve Gemini's original model response.
      contents.push(response.candidates[0].content);

      for (const functionCall of response.functionCalls) {
        console.log("\n========== AI TOOL CALL ==========");
        console.log("Tool:", functionCall.name);
        console.log("Arguments:", functionCall.args || {});
        console.log("==================================\n");

        const result = await executeTool(
          functionCall.name,
          functionCall.args || {},
          context
        );

        toolResults.push({
          name: functionCall.name,
          result,
        });

        // Send the tool result back to Gemini.
        contents.push({
          role: "user",
          parts: [
            {
              functionResponse: {
                name: functionCall.name,
                response: {
                  result,
                },
                ...(functionCall.id
                  ? { id: functionCall.id }
                  : {}),
              },
            },
          ],
        });
      }

      // Second Gemini request:
      // Gemini now sees the actual ClubOps data.
      const finalResponse = await ai.models.generateContent({
        model: MODEL_NAME,
        contents,
        config,
      });

      return {
        type: "tool_result",
        tools: toolResults,
        reply: finalResponse.text,
      };
    }

    // Normal non-tool response
    return {
      type: "text",
      reply: response.text,
    };
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