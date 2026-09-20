const { GoogleGenAI } = require("@google/genai");

const {
  taskToolDefinitions,
} = require("../toolDefinitions");

const {
  executeTool,
} = require("../toolExecutor");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error(
    "GEMINI_API_KEY is missing from environment variables"
  );
}

const ai = new GoogleGenAI({
  apiKey,
});

const MODEL_NAME = "gemini-3.6-flash";

const generateGeminiResponse = async (
  prompt,
  context = {}
) => {
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured"
    );
  }

  const response =
    await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [
          {
            functionDeclarations:
              taskToolDefinitions,
          },
        ],
      },
    });

  const functionCalls =
    response.functionCalls;

  if (
    !functionCalls ||
    functionCalls.length === 0
  ) {
    return {
      type: "text",
      reply: response.text || "",
    };
  }

  const functionResponses = [];

  for (
    const functionCall of functionCalls
  ) {
    const toolName =
      functionCall.name;

    const toolArgs =
      functionCall.args || {};

    console.log(
      "\n========== GEMINI TOOL CALL =========="
    );

    console.log(
      "Tool:",
      toolName
    );

    console.log(
      "Arguments:",
      JSON.stringify(
        toolArgs,
        null,
        2
      )
    );

    console.log(
      "======================================\n"
    );

    const toolResult =
      await executeTool(
        toolName,
        toolArgs,
        context
      );

    functionResponses.push({
      functionResponse: {
        name: toolName,
        response: {
          result: toolResult,
        },
      },
    });
  }

  const finalResponse =
    await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
        {
          role: "model",
          parts:
            response.candidates?.[0]
              ?.content?.parts || [],
        },
        {
          role: "user",
          parts:
            functionResponses,
        },
      ],
      config: {
        tools: [
          {
            functionDeclarations:
              taskToolDefinitions,
          },
        ],
      },
    });

  return {
    type: "text",
    reply:
      finalResponse.text || "",
  };
};

module.exports = {
  generateGeminiResponse,
};