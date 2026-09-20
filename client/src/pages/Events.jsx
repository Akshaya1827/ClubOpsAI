import { useEffect, useState } from "react";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../services/api";

function Events() {
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

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEvents();
      setEvents(data.events);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      description: "",
      date: "",
      location: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      const eventData = {
        title: form.title,
        description: form.description,
        date: new Date(form.date).toISOString(),
        location: form.location,
      };

      if (editingId) {
        await updateEvent(editingId, eventData);
      } else {
        await createEvent(eventData);
      }

      resetForm();
      await loadEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event._id);

    setForm({
      title: event.title || "",
      description: event.description || "",
      date: event.date
        ? new Date(event.date).toISOString().slice(0, 16)
        : "",
      location: event.location || "",
    });
  };

  const handleDelete = async (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteEvent(eventId);
      await loadEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="events-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">ClubOps AI</p>
          <h1>Events</h1>
          <p>Manage club events and their schedules.</p>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <section className="event-form-section">
        <h2>{editingId ? "Edit Event" : "Create Event"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Event Title</label>
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
            <label htmlFor="description">Description</label>
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
              <label htmlFor="date">Date and Time</label>
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
              <label htmlFor="location">Location</label>
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
              {editingId ? "Update Event" : "Create Event"}
            </button>

            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="events-section">
        <div className="section-heading">
          <h2>All Events</h2>
          <button type="button" onClick={loadEvents}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <div className="events-list">
            {events.map((event) => (
              <article className="event-card" key={event._id}>
                <div className="event-card-content">
                  <h3>{event.title}</h3>

                  <p>{event.description || "No description provided."}</p>

                  <div className="event-details">
                    <span>
                      📅{" "}
                      {new Date(event.date).toLocaleString()}
                    </span>

                    <span>
                      📍 {event.location || "Location not specified"}
                    </span>

                    <span>
                      Status: {event.status}
                    </span>
                  </div>
                </div>

                <div className="event-actions">
                  <button
                    type="button"
                    onClick={() => handleEdit(event)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(event._id)}
                  >
                    Delete
                  </button>
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