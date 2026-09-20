const Task = require("../../models/Task");

const getTasks = async ({
  eventId,
  status,
  assignedTo,
} = {}) => {

  const filter = {};

  if (eventId) {
    filter.event = eventId;
  }

  if (status) {
    filter.status = status;
  }

  if (assignedTo) {
    filter.assignedTo = assignedTo;
  }

  const tasks = await Task.find(filter)
    .populate(
      "assignedTo",
      "name email role"
    )
    .populate(
      "event",
      "title date"
    )
    .sort({
      dueDate: 1,
    });

  return tasks;
};

const getOverdueTasks = async () => {

  const now = new Date();

  const tasks = await Task.find({
    dueDate: {
      $lt: now,
    },

    status: {
      $ne: "completed",
    },
  })
    .populate(
      "assignedTo",
      "name email role"
    )
    .populate(
      "event",
      "title date"
    )
    .sort({
      dueDate: 1,
    });

  return tasks;
};

const getUpcomingDeadlines = async ({
  days = 7,
} = {}) => {

  const now = new Date();

  const endDate = new Date();

  endDate.setDate(
    endDate.getDate() +
    Number(days)
  );

  const tasks = await Task.find({
    dueDate: {
      $gte: now,
      $lte: endDate,
    },

    status: {
      $ne: "completed",
    },
  })
    .populate(
      "assignedTo",
      "name email role"
    )
    .populate(
      "event",
      "title date"
    )
    .sort({
      dueDate: 1,
    });

  return tasks;
};

module.exports = {
  getTasks,
  getOverdueTasks,
  getUpcomingDeadlines,
};