const {
  getTasks,
  getOverdueTasks,
  getUpcomingDeadlines,
} = require("./tools/taskTools");

const {
  getEvents,
  getUpcomingEvents,
} = require("./tools/eventTools");

const {
  getVolunteers,
  getAvailableVolunteers,
} = require("./tools/volunteerTools");

const {
  getMeetings,
  getUpcomingMeetings,
} = require("./tools/meetingTools");

const {
  getAnnouncements,
  getPublishedAnnouncements,
} = require("./tools/announcementTools");

const toolRegistry = {
  // =========================
  // TASK TOOLS
  // =========================

  get_tasks: {
    description:
      "Get tasks from ClubOps. Can optionally filter by event, status, or assigned user.",
    execute: getTasks,
  },

  get_overdue_tasks: {
    description:
      "Get all incomplete tasks whose due date has already passed.",
    execute: getOverdueTasks,
  },

  get_upcoming_deadlines: {
    description:
      "Get incomplete tasks whose deadlines are within the specified number of days.",
    execute: getUpcomingDeadlines,
  },

  // =========================
  // EVENT TOOLS
  // =========================

  get_events: {
    description:
      "Get ClubOps events. Can optionally filter by event status.",
    execute: getEvents,
  },

  get_upcoming_events: {
    description:
      "Get ClubOps events happening within the specified number of days.",
    execute: getUpcomingEvents,
  },

  // =========================
  // VOLUNTEER TOOLS
  // =========================

  get_volunteers: {
    description:
      "Get ClubOps volunteers. Can optionally filter by availability or active status.",
    execute: getVolunteers,
  },

  get_available_volunteers: {
    description:
      "Get active volunteers who are currently available.",
    execute: getAvailableVolunteers,
  },

  // =========================
  // MEETING TOOLS
  // =========================

  get_meetings: {
    description:
      "Get ClubOps meetings. Can optionally filter by meeting status.",
    execute: getMeetings,
  },

  get_upcoming_meetings: {
    description:
      "Get meetings scheduled within the specified number of days.",
    execute: getUpcomingMeetings,
  },

  // =========================
  // ANNOUNCEMENT TOOLS
  // =========================

  get_announcements: {
    description:
      "Get ClubOps announcements. Can optionally filter by announcement status.",
    execute: getAnnouncements,
  },

  get_published_announcements: {
    description:
      "Get published ClubOps announcements.",
    execute: getPublishedAnnouncements,
  },
};

module.exports = toolRegistry;