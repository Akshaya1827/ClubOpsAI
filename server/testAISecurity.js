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
      "\n========== AI SECURITY TEST ==========\n"
    );

    await connectDB();

    const admin =
      await User.findOne({
        role: "admin",
      });

    const event =
      await Event.findOne({
        title: "College Fest",
      });

    if (!admin) {
      throw new Error(
        "No admin user found."
      );
    }

    if (!event) {
      throw new Error(
        'Event "College Fest" was not found.'
      );
    }

    // ------------------------------------------
    // TEST 1: Unknown action
    // ------------------------------------------

    console.log(
      "\nTEST 1: Unknown action"
    );

    try {
      const {
        executeAction,
      } = require("./ai/actionService");

      await executeAction(
        "DELETE_DATABASE",
        {},
        {
          user: {
            userId:
              admin._id.toString(),
            role: "admin",
          },
        }
      );

      throw new Error(
        "Unknown action was incorrectly accepted."
      );
    } catch (error) {
      if (
        error.message.includes(
          "Unknown AI action"
        )
      ) {
        console.log(
          "Unknown action blocked ✅"
        );
      } else {
        throw error;
      }
    }

    // ------------------------------------------
    // TEST 2: Missing authentication
    // ------------------------------------------

    console.log(
      "\nTEST 2: Missing authentication"
    );

    try {
      const {
        executeAction,
      } = require("./ai/actionService");

      await executeAction(
        "CREATE_TASK",
        {
          title: "Unauthorized test",
          eventName: "College Fest",
          priority: "low",
          dueDate: "2026-12-31",
        },
        {}
      );

      throw new Error(
        "Unauthenticated action was incorrectly accepted."
      );
    } catch (error) {
      if (
        error.message.includes(
          "Authenticated user"
        )
      ) {
        console.log(
          "Missing authentication blocked ✅"
        );
      } else {
        throw error;
      }
    }

    // ------------------------------------------
    // TEST 3: Volunteer cannot create task
    // ------------------------------------------

    const volunteer =
      await User.findOne({
        role: "volunteer",
      });

    if (!volunteer) {
      throw new Error(
        "No volunteer user found."
      );
    }

    console.log(
      "\nTEST 3: Volunteer action"
    );

    const result =
      await generateAIResponse(
        "Create a task to test security for College Fest by 2026-12-31",
        {
          user: {
            userId:
              volunteer._id.toString(),
            role: volunteer.role,
          },
        }
      );

    console.log(
      JSON.stringify(
        result,
        null,
        2
      )
    );

    if (
      String(result.reply || "")
        .toLowerCase()
        .includes("permission")
    ) {
      console.log(
        "Volunteer action blocked ✅"
      );
    } else {
      throw new Error(
        "Volunteer action was not blocked."
      );
    }

    console.log(
      "\n======================================"
    );

    console.log(
      "\nAI SECURITY TEST COMPLETED! 🔐\n"
    );
  } catch (error) {
    console.error(
      "\n========== SECURITY TEST ERROR =========="
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Stack:",
      error.stack
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