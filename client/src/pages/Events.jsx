import { useEffect, useState } from "react";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../services/api";
import { canPerformAction } from "../config/permissions";

function Events({ showToast }) {
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
          err.message || "Failed to load events.",
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
        setError("Please select a date and time.");

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
        date: new Date(form.date).toISOString(),
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
          err.message || "Something went wrong.",
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
      description: event.description || "",
      date: event.date
        ? new Date(event.date)
            .toISOString()
            .slice(0, 16)
        : "",
      location: event.location || "",
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
          err.message || "Failed to delete event.",
          "error"
        );
      }
    }
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

          <h1>Events</h1>

          <p>
            Manage club events and their schedules.
          </p>
        </div>
      </header>


      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* =====================================================
          CREATE / EDIT FORM
      ===================================================== */}

      {canManageEvents && (
        <section className="event-form-section">

          <h2>
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


      {/* =====================================================
          VIEW-ONLY MESSAGE
      ===================================================== */}

      {!canManageEvents && (
        <div className="empty-state">
          You can view events, but you do not have
          permission to create or edit them.
        </div>
      )}


      {/* =====================================================
          EVENTS LIST
      ===================================================== */}

      <section className="events-section">

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
                      Status: {event.status}
                    </span>

                  </div>

                </div>


                {(canEditEvent ||
                  canDeleteEvent) && (

                  <div className="event-actions">

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
                )}

              </article>

            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default Events;