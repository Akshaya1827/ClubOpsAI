import { useEffect, useState } from "react";
import {
  getMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  getEvents,
} from "../services/api";
import { canPerformAction } from "../config/permissions";

function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    eventId: "",
    date: "",
    location: "",
    attendees: "",
    notes: "",
    transcript: "",
    status: "Scheduled",
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
  const canCreateMeeting = canPerformAction(
    userRole,
    "createMeeting"
  );

  const canEditMeeting = canPerformAction(
    userRole,
    "editMeeting"
  );

  const canDeleteMeeting = canPerformAction(
    userRole,
    "deleteMeeting"
  );

  const canManageMeetings =
    canCreateMeeting || canEditMeeting;

  const loadMeetings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMeetings();

      setMeetings(data.data || []);
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
    loadMeetings();
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
      eventId: "",
      date: "",
      location: "",
      attendees: "",
      notes: "",
      transcript: "",
      status: "Scheduled",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (editingId && !canEditMeeting) {
      setError(
        "You do not have permission to edit meetings."
      );
      return;
    }

    if (!editingId && !canCreateMeeting) {
      setError(
        "You do not have permission to create meetings."
      );
      return;
    }

    try {
      setError("");
      setSuccess("");

      if (!form.date) {
        setError("Please select a date and time.");
        return;
      }

      const meetingData = {
        title: form.title,
        eventId: form.eventId || undefined,
        date: new Date(form.date).toISOString(),
        location: form.location,
        attendees: form.attendees
          .split(",")
          .map((attendee) => attendee.trim())
          .filter(Boolean),
        notes: form.notes,
        transcript: form.transcript,
        status: form.status,
      };

      if (editingId) {
        await updateMeeting(
          editingId,
          meetingData
        );

        setSuccess(
          "Meeting updated successfully."
        );
      } else {
        await createMeeting(meetingData);

        setSuccess(
          "Meeting created successfully."
        );
      }

      resetForm();
      await loadMeetings();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (meeting) => {
    if (!canEditMeeting) {
      setError(
        "You do not have permission to edit meetings."
      );
      return;
    }

    setEditingId(meeting._id);

    setForm({
      title: meeting.title || "",
      eventId: meeting.eventId || "",
      date: meeting.date
        ? new Date(meeting.date)
            .toISOString()
            .slice(0, 16)
        : "",
      location: meeting.location || "",
      attendees: Array.isArray(meeting.attendees)
        ? meeting.attendees.join(", ")
        : "",
      notes: meeting.notes || "",
      transcript: meeting.transcript || "",
      status: meeting.status || "Scheduled",
    });

    setSuccess("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (meetingId) => {
    if (!canDeleteMeeting) {
      setError(
        "You do not have permission to delete meetings."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this meeting?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteMeeting(meetingId);

      setSuccess(
        "Meeting deleted successfully."
      );

      await loadMeetings();
    } catch (err) {
      setError(err.message);
    }
  };

  const getEventName = (eventId) => {
    if (!eventId) {
      return "No event assigned";
    }

    const event = events.find(
      (item) => item._id === eventId
    );

    return event
      ? event.title
      : "Event not found";
  };

  return (
    <div className="meetings-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">ClubOps AI</p>

          <h1>Meetings</h1>

          <p>
            Schedule and manage club meetings.
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
      {canManageMeetings && (
        <section className="event-form-section">
          <h2>
            {editingId
              ? "Edit Meeting"
              : "Create Meeting"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">
                Meeting Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter meeting title"
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
            </div>

            <div className="form-row">
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
                  placeholder="Enter meeting location"
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Scheduled">
                    Scheduled
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="attendees">
                Attendees
              </label>

              <input
                id="attendees"
                name="attendees"
                type="text"
                value={form.attendees}
                onChange={handleChange}
                placeholder="Enter names separated by commas"
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">
                Notes
              </label>

              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Enter meeting notes"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="transcript">
                Transcript
              </label>

              <textarea
                id="transcript"
                name="transcript"
                value={form.transcript}
                onChange={handleChange}
                placeholder="Enter meeting transcript"
                rows="6"
              />
            </div>

            <div className="form-actions">
              <button type="submit">
                {editingId
                  ? "Update Meeting"
                  : "Create Meeting"}
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

      {!canManageMeetings && (
        <div className="empty-state">
          You can view meetings, but you do not have
          permission to create or edit them.
        </div>
      )}

      <section className="events-section">
        <div className="section-heading">
          <h2>All Meetings</h2>

          <button
            type="button"
            onClick={loadMeetings}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading meetings...</p>
        ) : meetings.length === 0 ? (
          <p>No meetings found.</p>
        ) : (
          <div className="events-list">
            {meetings.map((meeting) => (
              <article
                className="event-card"
                key={meeting._id}
              >
                <div className="event-card-content">
                  <h3>{meeting.title}</h3>

                  <div className="event-details">
                    <span>
                      Date:{" "}
                      {meeting.date
                        ? new Date(
                            meeting.date
                          ).toLocaleString()
                        : "Date not specified"}
                    </span>

                    <span>
                      Event:{" "}
                      {getEventName(
                        meeting.eventId
                      )}
                    </span>

                    <span>
                      Location:{" "}
                      {meeting.location ||
                        "Location not specified"}
                    </span>

                    <span>
                      Status: {meeting.status}
                    </span>

                    <span>
                      Attendees:{" "}
                      {meeting.attendees?.length
                        ? meeting.attendees.join(", ")
                        : "None listed"}
                    </span>
                  </div>

                  {meeting.notes && (
                    <p>
                      <strong>Notes:</strong>{" "}
                      {meeting.notes}
                    </p>
                  )}

                  {meeting.transcript && (
                    <p>
                      <strong>Transcript:</strong>{" "}
                      {meeting.transcript}
                    </p>
                  )}
                </div>

                {(canEditMeeting ||
                  canDeleteMeeting) && (
                  <div className="event-actions">
                    {canEditMeeting && (
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(meeting)
                        }
                      >
                        Edit
                      </button>
                    )}

                    {canDeleteMeeting && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            meeting._id
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

export default Meetings;