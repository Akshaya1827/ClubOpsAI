const { Type } = require("@google/genai");

const taskToolDefinitions = [
  {
    name: "get_tasks",

    description:
      "Retrieve ClubOps tasks. Use this when the user asks about their tasks, task lists, task status, or tasks assigned to a particular user.",

    parameters: {
      type: Type.OBJECT,

      properties: {
        eventId: {
          type: Type.STRING,
          description:
            "MongoDB ObjectId of the event. Only provide this when the user identifies a specific event.",
        },

        status: {
          type: Type.STRING,
          description:
            "Filter tasks by status. Allowed values: todo, in-progress, completed.",
        },

        assignedTo: {
          type: Type.STRING,
          description:
            "MongoDB ObjectId of the user assigned to the task.",
        },
      },
    },
  },

  {
    name: "get_overdue_tasks",

    description:
      "Retrieve incomplete ClubOps tasks whose due dates have already passed. Use this when the user asks which tasks are overdue, late, or past their deadline.",

    parameters: {
      type: Type.OBJECT,

      properties: {},
    },
  },

  {
    name: "get_upcoming_deadlines",

    description:
      "Retrieve incomplete ClubOps tasks with deadlines within a specified number of days. Use this when the user asks about upcoming deadlines or tasks due soon.",

    parameters: {
      type: Type.OBJECT,

      properties: {
        days: {
          type: Type.NUMBER,

          description:
            "Number of days from now to search. Use 7 for the next week unless the user specifies another period.",
        },
      },
    },
  },
];

module.exports = {
  taskToolDefinitions,
};