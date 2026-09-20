// --------------------------------------------------
// MOCK AI - FINAL RESPONSE STAGE
// --------------------------------------------------
//
// Gemini normally receives the result of the tool
// and generates a final natural-language answer.
//
// This service simulates that second model stage.
//
// The Mock therefore follows the same overall
// contract as Gemini:
//
// User
//   ↓
// Tool decision
//   ↓
// Tool execution
//   ↓
// Tool result
//   ↓
// Final response
// --------------------------------------------------

const formatDate = (date) => {
  if (!date) {
    return "No due date";
  }

  return new Date(date).toLocaleDateString();
};

// --------------------------------------------------
// Generate final response
// --------------------------------------------------

const generateMockFinalResponse = async (
  prompt,
  toolName,
  toolResult
) => {

  // --------------------------------------------------
  // OVERDUE TASKS
  // --------------------------------------------------

  if (toolName === "get_overdue_tasks") {

    if (!Array.isArray(toolResult)) {
      return {
        type: "text",
        reply:
          "I couldn't read the overdue task results.",
      };
    }

    if (toolResult.length === 0) {
      return {
        type: "text",
        reply:
          "Good news — there are no overdue tasks right now.",
      };
    }

    const taskLines = toolResult.map(
      (task, index) => {

        const assignedTo =
          task.assignedTo?.name ||
          "Unassigned";

        const eventTitle =
          task.event?.title ||
          "No event";

        return (
          `${index + 1}. ${task.title}` +
          ` — assigned to ${assignedTo}` +
          ` — due ${formatDate(task.dueDate)}` +
          ` — event: ${eventTitle}`
        );
      }
    );

    return {
      type: "text",

      reply:
        `You have ${toolResult.length} overdue task` +
        `${toolResult.length === 1 ? "" : "s"}:\n\n` +
        taskLines.join("\n"),
    };
  }

  // --------------------------------------------------
  // UPCOMING DEADLINES
  // --------------------------------------------------

  if (toolName === "get_upcoming_deadlines") {

    if (!Array.isArray(toolResult)) {
      return {
        type: "text",
        reply:
          "I couldn't read the upcoming deadline results.",
      };
    }

    if (toolResult.length === 0) {
      return {
        type: "text",
        reply:
          "There are no upcoming task deadlines in the requested period.",
      };
    }

    const taskLines = toolResult.map(
      (task, index) => {

        const assignedTo =
          task.assignedTo?.name ||
          "Unassigned";

        return (
          `${index + 1}. ${task.title}` +
          ` — assigned to ${assignedTo}` +
          ` — due ${formatDate(task.dueDate)}`
        );
      }
    );

    return {
      type: "text",

      reply:
        `I found ${toolResult.length} upcoming task deadline` +
        `${toolResult.length === 1 ? "" : "s"}:\n\n` +
        taskLines.join("\n"),
    };
  }

  // --------------------------------------------------
  // MY TASKS
  // --------------------------------------------------

  if (toolName === "get_tasks") {

    if (!Array.isArray(toolResult)) {
      return {
        type: "text",
        reply:
          "I couldn't read your task results.",
      };
    }

    if (toolResult.length === 0) {
      return {
        type: "text",
        reply:
          "You currently have no tasks assigned to you.",
      };
    }

    const taskLines = toolResult.map(
      (task, index) => {

        const eventTitle =
          task.event?.title ||
          "No event";

        return (
          `${index + 1}. ${task.title}` +
          ` — status: ${task.status}` +
          ` — priority: ${task.priority}` +
          ` — due: ${formatDate(task.dueDate)}` +
          ` — event: ${eventTitle}`
        );
      }
    );

    return {
      type: "text",

      reply:
        `You currently have ${toolResult.length} task` +
        `${toolResult.length === 1 ? "" : "s"}:\n\n` +
        taskLines.join("\n"),
    };
  }

  // --------------------------------------------------
  // EVENTS
  // --------------------------------------------------

  if (toolName === "get_events") {

    if (!Array.isArray(toolResult)) {
      return {
        type: "text",
        reply:
          "I couldn't read the event results.",
      };
    }

    if (toolResult.length === 0) {
      return {
        type: "text",
        reply:
          "There are no events to show.",
      };
    }

    const eventLines = toolResult.map(
      (event, index) => {

        return (
          `${index + 1}. ${event.title}` +
          ` — ${formatDate(event.date)}` +
          ` — status: ${event.status}`
        );
      }
    );

    return {
      type: "text",

      reply:
        `I found ${toolResult.length} event` +
        `${toolResult.length === 1 ? "" : "s"}:\n\n` +
        eventLines.join("\n"),
    };
  }

  // --------------------------------------------------
  // UPCOMING EVENTS
  // --------------------------------------------------

  if (toolName === "get_upcoming_events") {

    if (!Array.isArray(toolResult)) {
      return {
        type: "text",
        reply:
          "I couldn't read the upcoming events.",
      };
    }

    if (toolResult.length === 0) {
      return {
        type: "text",
        reply:
          "There are no upcoming events in the requested period.",
      };
    }

    const eventLines = toolResult.map(
      (event, index) => {

        return (
          `${index + 1}. ${event.title}` +
          ` — ${formatDate(event.date)}` +
          ` — status: ${event.status}`
        );
      }
    );

    return {
      type: "text",

      reply:
        `I found ${toolResult.length} upcoming event` +
        `${toolResult.length === 1 ? "" : "s"}:\n\n` +
        eventLines.join("\n"),
    };
  }

  // --------------------------------------------------
  // VOLUNTEERS
  // --------------------------------------------------

  if (
    toolName === "get_volunteers" ||
    toolName === "get_available_volunteers"
  ) {

    if (!Array.isArray(toolResult)) {
      return {
        type: "text",
        reply:
          "I couldn't read the volunteer results.",
      };
    }

    if (toolResult.length === 0) {
      return {
        type: "text",
        reply:
          "There are no matching volunteers.",
      };
    }

    const volunteerLines =
      toolResult.map(
        (volunteer, index) => {

          const skills =
            volunteer.skills?.length
              ? volunteer.skills.join(", ")
              : "No skills listed";

          return (
            `${index + 1}. ${volunteer.name}` +
            ` — ${volunteer.availability}` +
            ` — ${volunteer.status}` +
            ` — skills: ${skills}`
          );
        }
      );

    return {
      type: "text",

      reply:
        `I found ${toolResult.length} volunteer` +
        `${toolResult.length === 1 ? "" : "s"}:\n\n` +
        volunteerLines.join("\n"),
    };
  }

  // --------------------------------------------------
  // MEETINGS
  // --------------------------------------------------

  if (
    toolName === "get_meetings" ||
    toolName === "get_upcoming_meetings"
  ) {

    if (!Array.isArray(toolResult)) {
      return {
        type: "text",
        reply:
          "I couldn't read the meeting results.",
      };
    }

    if (toolResult.length === 0) {
      return {
        type: "text",
        reply:
          "There are no matching meetings.",
      };
    }

    const meetingLines =
      toolResult.map(
        (meeting, index) => {

          const eventTitle =
            meeting.eventId?.title ||
            "No event";

          return (
            `${index + 1}. ${meeting.title}` +
            ` — ${formatDate(meeting.date)}` +
            ` — ${meeting.status}` +
            ` — event: ${eventTitle}`
          );
        }
      );

    return {
      type: "text",

      reply:
        `I found ${toolResult.length} meeting` +
        `${toolResult.length === 1 ? "" : "s"}:\n\n` +
        meetingLines.join("\n"),
    };
  }

  // --------------------------------------------------
  // ANNOUNCEMENTS
  // --------------------------------------------------

  if (
    toolName === "get_announcements" ||
    toolName === "get_published_announcements"
  ) {

    if (!Array.isArray(toolResult)) {
      return {
        type: "text",
        reply:
          "I couldn't read the announcement results.",
      };
    }

    if (toolResult.length === 0) {
      return {
        type: "text",
        reply:
          "There are no matching announcements.",
      };
    }

    const announcementLines =
      toolResult.map(
        (announcement, index) => {

          const eventTitle =
            announcement.eventId?.title ||
            "No event";

          return (
            `${index + 1}. ${announcement.title}` +
            ` — ${announcement.status}` +
            ` — event: ${eventTitle}`
          );
        }
      );

    return {
      type: "text",

      reply:
        `I found ${toolResult.length} announcement` +
        `${toolResult.length === 1 ? "" : "s"}:\n\n` +
        announcementLines.join("\n"),
    };
  }

  // --------------------------------------------------
  // UNKNOWN TOOL
  // --------------------------------------------------

  return {
    type: "text",

    reply:
      "The operation completed, but I don't have a response formatter for that tool yet.",
  };
};

module.exports = {
  generateMockFinalResponse,
};