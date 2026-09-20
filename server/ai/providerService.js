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

const {
  executeAction,
} = require("./actionService");

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

  if (provider === "mock") {
    const aiResult =
      await generateMockResponse(
        prompt,
        context
      );

    if (aiResult.type === "text") {
      return {
        type: "text",
        reply: aiResult.reply,
      };
    }

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
    if (aiResult.type === "action_call") {
  if (
    !aiResult.action ||
    !aiResult.action.name
  ) {
    throw new Error(
      "Mock AI returned an invalid action call"
    );
  }

  const actionName =
    aiResult.action.name;

  const actionArgs =
    aiResult.action.args || {};

  console.log(
    "\n========== MOCK ACTION CALL =========="
  );

  console.log(
    "Action:",
    actionName
  );

  console.log(
    "Arguments:",
    JSON.stringify(
      actionArgs,
      null,
      2
    )
  );

  console.log(
    "======================================\n"
  );

  let actionResult;

try {
  actionResult =
    await executeAction(
      actionName,
      actionArgs,
      context
    );
} catch (error) {
  return {
    type: "text",
    reply:
      `I couldn't complete that action: ${error.message}.`,
    action: {
      name: actionName,
      args: actionArgs,
      error: error.message,
    },
  };
}

  return {
    type: "text",

    reply:
      `Task "${actionResult.title}" was created successfully.`,

    action: {
      name: actionName,
      args: actionArgs,
      result: actionResult,
    },
  };
}
    throw new Error(
      `Unsupported Mock AI response type: ${aiResult.type}`
    );
  }

  if (provider === "gemini") {
    return await generateGeminiResponse(
      prompt,
      context
    );
  }

  throw new Error(
    `Unsupported AI provider: ${provider}`
  );
};

module.exports = {
  generateAIResponse,
};