require("dotenv").config();

const mongoose = require("mongoose");

// --------------------------------------------------
// Register models required by Task.populate()
// --------------------------------------------------

require("./models/User");
require("./models/Event");
require("./models/Task");

// --------------------------------------------------
// AI modules
// --------------------------------------------------

const {
  generateMockResponse,
} = require("./ai/mockAIService");

const {
  executeTool,
} = require("./ai/toolExecutor");

// --------------------------------------------------
// Database
// --------------------------------------------------

const connectDB = require("./config/db");

// --------------------------------------------------
// Test
// --------------------------------------------------

const runTest = async () => {
  try {
    console.log("\n========== MOCK AI TOOL FLOW ==========\n");

    // Connect to MongoDB
    await connectDB();

    const prompt = "What tasks are overdue?";

    console.log("User:", prompt);

    // --------------------------------------------------
    // Step 1: Mock AI interprets the user's request
    // --------------------------------------------------

    const aiResult = await generateMockResponse(prompt);

    console.log("\nMock AI result:");
    console.log(JSON.stringify(aiResult, null, 2));

    // --------------------------------------------------
    // Step 2: Validate Mock AI output
    // --------------------------------------------------

    if (
      aiResult.type !== "tool_call" ||
      !aiResult.tool ||
      !aiResult.tool.name
    ) {
      throw new Error("Mock AI did not return a valid tool call");
    }

    // --------------------------------------------------
    // Step 3: Execute the ClubOps tool
    // --------------------------------------------------

    const toolResult = await executeTool(
      aiResult.tool.name,
      aiResult.tool.args || {}
    );

    console.log("\nTool result:");
    console.log(JSON.stringify(toolResult, null, 2));

    // --------------------------------------------------
    // Success
    // --------------------------------------------------

    console.log("\n========================================");
    console.log("Mock AI → Tool → MongoDB flow successful!");
    console.log("========================================\n");

  } catch (error) {
    console.error("\n========== TEST ERROR ==========");
    console.error("Message:", error.message);
    console.error("Name:", error.name);
    console.error("================================\n");

  } finally {
    // Close MongoDB connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
};

runTest();