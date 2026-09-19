require("dotenv").config();

const mongoose = require("mongoose");

require("./models/User");
require("./models/Event");
require("./models/Task");

const User = require("./models/User");
const Event = require("./models/Event");

const connectDB = require("./config/db");

const {
  executeAction,
} = require("./ai/actionService");

const runTest = async () => {
  try {
    console.log(
      "\n========== CREATE TASK ACTION TEST ==========\n"
    );

    await connectDB();

    // -----------------------------------------
    // Find an admin/coordinator user
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

    if (!user) {
      throw new Error(
        "No admin or coordinator user found in database"
      );
    }

    console.log(
      "Acting user:",
      user.name,
      `(${user.role})`
    );

    // -----------------------------------------
    // Find an existing event
    // -----------------------------------------

    const event =
      await Event.findOne();

    if (!event) {
      throw new Error(
        "No event found in database. Create an event first."
      );
    }

    console.log(
      "Event:",
      event.title
    );

    // -----------------------------------------
    // Find another user to assign task to
    // -----------------------------------------

    const assignedUser =
      await User.findOne();

    console.log(
      "Assigned user:",
      assignedUser
        ? assignedUser.name
        : "Unassigned"
    );

    // -----------------------------------------
    // Execute AI action
    // -----------------------------------------

    const result =
      await executeAction(
        "CREATE_TASK",
        {
          title:
            "AI Demo - Arrange Certificates",

          description:
            "Task created through the ClubOps AI action layer.",

          eventId:
            event._id.toString(),

          assignedTo:
            assignedUser
              ? assignedUser._id.toString()
              : undefined,

          priority: "high",

          dueDate:
            "2026-12-31",
        },
        {
          user: {
            userId:
              user._id.toString(),

            role:
              user.role,
          },
        }
      );

    console.log(
      "\nCreated task:"
    );

    console.log(
      JSON.stringify(
        result,
        null,
        2
      )
    );

    console.log(
      "\n=============================================="
    );

    console.log(
      "CREATE_TASK action test successful!"
    );

    console.log(
      "==============================================\n"
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