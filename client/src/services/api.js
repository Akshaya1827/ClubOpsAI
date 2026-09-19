const API_BASE_URL = "http://localhost:5000/api";

// ==================== AUTHENTICATION ====================

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("clubops_token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Authentication failed");
  }

  return data;
};

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

// ==================== VOLUNTEERS ====================

export const getVolunteers = async () => {
  const response = await fetch(`${API_BASE_URL}/volunteers`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch volunteers");
  }

  return data;
};

export const createVolunteer = async (volunteerData) => {
  const response = await fetch(`${API_BASE_URL}/volunteers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(volunteerData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create volunteer");
  }

  return data;
};

export const updateVolunteer = async (volunteerId, volunteerData) => {
  const response = await fetch(
    `${API_BASE_URL}/volunteers/${volunteerId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(volunteerData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update volunteer");
  }

  return data;
};

export const deleteVolunteer = async (volunteerId) => {
  const response = await fetch(
    `${API_BASE_URL}/volunteers/${volunteerId}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete volunteer");
  }

  return data;
};

// ==================== DOCUMENTS ====================

export const getDocuments = async () => {
  const response = await fetch(`${API_BASE_URL}/documents`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch documents");
  }

  return data;
};

export const createDocument = async (documentData) => {
  const formData = new FormData();

  formData.append("name", documentData.name);
  formData.append("description", documentData.description || "");

  if (documentData.eventId) {
    formData.append("eventId", documentData.eventId);
  }

  if (documentData.uploadedBy) {
    formData.append("uploadedBy", documentData.uploadedBy);
  }

  if (documentData.file) {
    formData.append("file", documentData.file);
  }

  const response = await fetch(`${API_BASE_URL}/documents`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload document");
  }

  return data;
};

export const updateDocument = async (documentId, documentData) => {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(documentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update document");
  }

  return data;
};

export const deleteDocument = async (documentId) => {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete document");
  }

  return data;
};

// ==================== MEETINGS ====================

export const getMeetings = async () => {
  const response = await fetch(`${API_BASE_URL}/meetings`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch meetings");
  }

  return data;
};

export const createMeeting = async (meetingData) => {
  const response = await fetch(`${API_BASE_URL}/meetings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(meetingData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create meeting");
  }

  return data;
};

export const updateMeeting = async (meetingId, meetingData) => {
  const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(meetingData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update meeting");
  }

  return data;
};

export const deleteMeeting = async (meetingId) => {
  const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete meeting");
  }

  return data;
};

// ==================== ANNOUNCEMENTS ====================

export const getAnnouncements = async () => {
  const response = await fetch(`${API_BASE_URL}/announcements`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch announcements");
  }

  return data;
};

export const createAnnouncement = async (announcementData) => {
  const response = await fetch(`${API_BASE_URL}/announcements`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(announcementData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create announcement");
  }

  return data;
};

export const updateAnnouncement = async (
  announcementId,
  announcementData
) => {
  const response = await fetch(
    `${API_BASE_URL}/announcements/${announcementId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(announcementData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update announcement");
  }

  return data;
};

export const deleteAnnouncement = async (announcementId) => {
  const response = await fetch(
    `${API_BASE_URL}/announcements/${announcementId}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete announcement");
  }

  return data;
};

export const publishAnnouncement = async (announcementId) => {
  const response = await fetch(
    `${API_BASE_URL}/announcements/${announcementId}/publish`,
    {
      method: "PATCH",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to publish announcement");
  }

  return data;
};

export const unpublishAnnouncement = async (announcementId) => {
  const response = await fetch(
    `${API_BASE_URL}/announcements/${announcementId}/unpublish`,
    {
      method: "PATCH",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to unpublish announcement");
  }

  return data;
};