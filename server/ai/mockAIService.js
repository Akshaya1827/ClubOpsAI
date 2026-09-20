const normalizeText = (value = "") => {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
};

const formatHelp = () => {
  return (
    "I can help manage ClubOps tasks, events, volunteers, meetings, announcements, and deadlines. " +
    "Try asking me to show upcoming events, available volunteers, scheduled meetings, or recent announcements."
  );
};

const parseCreateTask = (prompt) => {
  const normalizedPrompt = normalizeText(prompt);

  const isCreateTask =
  /\bcreate\s+(?:a\s+)?(?:(?:low|medium|high)\s+priority\s+)?task\b/i.test(
    normalizedPrompt
  ) ||
  /\badd\s+(?:a\s+)?(?:(?:low|medium|high)\s+priority\s+)?task\b/i.test(
    normalizedPrompt
  );
  if (!isCreateTask) {
    return null;
  }

  // -----------------------------------------
  // Priority
  // -----------------------------------------

  const priorityMatch = normalizedPrompt.match(
    /\b(low|medium|high)\s+priority\b/i
  );

  const priority = priorityMatch
    ? priorityMatch[1].toLowerCase()
    : "medium";

  // -----------------------------------------
  // Due date
  // Supports:
  // "by 2026-12-20"
  // "due 2026-12-20"
  // -----------------------------------------

  const dueDateMatch = normalizedPrompt.match(
    /\b(?:by|due)\s+(\d{4}-\d{2}-\d{2})\b/i
  );

  const dueDate = dueDateMatch
    ? dueDateMatch[1]
    : null;

  // -----------------------------------------
  // Event
  // Example:
  // "for College Fest by 2026-12-20"
  // -----------------------------------------

  const eventMatch = prompt.match(
    /\bfor\s+(.+?)(?:\s+(?:by|due)\s+\d{4}-\d{2}-\d{2}\b|$)/i
  );

  const eventName = eventMatch
    ? eventMatch[1].trim()
    : null;

  // -----------------------------------------
  // Extract task title
  // -----------------------------------------

  let title = prompt.trim();

  title = title.replace(
    /^create\s+(?:a\s+)?(?:low|medium|high)\s+priority\s+task\s*/i,
    ""
  );

  title = title.replace(
    /^create\s+(?:a\s+)?task\s*/i,
    ""
  );

  title = title.replace(
    /^add\s+(?:a\s+)?(?:low|medium|high)\s+priority\s+task\s*/i,
    ""
  );

  title = title.replace(
    /^add\s+(?:a\s+)?task\s*/i,
    ""
  );

  title = title.replace(
    /^to\s+/i,
    ""
  );

  // Remove event portion.
  if (eventName) {
    title = title.replace(
      new RegExp(
        `\\s+for\\s+${escapeRegExp(eventName)}(?=\\s+(?:by|due)\\s+\\d{4}-\\d{2}-\\d{2}\\b|$)`,
        "i"
      ),
      ""
    );
  }

  // Remove due date.
  title = title.replace(
    /\s+(?:by|due)\s+\d{4}-\d{2}-\d{2}\b/i,
    ""
  );

  // Remove priority if it remained.
  title = title.replace(
    /\b(low|medium|high)\s+priority\b/i,
    ""
  );

  title = title
    .replace(/\s+/g, " ")
    .trim();

  if (!title) {
    title = "New ClubOps Task";
  }

  return {
    type: "action_call",
    action: {
      name: "CREATE_TASK",
      args: {
        title,
        description: "",
        eventName,
        priority,
        dueDate,
      },
    },
  };
};

