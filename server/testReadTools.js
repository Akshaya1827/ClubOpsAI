require("dotenv").config();

const mongoose = require("mongoose");

require("./models/User");
require("./models/Event");
require("./models/Task");
require("./models/Volunteer");
require("./models/Meeting");
require("./models/Announcement");

const connectDB =
  require("./config/db");

const {
  generateAIResponse,
} = require("./ai/providerService");

const runTest = async () => {
  try {
    console.log(
      "\n========== AI READ TOOLS TEST ==========\n"
    );

    await connectDB();

    const prompts = [
      "Show upcoming events",
      "Show available volunteers",
      "Show upcoming meetings",
      "Show recent announcements",
    ];

    for (const prompt of prompts) {
      console.log("\nUser:", prompt);

      const result =
        await generateAIResponse(
          prompt,
          {
            user: {
              userId: "test-user",
              role: "admin",
            },
          }
        );

      console.log(
        "AI:",
        JSON.stringify(
          result,
          null,
          2
        )
      );

      console.log(
        "\n----------------------------------------"
      );
    }

    console.log(
      "\nAI READ TOOLS TEST COMPLETED!\n"
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
      "Stack:",
      error.stack
    );

    console.error(
      "================================\n"
    );
  } finally {
    if (
      mongoose.connection.readyState !== 0
    ) {
      await mongoose.connection.close();
    }
  }
};

runTest();