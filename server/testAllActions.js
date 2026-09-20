require("dotenv").config();

const mongoose = require("mongoose");

require("./models/User");
require("./models/Event");
require("./models/Task");
require("./models/Announcement");
require("./models/Meeting");

const User = require("./models/User");
const Event = require("./models/Event");
const Task = require("./models/Task");

const connectDB = require("./config/db");

const {
  executeAction,
} = require("./ai/actionService");

const runTest = async () => {
  try {
    console.log(
      "\n========== ALL ACTIONS TEST ==========\n"
    );

    await connectDB();

    const admin =
      await User.findOne({
        role: "admin",
      });

    const assignedUser =
      await User.findOne({
        _id: {
          $ne: admin?._id,
        },
      });

    const event =
      await Event.findOne();

    if (!admin) {
      throw new Error(
        "Admin not found"
      );
    }

    if (!assignedUser) {
      throw new Error(
        "Second user not found"
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
          admin._id.toString(),
        role: admin.role,
      },
    };

    console.log(
      "Admin:",
      admin.name
    );

    console.log(
      "Event:",
      event.title
    );

    console.log(
      "Assigned user:",
      assignedUser.name
    );

    // CREATE
    const createdTask =
      await executeAction(
        "CREATE_TASK",
        {
          title:
            "AI Action Test Task",
          eventName:
            event.title,
          assignedToName:
            assignedUser.name,
          priority:
            "medium",
          dueDate:
            "2026-12-25",
        },
        context
      );

    console.log(
      "\n1. CREATE_TASK ✅"
    );

    // ASSIGN
    const assignedTask =
      await executeAction(
        "ASSIGN_TASK",
        {
          taskId:
            createdTask._id.toString(),
          assignedToName:
            admin.name,
        },
        context
      );

    console.log(
      "2. ASSIGN_TASK ✅"
    );

    // UPDATE
    await executeAction(
      "UPDATE_TASK",
      {
        taskId:
          createdTask._id.toString(),
        priority:
          "high",
      },
      context
    );

    console.log(
      "3. UPDATE_TASK ✅"
    );

    // COMPLETE
    await executeAction(
      "COMPLETE_TASK",
      {
        taskId:
          createdTask._id.toString(),
      },
      context
    );

    console.log(
      "4. COMPLETE_TASK ✅"
    );

    // EVENT
    await executeAction(
      "UPDATE_EVENT",
      {
        eventName:
          event.title,
        location:
          "Main Auditorium",
      },
      context
    );

    console.log(
      "5. UPDATE_EVENT ✅"
    );

    // ANNOUNCEMENT
    await executeAction(
      "CREATE_ANNOUNCEMENT",
      {
        title:
          "AI Test Announcement",
        content:
          "This announcement was created through ClubOps AI.",
        eventName:
          event.title,
      },
      context
    );

    console.log(
      "6. CREATE_ANNOUNCEMENT ✅"
    );

    // MEETING
    await executeAction(
      "CREATE_MEETING",
      {
        title:
          "AI Planning Meeting",
        date:
          "2026-10-01",
        eventName:
          event.title,
        location:
          "Meeting Room A",
      },
      context
    );

    console.log(
      "7. CREATE_MEETING ✅"
    );

    console.log(
      "\n======================================"
    );

    console.log(
      "ALL ACTIONS SUCCESSFUL 🚀"
    );

    console.log(
      "======================================\n"
    );
  } catch (error) {
    console.error(
      "\n========== TEST ERROR =========="
    );

    console.error(
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