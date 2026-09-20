import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../services/api";
import { canPerformAction } from "../config/permissions";

function Events({ showToast }) {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  const [editingId, setEditingId] = useState(null);

  const savedUser = localStorage.getItem("clubops_user");

  let user = null;

  try {
    user = savedUser ? JSON.parse(savedUser) : null;
  } catch {
    user = null;
  }

  const userRole = user?.role;

  const canCreateEvent = canPerformAction(
    userRole,
    "createEvent"
  );

  const canEditEvent = canPerformAction(
    userRole,
    "editEvent"
  );

  const canDeleteEvent = canPerformAction(
    userRole,
    "deleteEvent"
  );

  const canManageEvents =
    canCreateEvent || canEditEvent;

  /* =========================================================
     STYLES
     ========================================================= */

  const formSectionStyle = {
    background:
      "linear-gradient(135deg, #f4fffa 0%, #dff3e9 100%)",
    border:
      "1px solid rgba(65, 139, 112, 0.16)",
    borderRadius: "24px",
    boxShadow:
      "0 10px 30px rgba(46, 92, 76, 0.08)",
    padding: "30px",
  };

  const formHeadingStyle = {
    color: "#173f35",
    marginBottom: "24px",
  };

  const inputStyle = {
    background: "rgba(255, 255, 255, 0.78)",
    border:
      "1px solid rgba(65, 139, 112, 0.20)",
    borderRadius: "12px",
  };

  const eventListSectionStyle = {
    background:
      "linear-gradient(135deg, #f4fffa 0%, #dff3e9 100%)",
    border:
      "1px solid rgba(65, 139, 112, 0.16)",
    borderRadius: "24px",
    boxShadow:
      "0 10px 30px rgba(46, 92, 76, 0.08)",
    padding: "30px",
  };

  /* =========================================================
     LOAD EVENTS
     ========================================================= */

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEvents();

      setEvents(data.events || []);
    } catch (err) {
      setError(err.message);

      if (showToast) {
        showToast(
          err.message ||
            "Failed to load events.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  /* =========================================================
     FORM CHANGE
     ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  /* =========================================================
     RESET FORM
     ========================================================= */

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      date: "",
      location: "",
    });

    setEditingId(null);
  };

  /* =========================================================
     CREATE / UPDATE EVENT
     ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (editingId && !canEditEvent) {
      setError(
        "You do not have permission to edit events."
      );

      if (showToast) {
        showToast(
          "You do not have permission to edit events.",
          "error"
        );
      }

      return;
    }

    if (!editingId && !canCreateEvent) {
      setError(
        "You do not have permission to create events."
      );

      if (showToast) {
        showToast(
          "You do not have permission to create events.",
          "error"
        );
      }

      return;
    }

    try {
      setError("");

      if (!form.date) {
        setError(
          "Please select a date and time."
        );

        if (showToast) {
          showToast(
            "Please select a date and time.",
            "error"
          );
        }

        return;
      }

      const eventData = {
        title: form.title,
        description: form.description,
        date: new Date(
          form.date
        ).toISOString(),
        location: form.location,
      };

      if (editingId) {
        await updateEvent(
          editingId,
          eventData
        );

        if (showToast) {
          showToast(
            "Event updated successfully."
          );
        }
      } else {
        await createEvent(eventData);

        if (showToast) {
          showToast(
            "Event created successfully."
          );
        }
      }

      resetForm();

      await loadEvents();
    } catch (err) {
      setError(err.message);

      if (showToast) {
        showToast(
          err.message ||
            "Something went wrong.",
          "error"
        );
      }
    }
  };

  /* =========================================================
     EDIT EVENT
     ========================================================= */

  const handleEdit = (event) => {
    if (!canEditEvent) {
      setError(
        "You do not have permission to edit events."
      );

      if (showToast) {
        showToast(
          "You do not have permission to edit events.",
          "error"
        );
      }

      return;
    }

    setEditingId(event._id);

    setForm({
      title: event.title || "",
      description:
        event.description || "",
      date: event.date
        ? new Date(event.date)
            .toISOString()
            .slice(0, 16)
        : "",
      location:
        event.location || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     DELETE EVENT
     ========================================================= */

  const handleDelete = async (eventId) => {
    if (!canDeleteEvent) {
      setError(
        "You do not have permission to delete events."
      );

      if (showToast) {
        showToast(
          "You do not have permission to delete events.",
          "error"
        );
      }

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteEvent(eventId);

      if (showToast) {
        showToast(
          "Event deleted successfully."
        );
      }

      await loadEvents();
    } catch (err) {
      setError(err.message);

      if (showToast) {
        showToast(
          err.message ||
            "Failed to delete event.",
          "error"
        );
      }
    }
  };

  /* =========================================================
     VIEW EVENT DETAILS
     ========================================================= */

  const handleViewDetails = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  /* =========================================================
     UI
     ========================================================= */

  return (
    <div className="events-page">

      <header className="page-header">
        <div>
          <p className="eyebrow">
            ClubOps AI
          </p>

          <h1>
            Events
          </h1>

          <p>
            Manage club events and their schedules.
          </p>
        </div>
      </header>

      {/* ERROR */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* CREATE / EDIT FORM */}

      {canManageEvents && (
        <section
          className="event-form-section"
          style={formSectionStyle}
        >

          <h2 style={formHeadingStyle}>
            {editingId
              ? "Edit Event"
              : "Create Event"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label htmlFor="title">
                Event Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter event title"
                required
                style={inputStyle}
              />

            </div>

            <div className="form-group">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter event description"
                rows="4"
                style={inputStyle}
              />

            </div>

            <div className="form-row">

              <div className="form-group">

                <label htmlFor="date">
                  Date and Time
                </label>

                <input
                  id="date"
                  name="date"
                  type="datetime-local"
                  value={form.date}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />

              </div>

              <div className="form-group">

                <label htmlFor="location">
                  Location
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  style={inputStyle}
                />

              </div>

            </div>

            <div className="form-actions">

              <button type="submit">
                {editingId
                  ? "Update Event"
                  : "Create Event"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </section>
      )}

      {/* VIEW ONLY */}

      {!canManageEvents && (
        <div className="empty-state">
          You can view events, but you do not
          have permission to create or edit them.
        </div>
      )}

      {/* EVENTS LIST */}

      <section
        className="events-section"
        style={eventListSectionStyle}
      >

        <div className="section-heading">

          <h2>
            All Events
          </h2>

          <button
            type="button"
            onClick={loadEvents}
          >
            Refresh
          </button>

        </div>

        {loading ? (

          <p>
            Loading events...
          </p>

        ) : events.length === 0 ? (

          <p>
            No events found.
          </p>

        ) : (

          <div className="events-list">

            {events.map((event) => (

              <article
                className="event-card"
                key={event._id}
              >

                <div className="event-card-content">

                  <h3>
                    {event.title}
                  </h3>

                  <p>
                    {event.description ||
                      "No description provided."}
                  </p>

                  <div className="event-details">

                    <span>
                      📅{" "}
                      {new Date(
                        event.date
                      ).toLocaleString()}
                    </span>

                    <span>
                      📍{" "}
                      {event.location ||
                        "Location not specified"}
                    </span>

                    <span>
                      Status:{" "}
                      {event.status}
                    </span>

                  </div>

                </div>

                <div className="event-actions">

                  <button
                    type="button"
                    className="view-details-button"
                    onClick={() =>
                      handleViewDetails(
                        event._id
                      )
                    }
                  >
                    View Details
                  </button>

                  {canEditEvent && (
                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(event)
                      }
                    >
                      Edit
                    </button>
                  )}

                  {canDeleteEvent && (
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          event._id
                        )
                      }
                    >
                      Delete
                    </button>
                  )}

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default Events;