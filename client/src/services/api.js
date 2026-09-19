const API_BASE_URL = "http://localhost:5000/api";

// ==================== EVENTS ====================

export const getEvents = async () => {
  const response = await fetch(`${API_BASE_URL}/events`);

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return response.json();
};

export const createEvent = async (eventData) => {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error("Failed to create event");
  }

  return response.json();
};

export const updateEvent = async (eventId, eventData) => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error("Failed to update event");
  }

  return response.json();
};

export const deleteEvent = async (eventId) => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete event");
  }

  return response.json();
};

// ==================== TASKS ====================

export const getTasks = async () => {
  const response = await fetch(`${API_BASE_URL}/tasks`);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
};

export const createTask = async (taskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return response.json();
};

export const updateTask = async (taskId, taskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error("Failed to update task");
  }

  return response.json();
};

export const deleteTask = async (taskId) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }

  return response.json();
};

// ==================== DEADLINES ====================

export const getUpcomingDeadlines = async () => {
  const response = await fetch(`${API_BASE_URL}/tasks/deadlines/upcoming`);

  if (!response.ok) {
    throw new Error("Failed to fetch upcoming deadlines");
  }

  return response.json();
};

export const getOverdueDeadlines = async () => {
  const response = await fetch(`${API_BASE_URL}/tasks/deadlines/overdue`);

  if (!response.ok) {
    throw new Error("Failed to fetch overdue deadlines");
  }

  return response.json();
};

export const getTodayDeadlines = async () => {
  const response = await fetch(`${API_BASE_URL}/tasks/deadlines/today`);

  if (!response.ok) {
    throw new Error("Failed to fetch today's deadlines");
  }

  return response.json();
};