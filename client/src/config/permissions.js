export const ROLES = {
  ADMIN: "admin",
  COORDINATOR: "coordinator",
  VOLUNTEER: "volunteer",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.COORDINATOR]: "Coordinator",
  [ROLES.VOLUNTEER]: "Volunteer",
};

/*
 * Page access
 *
 * Controls which sections each role can open.
 */
export const PAGE_PERMISSIONS = {
  dashboard: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
    ROLES.VOLUNTEER,
  ],

  events: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
    ROLES.VOLUNTEER,
  ],

  tasks: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
    ROLES.VOLUNTEER,
  ],

  deadlines: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
    ROLES.VOLUNTEER,
  ],

  volunteers: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
  ],

  documents: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
    ROLES.VOLUNTEER,
  ],

  meetings: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
    ROLES.VOLUNTEER,
  ],

  announcements: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
    ROLES.VOLUNTEER,
  ],
};

/*
 * Action permissions
 *
 * Controls which actions/buttons each role can use.
 */
export const ACTION_PERMISSIONS = {
  createEvent: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
  ],

  editEvent: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
  ],

  deleteEvent: [
    ROLES.ADMIN,
  ],

  createTask: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
  ],

  editTask: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
  ],

  deleteTask: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
  ],

  createDeadline: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
  ],

  editDeadline: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
  ],

  deleteDeadline: [
    ROLES.ADMIN,
  ],

  manageVolunteers: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
  ],

  deleteVolunteer: [
    ROLES.ADMIN,
  ],

  uploadDocument: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
  ],

  editDocument: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
  ],

  deleteDocument: [
    ROLES.ADMIN,
  ],

  createMeeting: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
  ],

  editMeeting: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
  ],

  deleteMeeting: [
    ROLES.ADMIN,
  ],

  createAnnouncement: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
  ],

  editAnnouncement: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
  ],

  deleteAnnouncement: [
    ROLES.ADMIN,
  ],

  publishAnnouncement: [
    ROLES.ADMIN,
    ROLES.COORDINATOR,
  ],
};

export const canAccessPage = (role, page) => {
  return PAGE_PERMISSIONS[page]?.includes(role) ?? false;
};

export const canPerformAction = (role, action) => {
  return ACTION_PERMISSIONS[action]?.includes(role) ?? false;
};

export const getRoleLabel = (role) => {
  return ROLE_LABELS[role] || role;
};