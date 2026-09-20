require("dotenv").config();

const mongoose = require("mongoose");

require("./models/User");
require("./models/Event");
require("./models/Task");

const User = require("./models/User");
const Task = require("./models/Task");

const connectDB = require("./config/db");

const {
  executeAction,
} = require("./ai/actionService");

const runTest = async () => {
  try {
    console.log(
      "\n========== TASK ACTION TEST ==========\n"
    );

    await connectDB();

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
        "No admin or coordinator found"
      );
    }

    const task =
      await Task.findOne().sort({
        createdAt: -1,
      });

    if (!task) {
      throw new Error(
        "No task found"
      );
    }

    console.log(
      "User:",
      user.name,
      `(${user.role})`
    );

    console.log(
      "Task:",
      task.title
    );

    // UPDATE
    const updatedTask =
      await executeAction(
        "UPDATE_TASK",
        {
          taskId:
            task._id.toString(),
          priority: "low",
        },
        {
          user: {
            userId:
              user._id.toString(),
            role: user.role,
          },
        }
      );

    console.log(
      "\nUpdated task:"
    );

    console.log(
      JSON.stringify(
        updatedTask,
        null,
        2
      )
    );

    // COMPLETE
    const completedTask =
      await executeAction(
        "COMPLETE_TASK",
        {
          taskId:
            task._id.toString(),
        },
        {
          user: {
            userId:
              user._id.toString(),
            role: user.role,
          },
        }
      );

    console.log(
      "\nCompleted task:"
    );

    console.log(
      JSON.stringify(
        completedTask,
        null,
        2
      )
    );

    console.log(
      "\n======================================"
    );

    console.log(
      "TASK ACTION TEST SUCCESSFUL!"
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
    if (
      mongoose.connection.readyState !== 0
    ) {
      await mongoose.connection.close();
    }
  }
};

runTest();