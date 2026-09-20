require("dotenv").config();

const mongoose = require("mongoose");

require("./models/User");
require("./models/Event");
require("./models/Task");

const User = require("./models/User");
const Event = require("./models/Event");

const connectDB = require("./config/db");

const {
  generateAIResponse,
} = require("./ai/providerService");

const runTest = async () => {
  try {
    console.log(
      "\n========== NATURAL LANGUAGE TEST ==========\n"
    );

    await connectDB();

    const user =
      await User.findOne({
        role: "admin",
      });

    const event =
      await Event.findOne();

    if (!user) {
      throw new Error(
        "Admin not found"
      );
    }

    if (!event) {
      throw new Error(
        "Event not found"
      );
    }

    const context = {
      user: {
        userId:
          user._id.toString(),
        role:
          user.role,
      },
    };

    const prompts = [
      `Create a high priority task to arrange certificates for ${event.title} by 2026-12-20`,

      "Show me all overdue tasks",

      "What are my tasks?",

      "Show upcoming deadlines",

      "Hello ClubOps AI",
    ];

    for (const prompt of prompts) {
      console.log(
        "\nUser:",
        prompt
      );

      const result =
        await generateAIResponse(
          prompt,
          context
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
        "----------------------------------"
      );
    }

    console.log(
      "\nNATURAL LANGUAGE TEST COMPLETE 🚀\n"
    );
  } catch (error) {
    console.error(
      "\nTEST ERROR:",
      error.message
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