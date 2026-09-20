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
      "\n========== MOCK AI ACTION TEST ==========\n"
    );

    await connectDB();

    // -----------------------------------------
    // Find authorized user
    // -----------------------------------------

    const user =
      await User.findOne({
        role: {
          $in: [
            "admin",
            "coordinator",
          ],
        },
      });
    const assignedUser =
  await User.findOne({
    _id: {
      $ne: user._id,
    },
  });

if (!assignedUser) {
  throw new Error(
    "No user available for task assignment"
  );
}
    if (!user) {
      throw new Error(
        "No admin or coordinator user found"
      );
    }

    // -----------------------------------------
    // Find event
    // -----------------------------------------

    const event =
      await Event.findOne();

    if (!event) {
      throw new Error(
        "No event found in database"
      );
    }

    console.log(
      "User:",
      user.name,
      `(${user.role})`
    );

    console.log(
      "Event:",
      event.title
    );

    // -----------------------------------------
    // AI request
    // -----------------------------------------

    const prompt =
  `create task | ${event.title} | Arrange certificates | high | 2026-12-20 | ${assignedUser.name}`;

    // -----------------------------------------
    // Run AI
    // -----------------------------------------

    const result =
      await generateAIResponse(
        prompt,
        {
          user: {
            userId:
              user._id.toString(),

            role:
              user.role,
          },
        }
      );

    // -----------------------------------------
    // Show result
    // -----------------------------------------

    console.log(
      "\nAI result:"
    );

    console.log(
      JSON.stringify(
        result,
        null,
        2
      )
    );

    console.log(
      "\n=========================================="
    );

    console.log(
      "MOCK AI ACTION TEST SUCCESSFUL!"
    );

    console.log(
      "==========================================\n"
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
    if (
      mongoose.connection.readyState !== 0
    ) {
      await mongoose.connection.close();
    }
  }
};

runTest();