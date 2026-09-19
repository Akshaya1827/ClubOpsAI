const Task = require("../models/Task");
const Event = require("../models/Event");
const User = require("../models/User");

const ALLOWED_CREATE_TASK_ROLES = [
  "admin",
  "coordinator",
];

const createTask = async (args = {}, context = {}) => {
  const {
    title,
    description,
    eventId,
    assignedTo,
    priority = "medium",
    dueDate,
  } = args;

  // -----------------------------------------
  // 1. Authentication check
  // -----------------------------------------

  if (!context.user || !context.user.userId) {
    throw new Error(
      "Authenticated user is required"
    );
  }

  // -----------------------------------------
  // 2. Permission check
  // -----------------------------------------

  if (
    !ALLOWED_CREATE_TASK_ROLES.includes(
      context.user.role
    )
  ) {
    throw new Error(
      "You do not have permission to create tasks"
    );
  }

  // -----------------------------------------
  // 3. Required field validation
  // -----------------------------------------

  if (
    !title ||
    typeof title !== "string" ||
    !title.trim()
  ) {
    throw new Error(
      "Task title is required"
    );
  }

  if (!eventId) {
    throw new Error(
      "Event ID is required"
    );
  }

  if (!dueDate) {
    throw new Error(
      "Task due date is required"
    );
  }

  // -----------------------------------------
  // 4. Validate priority
  // -----------------------------------------

  const allowedPriorities = [
    "low",
    "medium",
    "high",
  ];

  if (!allowedPriorities.includes(priority)) {
    throw new Error(
      "Invalid task priority"
    );
  }

  // -----------------------------------------
  // 5. Validate due date
  // -----------------------------------------

  const parsedDueDate =
    new Date(dueDate);

  if (
    Number.isNaN(
      parsedDueDate.getTime()
    )
  ) {
    throw new Error(
      "Invalid task due date"
    );
  }

  // -----------------------------------------
  // 6. Verify event exists
  // -----------------------------------------

  const event =
    await Event.findById(eventId);

  if (!event) {
    throw new Error(
      "Event not found"
    );
  }

  // -----------------------------------------
  // 7. Verify assigned user exists
  // -----------------------------------------

  let assignedUser = null;

  if (assignedTo) {
    assignedUser =
      await User.findById(assignedTo);

    if (!assignedUser) {
      throw new Error(
        "Assigned user not found"
      );
    }
  }

  // -----------------------------------------
  // 8. Create task
  // -----------------------------------------

  const task =
    await Task.create({
      title: title.trim(),
      description:
        description?.trim() || "",
      event: event._id,
      assignedTo:
        assignedUser?._id,
      priority,
      status: "todo",
      dueDate: parsedDueDate,
    });

  // -----------------------------------------
  // 9. Return useful result
  // -----------------------------------------

  const populatedTask =
    await Task.findById(task._id)
      .populate(
        "assignedTo",
        "name email role"
      )
      .populate(
        "event",
        "title date"
      );

  return populatedTask;
};

const executeAction = async (
  actionName,
  args = {},
  context = {}
) => {
  if (actionName === "CREATE_TASK") {
    return await createTask(
      args,
      context
    );
  }

  throw new Error(
    `Unknown AI action: ${actionName}`
  );
};

module.exports = {
  createTask,
  executeAction,
};