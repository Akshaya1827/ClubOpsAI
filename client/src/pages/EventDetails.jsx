import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById } from "../services/api";

function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getEventById(eventId);

        setEvent(data.event || data.data || data);
      } catch (err) {
        setError(
          err.message || "Failed to load event."
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="events-page">
        <p>Loading event...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-page">
        <button
          type="button"
          className="refresh-button"
          onClick={() => navigate("/events")}
        >
          ← Back to Events
        </button>

        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="events-page">
        <button
          type="button"
          className="refresh-button"
          onClick={() => navigate("/events")}
        >
          ← Back to Events
        </button>

        <p className="empty-message">
          Event not found.
        </p>
      </div>
    );
  }

  return (
    <div className="events-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">
            ClubOps AI
          </p>

          <h1>{event.title}</h1>

          <p>
            View complete event information.
          </p>
        </div>
      </header>

      <section className="event-form-section">
        <div className="section-heading">
          <h2>Event Details</h2>

          <button
            type="button"
            onClick={() => navigate("/events")}
          >
            ← Back to Events
          </button>
        </div>

        <div className="event-details-page">
          <div className="detail-item">
            <span className="detail-label">
              Event Title
            </span>

            <strong>
              {event.title}
            </strong>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              Description
            </span>

            <p>
              {event.description ||
                "No description provided."}
            </p>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              Date & Time
            </span>

            <p>
              {event.date
                ? new Date(
                    event.date
                  ).toLocaleString()
                : "Date not specified"}
            </p>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              Location
            </span>

            <p>
              {event.location ||
                "Location not specified"}
            </p>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              Status
            </span>

            <p>
              {event.status ||
                "Status not specified"}
            </p>
          </div>
        </div>
      </section>

      <section className="events-section">
        <div className="section-heading">
          <h2>Event Information</h2>
        </div>

        <div className="event-details">
          <span>
            📅{" "}
            {event.date
              ? new Date(
                  event.date
                ).toLocaleString()
              : "Date not specified"}
          </span>

          <span>
            📍{" "}
            {event.location ||
              "Location not specified"}
          </span>

          <span>
            Status:{" "}
            {event.status ||
              "Not specified"}
          </span>
        </div>
      </section>
    </div>
  );
}

export default EventDetails;