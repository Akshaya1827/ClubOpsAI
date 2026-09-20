const toolRegistry = require("./toolRegistry");

const executeTool = async (
  toolName,
  args = {},
  context = {}
) => {

  const tool =
    toolRegistry[toolName];

  if (!tool) {
    throw new Error(
      `Unknown AI tool: ${toolName}`
    );
  }

  if (
    typeof tool.execute !== "function"
  ) {
    throw new Error(
      `AI tool is not executable: ${toolName}`
    );
  }

  if (
    args !== null &&
    typeof args !== "object"
  ) {
    throw new Error(
      `Invalid arguments for AI tool: ${toolName}`
    );
  }

  console.log(
    "Executing AI tool:",
    toolName
  );

  const finalArgs = {
    ...(args || {}),
  };

  // --------------------------------------------------
  // IMPORTANT:
  // "my tasks" must always use the authenticated
  // user's ID.
  //
  // Never trust an ID invented by the AI model.
  // --------------------------------------------------

  if (
    toolName === "get_tasks" &&
    context.user
  ) {

    if (!context.user.userId) {
      throw new Error(
        "Authenticated user ID is missing"
      );
    }

    finalArgs.assignedTo =
      context.user.userId;
  }

  return await tool.execute(
    finalArgs
  );
};

module.exports = {
  executeTool,
};