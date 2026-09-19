const {
  getTasks,
  getOverdueTasks,
  getUpcomingDeadlines,
} = require("./tools/taskTools");

const toolRegistry = {
  get_tasks: {
    description: "Get tasks from ClubOps. Can optionally filter by event, status, or assigned user.",
    execute: getTasks,
  },

  get_overdue_tasks: {
    description: "Get all incomplete tasks whose due date has already passed.",
    execute: getOverdueTasks,
  },

  get_upcoming_deadlines: {
    description: "Get incomplete tasks whose deadlines are within the specified number of days.",
    execute: getUpcomingDeadlines,
  },
};

module.exports = toolRegistry;