const {
  generateMockResponse,
} = require("./mockAIService");

const {
  generateMockFinalResponse,
} = require("./mockFinalResponseService");

const {
  generateGeminiResponse,
} = require("./providers/geminiProvider");

const {
  executeTool,
} = require("./toolExecutor");

// --------------------------------------------------
// AI PROVIDER SERVICE
// --------------------------------------------------
//
// This is the single entry point for AI.
//
// The rest of ClubOps does:
//
// generateAIResponse(prompt, context)
//
// It does NOT care whether the provider is:
// - mock
// - gemini
// --------------------------------------------------

const generateAIResponse = async (
  prompt,
  context = {}
) => {

  const provider =
    process.env.AI_PROVIDER || "mock";

  console.log(
    "\n========== AI PROVIDER =========="
  );

  console.log(
    "Provider:",
    provider
  );

  console.log(
    "=================================\n"
  );

  // ------------------------------------------------
  // MOCK PROVIDER
  // ------------------------------------------------

  if (provider === "mock") {

    const aiResult =
      await generateMockResponse(
        prompt,
        context
      );

    // Normal text response
    if (aiResult.type === "text") {
      return {
        type: "text",
        reply: aiResult.reply,
      };
    }

    // Tool call
    if (aiResult.type === "tool_call") {

      if (
        !aiResult.tool ||
        !aiResult.tool.name
      ) {
        throw new Error(
          "Mock AI returned an invalid tool call"
        );
      }

      const toolName =
        aiResult.tool.name;

      const toolArgs =
        aiResult.tool.args || {};

      console.log(
        "\n========== MOCK TOOL CALL =========="
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
        "====================================\n"
      );

      const toolResult =
        await executeTool(
          toolName,
          toolArgs,
          context
        );

      const finalResult =
        await generateMockFinalResponse(
          prompt,
          toolName,
          toolResult
        );

      return {
        type: "text",

        reply: finalResult.reply,

        tool: {
          name: toolName,
          args: toolArgs,
        },
      };
    }

    throw new Error(
      `Unsupported Mock AI response type: ${aiResult.type}`
    );
  }

  // ------------------------------------------------
  // GEMINI PROVIDER
  // ------------------------------------------------

  if (provider === "gemini") {

    return await generateGeminiResponse(
      prompt,
      context
    );
  }

  // ------------------------------------------------
  // UNKNOWN PROVIDER
  // ------------------------------------------------

  throw new Error(
    `Unsupported AI provider: ${provider}`
  );
};

module.exports = {
  generateAIResponse,
};