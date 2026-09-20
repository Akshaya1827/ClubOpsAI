const Task = require("../models/Task");
const Event = require("../models/Event");
const User = require("../models/User");
const Announcement = require("../models/Announcement");
const Meeting = require("../models/Meeting");

const ADMIN_COORDINATOR_ROLES = [
  "admin",
  "coordinator",
];

// =========================================
// HELPERS
// =========================================

const requireAuth = (context) => {
  if (!context.user || !context.user.userId) {
    throw new Error(
      "Authenticated user is required"
    );
  }
};

const requireRole = (context, roles) => {
  requireAuth(context);

  if (!roles.includes(context.user.role)) {
    throw new Error(
      "You do not have permission to perform this action"
    );
  }
};

const findEvent = async ({
  eventId,
  eventName,
}) => {
  let event = null;

  if (eventId) {
    event = await Event.findById(eventId);
  }

  if (!event && eventName) {
    event = await Event.findOne({
      title: {
        $regex: `^${eventName.trim()}$`,
        $options: "i",
      },
    });
  }

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
};

const findUser = async ({
  userId,
  userName,
}) => {
  let user = null;

  if (userId) {
    user = await User.findById(userId);
  }

  if (!user && userName) {
    user = await User.findOne({
      name: {
        $regex: `^${userName.trim()}$`,
        $options: "i",
      },
    });
  }

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// =========================================
// CREATE TASK
// =========================================

const createTask = async (
  args = {},
  context = {}
) => {
  requireRole(
    context,
    ADMIN_COORDINATOR_ROLES
  );

  const {
    title,
    description,
    eventId,
    eventName,
    assignedTo,
    assignedToName,
    priority = "medium",
    dueDate,
  } = args;

  if (
    !title ||
    typeof title !== "string" ||
    !title.trim()
  ) {
    throw new Error(
      "Task title is required"
    );
  }

  if (!dueDate) {
    throw new Error(
      "Task due date is required"
    );
  }

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

  const event = await findEvent({
    eventId,
    eventName,
  });

  const assignedUser =
    assignedTo || assignedToName
      ? await findUser({
          userId: assignedTo,
          userName: assignedToName,
        })
      : null;

  const task = await Task.create({
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

  return await Task.findById(task._id)
    .populate(
      "assignedTo",
      "name email role"
    )
    .populate(
      "event",
      "title date"
    );
};

// =========================================
// UPDATE TASK
// =========================================

const updateTask = async (
  args = {},
  context = {}
) => {
  requireRole(
    context,
    ADMIN_COORDINATOR_ROLES
  );

  const {
    taskId,
    title,
    description,
    priority,
    status,
    dueDate,
  } = args;

  if (!taskId) {
    throw new Error(
      "Task ID is required"
    );
  }

  const task =
    await Task.findById(taskId);

  if (!task) {
    throw new Error(
      "Task not found"
    );
  }

  if (title !== undefined) {
    task.title = title.trim();
  }

  if (description !== undefined) {
    task.description =
      description.trim();
  }

  if (priority !== undefined) {
    if (
      ![
        "low",
        "medium",
        "high",
      ].includes(priority)
    ) {
      throw new Error(
        "Invalid task priority"
      );
    }

    task.priority = priority;
  }

  if (status !== undefined) {
    if (
      ![
        "todo",
        "in-progress",
        "completed",
      ].includes(status)
    ) {
      throw new Error(
        "Invalid task status"
      );
    }

    task.status = status;
  }

  if (dueDate !== undefined) {
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

    task.dueDate =
      parsedDueDate;
  }

  await task.save();

  return await Task.findById(task._id)
    .populate(
      "assignedTo",
      "name email role"
    )
    .populate(
      "event",
      "title date"
    );
};

// =========================================
// COMPLETE TASK
// =========================================

const completeTask = async (
  args = {},
  context = {}
) => {
  requireRole(
    context,
    ADMIN_COORDINATOR_ROLES
  );

  const { taskId } = args;

  if (!taskId) {
    throw new Error(
      "Task ID is required"
    );
  }

  const task =
    await Task.findById(taskId);

  if (!task) {
    throw new Error(
      "Task not found"
    );
  }

  task.status = "completed";

  await task.save();

  return await Task.findById(task._id)
    .populate(
      "assignedTo",
      "name email role"
    )
    .populate(
      "event",
      "title date"
    );
};

// =========================================
// ASSIGN TASK
// =========================================

const assignTask = async (
  args = {},
  context = {}
) => {
  requireRole(
    context,
    ADMIN_COORDINATOR_ROLES
  );

  const {
    taskId,
    assignedTo,
    assignedToName,
  } = args;

  if (!taskId) {
    throw new Error(
      "Task ID is required"
    );
  }

  const task =
    await Task.findById(taskId);

  if (!task) {
    throw new Error(
      "Task not found"
    );
  }

  const user = await findUser({
    userId: assignedTo,
    userName: assignedToName,
  });

  task.assignedTo =
    user._id;

  await task.save();

  return await Task.findById(task._id)
    .populate(
      "assignedTo",
      "name email role"
    )
    .populate(
      "event",
      "title date"
    );
};

// =========================================
// CREATE ANNOUNCEMENT
// =========================================

const createAnnouncement = async (
  args = {},
  context = {}
) => {
  requireRole(
    context,
    ADMIN_COORDINATOR_ROLES
  );

  const {
    title,
    content,
    eventId,
    eventName,
  } = args;

  if (!title?.trim()) {
    throw new Error(
      "Announcement title is required"
    );
  }

  if (!content?.trim()) {
    throw new Error(
      "Announcement content is required"
    );
  }

  let event = null;

  if (eventId || eventName) {
    event = await findEvent({
      eventId,
      eventName,
    });
  }

  const announcement =
    await Announcement.create({
      title: title.trim(),
      content: content.trim(),
      eventId:
        event?._id || undefined,
      createdBy:
        context.user.userId,
      status: "Draft",
    });

  return announcement;
};

// =========================================
// CREATE MEETING
// =========================================

const createMeeting = async (
  args = {},
  context = {}
) => {
  requireRole(
    context,
    ADMIN_COORDINATOR_ROLES
  );

  const {
    title,
    eventId,
    eventName,
    date,
    location,
    attendees = [],
  } = args;

  if (!title?.trim()) {
    throw new Error(
      "Meeting title is required"
    );
  }

  if (!date) {
    throw new Error(
      "Meeting date is required"
    );
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    throw new Error(
      "Invalid meeting date"
    );
  }

  let event = null;

  if (eventId || eventName) {
    event = await findEvent({
      eventId,
      eventName,
    });
  }

  const meeting =
    await Meeting.create({
      title: title.trim(),
      eventId:
        event?._id || undefined,
      date: parsedDate,
      location:
        location?.trim() || "",
      attendees,
      status: "Scheduled",
    });

  return meeting;
};

// =========================================
// UPDATE EVENT
// =========================================

const updateEvent = async (
  args = {},
  context = {}
) => {
  requireRole(
    context,
    ADMIN_COORDINATOR_ROLES
  );

  const {
    eventId,
    eventName,
    title,
    description,
    date,
    location,
    status,
  } = args;

  const event =
    await findEvent({
      eventId,
      eventName,
    });

  if (title !== undefined) {
    event.title =
      title.trim();
  }

  if (description !== undefined) {
    event.description =
      description.trim();
  }

  if (date !== undefined) {
    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      throw new Error(
        "Invalid event date"
      );
    }

    event.date =
      parsedDate;
  }

  if (location !== undefined) {
    event.location =
      location.trim();
  }

  if (status !== undefined) {
    if (
      ![
        "planning",
        "ongoing",
        "completed",
        "cancelled",
      ].includes(status)
    ) {
      throw new Error(
        "Invalid event status"
      );
    }

    event.status =
      status;
  }

  await event.save();

  return event;
};

// =========================================
// CREATE TASKS FROM MEETING ACTION ITEMS
// =========================================

const createTasksFromActionItems = async (
  actionItems = [],
  eventId,
  context = {}
) => {
  requireRole(
    context,
    ADMIN_COORDINATOR_ROLES
  );

  const event = await Event.findById(
    eventId
  );

  if (!event) {
    throw new Error(
      "Event not found"
    );
  }

  const createdTasks = [];

  for (const item of actionItems) {
    if (!item || !item.description) {
      continue;
    }

    let assignedTo = null;

    // Resolve the owner identified by Meeting AI.
    if (item.owner) {
      const user = await User.findOne({
        name: {
          $regex: `^${item.owner.trim()}$`,
          $options: "i",
        },
      });

      if (!user) {
        console.warn(
          `User not found for owner: ${item.owner}`
        );
      } else {
        assignedTo = user._id;
      }
    }

    // Task requires a deadline because
    // the Task model requires dueDate.
    if (!item.deadline) {
      console.warn(
        `Skipping task "${item.description}" because deadline is missing`
      );
      continue;
    }

    const parsedDeadline =
      new Date(item.deadline);

    if (
      Number.isNaN(
        parsedDeadline.getTime()
      )
    ) {
      console.warn(
        `Skipping task "${item.description}" because deadline is invalid`
      );
      continue;
    }

    // Prevent duplicate tasks.
    const existingTask =
      await Task.findOne({
        title: item.description,
        event: eventId,
        dueDate: parsedDeadline,
      });

    if (existingTask) {
      console.log(
        `Task already exists: ${item.description}`
      );
      continue;
    }

    const task = await Task.create({
      title: item.description,
      description: item.description,
      event: eventId,
      assignedTo,
      priority: "medium",
      status: "todo",
      dueDate: parsedDeadline,
    });

    createdTasks.push(task);
  }

  return createdTasks;
};

// =========================================
// ACTION ROUTER
// =========================================

const executeAction = async (
  actionName,
  args = {},
  context = {}
) => {
  switch (actionName) {
    case "CREATE_TASK":
      return createTask(
        args,
        context
      );

    case "UPDATE_TASK":
      return updateTask(
        args,
        context
      );

    case "COMPLETE_TASK":
      return completeTask(
        args,
        context
      );

    case "ASSIGN_TASK":
      return assignTask(
        args,
        context
      );

    case "CREATE_ANNOUNCEMENT":
      return createAnnouncement(
        args,
        context
      );

    case "CREATE_MEETING":
      return createMeeting(
        args,
        context
      );

    case "UPDATE_EVENT":
      return updateEvent(
        args,
        context
      );

    case "CREATE_TASKS_FROM_ACTION_ITEMS":
      return createTasksFromActionItems(
        args.actionItems || args,
        args.eventId,
        context
      );

    default:
      throw new Error(
        `Unknown AI action: ${actionName}`
      );
  }
};

module.exports = {
  createTask,
  updateTask,
  completeTask,
  assignTask,
  createAnnouncement,
  createMeeting,
  updateEvent,
  createTasksFromActionItems,
  executeAction,
};