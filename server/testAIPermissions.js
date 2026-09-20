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
      "\n========== AI PERMISSION TEST ==========\n"
    );

    await connectDB();

    // --------------------------------------------------
    // Find an existing event
    // --------------------------------------------------

    const event = await Event.findOne({
      title: "College Fest",
    });

    if (!event) {
      throw new Error(
        'Test event "College Fest" was not found.'
      );
    }

    // --------------------------------------------------
    // Find real users from database
    // --------------------------------------------------

    const admin =
      await User.findOne({
        role: "admin",
      });

    const coordinator =
      await User.findOne({
        role: "coordinator",
      });

    const volunteer =
      await User.findOne({
        role: "volunteer",
      });

    if (!admin && !coordinator) {
      throw new Error(
        "No admin or coordinator user exists in the database."
      );
    }

    if (!volunteer) {
      throw new Error(
        "No volunteer user exists in the database."
      );
    }

    const allowedUser =
      admin || coordinator;

    console.log(
      "Using allowed user:",
      allowedUser.name,
      `(${allowedUser.role})`
    );

    console.log(
      "Using volunteer:",
      volunteer.name,
      `(${volunteer.role})`
    );

    console.log(
      "Using event:",
      event.title
    );

    // --------------------------------------------------
    // TEST 1: Admin / Coordinator
    // --------------------------------------------------

    console.log(
      "\n========== TEST 1: AUTHORIZED USER ==========\n"
    );

    const authorizedResult =
      await generateAIResponse(
        "Create a high priority task to verify AI permissions for College Fest by 2026-12-30",
        {
          user: {
            userId:
              allowedUser._id.toString(),
            role: allowedUser.role,
          },
        }
      );

    console.log(
      "Authorized result:"
    );

    console.log(
      JSON.stringify(
        authorizedResult,
        null,
        2
      )
    );

    if (
      authorizedResult.action &&
      authorizedResult.action.result
    ) {
      console.log(
        "\nAUTHORIZED ACTION: PASS ✅"
      );
    } else {
      throw new Error(
        "Authorized user could not execute CREATE_TASK."
      );
    }

    // --------------------------------------------------
    // TEST 2: Volunteer
    // --------------------------------------------------

    console.log(
      "\n========== TEST 2: VOLUNTEER ==========\n"
    );

    const volunteerResult =
      await generateAIResponse(
        "Create a high priority task to verify volunteer permissions for College Fest by 2026-12-31",
        {
          user: {
            userId:
              volunteer._id.toString(),
            role: volunteer.role,
          },
        }
      );

    console.log(
      "Volunteer result:"
    );

    console.log(
      JSON.stringify(
        volunteerResult,
        null,
        2
      )
    );

    const volunteerReply =
      String(
        volunteerResult.reply || ""
      ).toLowerCase();

    if (
      volunteerReply.includes(
        "permission"
      ) ||
      volunteerReply.includes(
        "access"
      )
    ) {
      console.log(
        "\nVOLUNTEER BLOCK: PASS ✅"
      );
    } else {
      throw new Error(
        "Volunteer was not blocked correctly."
      );
    }

    console.log(
      "\n=========================================="
    );

    console.log(
      "\nAI PERMISSION TEST COMPLETED SUCCESSFULLY! 🚀\n"
    );
  } catch (error) {
    console.error(
      "\n========== PERMISSION TEST ERROR =========="
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
      "===========================================\n"
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