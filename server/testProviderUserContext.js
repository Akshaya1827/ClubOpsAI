require("dotenv").config();

const mongoose = require("mongoose");

require("./models/User");
require("./models/Event");
require("./models/Task");

const {
  generateAIResponse,
} = require("./ai/providerService");

const connectDB = require("./config/db");

const runTest = async () => {
  try {
    console.log(
      "\n========== PROVIDER USER CONTEXT TEST ==========\n"
    );

    await connectDB();

    // This simulates the object produced by
    // authMiddleware after JWT verification.
    const fakeAuthenticatedUser = {
      userId: "REPLACE_WITH_REAL_USER_ID",
      role: "volunteer",
    };

    const prompt = "Show my tasks";

    console.log("User:", prompt);

    const result = await generateAIResponse(
      prompt,
      {
        user: fakeAuthenticatedUser,
      }
    );

    console.log("\nAI result:");
    console.log(
      JSON.stringify(result, null, 2)
    );

    console.log(
      "\n================================================="
    );
    console.log(
      "Provider user-context test successful!"
    );
    console.log(
      "=================================================\n"
    );

  } catch (error) {
    console.error(
      "\n========== TEST ERROR =========="
    );
    console.error("Message:", error.message);
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