// --------------------------------------------------
// MOCK AI - MODEL DECISION STAGE
// --------------------------------------------------
//
// This simulates the first model response.
//
// The mock does NOT:
// - access MongoDB
// - create tasks
// - modify data
//
// It only decides whether a tool should be called.
// The provider layer handles execution.
//
// This mirrors Gemini function calling.
// --------------------------------------------------

const generateMockResponse = async (prompt) => {
  const normalizedPrompt = prompt
    .toLowerCase()
    .trim();

  // --------------------------------------------------
  // OVERDUE TASKS
  // --------------------------------------------------

  if (
    normalizedPrompt.includes("overdue") ||
    normalizedPrompt.includes("late tasks") ||
    normalizedPrompt.includes("past deadline")
  ) {
    return {
      type: "tool_call",

      tool: {
        name: "get_overdue_tasks",
        args: {},
      },
    };
  }

  // --------------------------------------------------
  // UPCOMING DEADLINES
  // --------------------------------------------------

  if (
    normalizedPrompt.includes("upcoming deadline") ||
    normalizedPrompt.includes("upcoming deadlines") ||
    normalizedPrompt.includes("tasks due soon")
  ) {
    return {
      type: "tool_call",

      tool: {
        name: "get_upcoming_deadlines",

        args: {
          days: 7,
        },
      },
    };
  }

  // --------------------------------------------------
  // MY TASKS
  // --------------------------------------------------

  if (
    normalizedPrompt.includes("my tasks") ||
    normalizedPrompt.includes("show my tasks") ||
    normalizedPrompt.includes("list my tasks")
  ) {
    return {
      type: "tool_call",

      tool: {
        name: "get_tasks",
        args: {},
      },
    };
  }

  // --------------------------------------------------
  // GENERAL TEXT
  // --------------------------------------------------

  return {
    type: "text",

    reply:
      "Mock AI is active. I can currently help with tasks, deadlines, and ClubOps operations.",
  };
};

module.exports = {
  generateMockResponse,
};