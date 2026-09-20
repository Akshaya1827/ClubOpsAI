import { useEffect, useState } from "react";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
  unpublishAnnouncement,
  getEvents,
} from "../services/api";
import { canPerformAction } from "../config/permissions";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    content: "",
    eventId: "",
    createdBy: "",
  });

  const [editingId, setEditingId] = useState(null);

  // Get logged-in user's role
  const savedUser = localStorage.getItem("clubops_user");

  let user = null;

  try {
    user = savedUser ? JSON.parse(savedUser) : null;
  } catch {
    user = null;
  }

  const userRole = user?.role;

  // Role permissions
  const canCreateAnnouncement = canPerformAction(
    userRole,
    "createAnnouncement"
  );

  const canEditAnnouncement = canPerformAction(
    userRole,
    "editAnnouncement"
  );

  const canDeleteAnnouncement = canPerformAction(
    userRole,
    "deleteAnnouncement"
  );

  const canPublishAnnouncement = canPerformAction(
    userRole,
    "publishAnnouncement"
  );

  const canManageAnnouncements =
    canCreateAnnouncement || canEditAnnouncement;

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAnnouncements();

      setAnnouncements(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      const data = await getEvents();

      setEvents(data.events || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadAnnouncements();
    loadEvents();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      eventId: "",
      createdBy: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (editingId && !canEditAnnouncement) {
      setError(
        "You do not have permission to edit announcements."
      );
      return;
    }

    if (!editingId && !canCreateAnnouncement) {
      setError(
        "You do not have permission to create announcements."
      );
      return;
    }

    try {
      setError("");
      setSuccess("");

      const announcementData = {
        title: form.title,
        content: form.content,
        eventId: form.eventId || undefined,
        createdBy: form.createdBy,
      };

      if (editingId) {
        await updateAnnouncement(
          editingId,
          announcementData
        );

        setSuccess(
          "Announcement updated successfully."
        );
      } else {
        await createAnnouncement(
          announcementData
        );

        setSuccess(
          "Announcement created successfully."
        );
      }

      resetForm();
      await loadAnnouncements();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (announcement) => {
    if (!canEditAnnouncement) {
      setError(
        "You do not have permission to edit announcements."
      );
      return;
    }

    setEditingId(announcement._id);

    setForm({
      title: announcement.title || "",
      content: announcement.content || "",
      eventId:
        announcement.eventId?._id ||
        announcement.eventId ||
        "",
      createdBy: announcement.createdBy || "",
    });

    setSuccess("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (announcementId) => {
    if (!canDeleteAnnouncement) {
      setError(
        "You do not have permission to delete announcements."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteAnnouncement(
        announcementId
      );

      setSuccess(
        "Announcement deleted successfully."
      );

      await loadAnnouncements();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePublish = async (announcementId) => {
    if (!canPublishAnnouncement) {
      setError(
        "You do not have permission to publish announcements."
      );
      return;
    }

    try {
      setError("");
      setSuccess("");

      await publishAnnouncement(
        announcementId
      );

      setSuccess(
        "Announcement published successfully."
      );

      await loadAnnouncements();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUnpublish = async (announcementId) => {
    if (!canPublishAnnouncement) {
      setError(
        "You do not have permission to unpublish announcements."
      );
      return;
    }

    try {
      setError("");
      setSuccess("");

      await unpublishAnnouncement(
        announcementId
      );

      setSuccess(
        "Announcement unpublished successfully."
      );

      await loadAnnouncements();
    } catch (err) {
      setError(err.message);
    }
  };

  const getEventName = (eventId) => {
    if (!eventId) {
      return "No event linked";
    }

    const event = events.find(
      (item) =>
        item._id ===
        (eventId?._id || eventId)
    );

    return event
      ? event.title
      : "Event not found";
  };

  return (
    <div className="events-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">ClubOps AI</p>

          <h1>Announcements</h1>

          <p>
            Create, manage, and publish club
            announcements.
          </p>
        </div>
      </header>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {/* Create / Edit form */}
      {canManageAnnouncements && (
        <section className="event-form-section">
          <h2>
            {editingId
              ? "Edit Announcement"
              : "Create Announcement"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">
                Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter announcement title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">
                Content
              </label>

              <textarea
                id="content"
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Write your announcement..."
                rows="6"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="eventId">
                  Event
                </label>

                <select
                  id="eventId"
                  name="eventId"
                  value={form.eventId}
                  onChange={handleChange}
                >
                  <option value="">
                    No event
                  </option>

                  {events.map((event) => (
                    <option
                      key={event._id}
                      value={event._id}
                    >
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="createdBy">
                  Created By
                </label>

                <input
                  id="createdBy"
                  name="createdBy"
                  type="text"
                  value={form.createdBy}
                  onChange={handleChange}
                  placeholder="Enter creator name"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit">
                {editingId
                  ? "Update Announcement"
                  : "Create Announcement"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>
      )}

      {!canManageAnnouncements && (
        <div className="empty-state">
          You can view announcements, but you do not
          have permission to create or edit them.
        </div>
      )}

      <section className="events-section">
        <div className="section-heading">
          <h2>All Announcements</h2>

          <button
            type="button"
            onClick={loadAnnouncements}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p>No announcements found.</p>
        ) : (
          <div className="events-list">
            {announcements.map((announcement) => (
              <article
                className="event-card"
                key={announcement._id}
              >
                <div className="event-card-content">
                  <div>
                    <h3>{announcement.title}</h3>

                    <p>
                      {announcement.content}
                    </p>
                  </div>

                  <div className="event-details">
                    <p>
                      <strong>Status:</strong>{" "}
                      {announcement.status}
                    </p>

                    <p>
                      <strong>
                        Created By:
                      </strong>{" "}
                      {announcement.createdBy}
                    </p>

                    <p>
                      <strong>Event:</strong>{" "}
                      {getEventName(
                        announcement.eventId
                      )}
                    </p>

                    {announcement.publishedAt && (
                      <p>
                        <strong>
                          Published:
                        </strong>{" "}
                        {new Date(
                          announcement.publishedAt
                        ).toLocaleString()}
                      </p>
                    )}

                    <p>
                      <strong>Created:</strong>{" "}
                      {new Date(
                        announcement.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                {(canEditAnnouncement ||
                  canPublishAnnouncement ||
                  canDeleteAnnouncement) && (
                  <div className="event-actions">
                    {canEditAnnouncement && (
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(
                            announcement
                          )
                        }
                      >
                        Edit
                      </button>
                    )}

                    {canPublishAnnouncement &&
                      announcement.status ===
                        "Draft" && (
                        <button
                          type="button"
                          onClick={() =>
                            handlePublish(
                              announcement._id
                            )
                          }
                        >
                          Publish
                        </button>
                      )}

                    {canPublishAnnouncement &&
                      announcement.status !==
                        "Draft" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleUnpublish(
                              announcement._id
                            )
                          }
                        >
                          Unpublish
                        </button>
                      )}

                    {canDeleteAnnouncement && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            announcement._id
                          )
                        }
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Announcements;