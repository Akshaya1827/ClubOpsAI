require("dotenv").config();

const mongoose = require("mongoose");

// --------------------------------------------------
// Register models required by task tools
// --------------------------------------------------

require("./models/User");
require("./models/Event");
require("./models/Task");

// --------------------------------------------------
// AI provider
// --------------------------------------------------

const {
  generateAIResponse,
} = require("./ai/providerService");

// --------------------------------------------------
// Database
// --------------------------------------------------

const connectDB = require("./config/db");

// --------------------------------------------------
// Test
// --------------------------------------------------

const runTest = async () => {
  try {
    console.log(
      "\n========== AI PROVIDER TEST ==========\n"
    );

    // Connect to MongoDB before executing
    // any database-backed AI tool.
    await connectDB();

    const prompt = "What tasks are overdue?";

    console.log("User:", prompt);

    const result = await generateAIResponse(
      prompt
    );

    console.log("\nAI result:");
    console.log(
      JSON.stringify(result, null, 2)
    );

    console.log(
      "\n======================================"
    );
    console.log(
      "AI provider test successful!"
    );
    console.log(
      "======================================\n"
    );

  } catch (error) {
    console.error(
      "\n========== TEST ERROR =========="
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "================================\n"
    );

  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
};

runTest();