const escapeRegExp = (value = "") => {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

// ======================================================
// MOCK AI RESPONSE
// ======================================================

const generateMockResponse = (prompt = "") => {
  const normalizedPrompt = normalizeText(prompt);

  // ====================================================
  // CREATE TASK
  // IMPORTANT:
  // This MUST come before read-only task checks.
  // ====================================================

  const createTaskResult = parseCreateTask(prompt);

  if (createTaskResult) {
    return createTaskResult;
  }

  // ====================================================
  // COMPLETE TASK
  //
  // Structured form:
  // complete task | TASK_ID
  // ====================================================

  if (
    normalizedPrompt.startsWith("complete task |")
  ) {
    const taskId = prompt
      .split("|")
      .slice(1)
      .join("|")
      .trim();

    return {
      type: "action",
      action: {
        name: "COMPLETE_TASK",
        args: {
          taskId,
        },
      },
    };
  }

  // ====================================================
  // ASSIGN TASK
  //
  // Structured form:
  // assign task | TASK_ID | USER_NAME
  // ====================================================

  if (
    normalizedPrompt.startsWith("assign task |")
  ) {
    const parts = prompt
      .split("|")
      .map((part) => part.trim());

    return {
      type: "action",
      action: {
        name: "ASSIGN_TASK",
        args: {
          taskId: parts[1],
          assignedToName: parts[2],
        },
      },
    };
  }

  // ====================================================
  // UPDATE TASK
  //
  // Structured form:
  // update task | TASK_ID | FIELD | VALUE
  // ====================================================

  if (
    normalizedPrompt.startsWith("update task |")
  ) {
    const parts = prompt
      .split("|")
      .map((part) => part.trim());

    const taskId = parts[1];
    const field = parts[2];
    const value = parts.slice(3).join("|").trim();

    const args = {
      taskId,
    };

    if (field === "title") {
      args.title = value;
    }

    if (field === "description") {
      args.description = value;
    }

    if (field === "priority") {
      args.priority = value.toLowerCase();
    }

    if (field === "status") {
      args.status = value.toLowerCase();
    }

    if (field === "dueDate") {
      args.dueDate = value;
    }

    return {
      type: "action",
      action: {
        name: "UPDATE_TASK",
        args,
      },
    };
  }

  // ====================================================
  // CREATE ANNOUNCEMENT
  //
  // create announcement | TITLE | CONTENT | EVENT_NAME
  // ====================================================

  if (
    normalizedPrompt.startsWith(
      "create announcement |"
    )
  ) {
    const parts = prompt
      .split("|")
      .map((part) => part.trim());

    return {
      type: "action",
      action: {
        name: "CREATE_ANNOUNCEMENT",
        args: {
          title: parts[1],
          content: parts[2],
          eventName: parts[3] || null,
        },
      },
    };
  }

  // ====================================================
  // CREATE MEETING
  //
  // create meeting | TITLE | DATE | EVENT_NAME | LOCATION
  // ====================================================

  if (
    normalizedPrompt.startsWith(
      "create meeting |"
    )
  ) {
    const parts = prompt
      .split("|")
      .map((part) => part.trim());

    return {
      type: "action",
      action: {
        name: "CREATE_MEETING",
        args: {
          title: parts[1],
          date: parts[2],
          eventName: parts[3] || null,
          location: parts[4] || "",
        },
      },
    };
  }

  // ====================================================
  // UPDATE EVENT
  //
  // update event | EVENT_NAME | FIELD | VALUE
  // ====================================================

  if (
    normalizedPrompt.startsWith(
      "update event |"
    )
  ) {
    const parts = prompt
      .split("|")
      .map((part) => part.trim());

    const eventName = parts[1];
    const field = parts[2];
    const value = parts.slice(3).join("|").trim();

    const args = {
      eventName,
    };

    if (field === "title") {
      args.title = value;
    }

    if (field === "description") {
      args.description = value;
    }

    if (field === "date") {
      args.date = value;
    }

    if (field === "location") {
      args.location = value;
    }

    if (field === "status") {
      args.status = value.toLowerCase();
    }

    return {
      type: "action",
      action: {
        name: "UPDATE_EVENT",
        args,
      },
    };
  }

  // ====================================================
  // OVERDUE TASKS
  // ====================================================

  if (
    normalizedPrompt.includes("overdue tasks") ||
    normalizedPrompt.includes("overdue task") ||
    normalizedPrompt.includes("late tasks") ||
    normalizedPrompt.includes("late task") ||
    normalizedPrompt.includes("past deadline") ||
    normalizedPrompt.includes("past deadlines")
  ) {
    return {
      type: "tool_call",
      tool: {
        name: "get_overdue_tasks",
        args: {},
      },
    };
  }

  // ====================================================
  // MY TASKS
  // ====================================================

  if (
    normalizedPrompt.includes("my tasks") ||
    normalizedPrompt.includes("tasks assigned to me") ||
    normalizedPrompt.includes("my task list")
  ) {
    return {
      type: "tool_call",
      tool: {
        name: "get_tasks",
        args: {},
      },
    };
  }

  // ====================================================
  // UPCOMING DEADLINES
  // ====================================================

  if (
    normalizedPrompt.includes(
      "upcoming deadlines"
    ) ||
    normalizedPrompt.includes(
      "upcoming deadline"
    ) ||
    normalizedPrompt.includes(
      "deadlines coming up"
    ) ||
    normalizedPrompt.includes(
      "tasks due soon"
    ) ||
    normalizedPrompt.includes(
      "tasks due this week"
    )
  ) {
    return {
      type: "tool_call",
      tool: {
        name: "get_upcoming_deadlines",
        args: {
          days: 7,
        },
      },
    };
  }

  // ====================================================
  // ALL TASKS
  // ====================================================

  if (
    normalizedPrompt.includes("show all tasks") ||
    normalizedPrompt.includes("list all tasks") ||
    normalizedPrompt.includes("show tasks") ||
    normalizedPrompt === "tasks"
  ) {
    return {
      type: "tool_call",
      tool: {
        name: "get_tasks",
        args: {},
      },
    };
  }

  // ====================================================
  // UPCOMING EVENTS
  // ====================================================

  if (
    normalizedPrompt.includes("upcoming events") ||
    normalizedPrompt.includes("upcoming event") ||
    normalizedPrompt.includes("events coming up") ||
    normalizedPrompt.includes("what events are coming") ||
    normalizedPrompt.includes("what events are next") ||
    normalizedPrompt.includes("next events") ||
    normalizedPrompt.includes("future events") ||
    normalizedPrompt.includes("events happening soon")
  ) {
    return {
      type: "tool_call",
      tool: {
        name: "get_upcoming_events",
        args: {
          days: 30,
        },
      },
    };
  }

  // ====================================================
  // ALL EVENTS
  // ====================================================

  if (
    normalizedPrompt.includes("show events") ||
    normalizedPrompt.includes("list events") ||
    normalizedPrompt.includes("show all events") ||
    normalizedPrompt === "events"
  ) {
    return {
      type: "tool_call",
      tool: {
        name: "get_events",
        args: {},
      },
    };
  }

  // ====================================================
  // AVAILABLE VOLUNTEERS
  // ====================================================

  if (
    normalizedPrompt.includes(
      "available volunteers"
    ) ||
    normalizedPrompt.includes(
      "available volunteer"
    ) ||
    normalizedPrompt.includes(
      "who is available"
    ) ||
    normalizedPrompt.includes(
      "who can help"
    ) ||
    normalizedPrompt.includes(
      "who is free"
    ) ||
    normalizedPrompt.includes(
      "free volunteers"
    ) ||
    normalizedPrompt.includes(
      "volunteers available"
    )
  ) {
    return {
      type: "tool_call",
      tool: {
        name: "get_available_volunteers",
        args: {},
      },
    };
  }

  // ====================================================
  // ALL VOLUNTEERS
  // ====================================================

  if (
    normalizedPrompt.includes("show volunteers") ||
    normalizedPrompt.includes("list volunteers") ||
    normalizedPrompt.includes(
      "show all volunteers"
    ) ||
    normalizedPrompt === "volunteers"
  ) {
    return {
      type: "tool_call",
      tool: {
        name: "get_volunteers",
        args: {},
      },
    };
  }

  // ====================================================
  // UPCOMING MEETINGS
  // ====================================================

  if (
    normalizedPrompt.includes("upcoming meetings") ||
    normalizedPrompt.includes("upcoming meeting") ||
    normalizedPrompt.includes("scheduled meetings") ||
    normalizedPrompt.includes("next meetings") ||
    normalizedPrompt.includes("meetings coming up")
  ) {
    return {
      type: "tool_call",
      tool: {
        name: "get_upcoming_meetings",
        args: {
          days: 30,
        },
      },
    };
  }

  // ====================================================
  // ALL MEETINGS
  // ====================================================

  if (
    normalizedPrompt.includes("show meetings") ||
    normalizedPrompt.includes("list meetings") ||
    normalizedPrompt.includes(
      "show all meetings"
    ) ||
    normalizedPrompt === "meetings"
  ) {
    return {
      type: "tool_call",
      tool: {
        name: "get_meetings",
        args: {},
      },
    };
  }

  // ====================================================
  // PUBLISHED ANNOUNCEMENTS
  // ====================================================

  if (
    normalizedPrompt.includes(
      "published announcements"
    ) ||
    normalizedPrompt.includes(
      "published announcement"
    ) ||
    normalizedPrompt.includes(
      "public announcements"
    )
  ) {
    return {
      type: "tool_call",
      tool: {
        name: "get_published_announcements",
        args: {},
      },
    };
  }

  // ====================================================
  // ALL / RECENT ANNOUNCEMENTS
  // ====================================================

  if (
    normalizedPrompt.includes(
      "recent announcements"
    ) ||
    normalizedPrompt.includes(
      "recent announcement"
    ) ||
    normalizedPrompt.includes(
      "show announcements"
    ) ||
    normalizedPrompt.includes(
      "list announcements"
    ) ||
    normalizedPrompt.includes(
      "show all announcements"
    ) ||
    normalizedPrompt === "announcements"
  ) {
    return {
      type: "tool_call",
      tool: {
        name: "get_announcements",
        args: {},
      },
    };
  }

  // ====================================================
  // GREETINGS
  // ====================================================

  if (
    normalizedPrompt === "hello" ||
    normalizedPrompt === "hi" ||
    normalizedPrompt === "hey" ||
    normalizedPrompt.includes(
      "hello clubops"
    ) ||
    normalizedPrompt.includes(
      "hi clubops"
    ) ||
    normalizedPrompt.includes(
      "hey clubops"
    )
  ) {
    return {
      type: "text",
      reply:
        "Hello! 👋 I'm ClubOps AI. I can help with tasks, events, volunteers, meetings, announcements, and deadlines.",
    };
  }

  // ====================================================
  // HELP
  // ====================================================

  if (
    normalizedPrompt === "help" ||
    normalizedPrompt.includes(
      "what can you do"
    ) ||
    normalizedPrompt.includes(
      "how can you help"
    )
  ) {
    return {
      type: "text",
      reply: formatHelp(),
    };
  }

  // ====================================================
  // FALLBACK
  // ====================================================

  return {
    type: "text",
    reply: formatHelp(),
  };
};

module.exports = {
  generateMockResponse,
};