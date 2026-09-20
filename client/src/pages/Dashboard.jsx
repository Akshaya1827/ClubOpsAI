import { useEffect, useState } from "react";
import {
  getEvents,
  getTasks,
  getUpcomingDeadlines,
  getVolunteers,
  getDocuments,
  getMeetings,
  getAnnouncements,
} from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    events: 0,
    tasks: 0,
    deadlines: 0,
    volunteers: 0,
    documents: 0,
    meetings: 0,
    announcements: 0,
  });

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getArrayFromResponse = (response, possibleKeys = []) => {
    if (Array.isArray(response)) {
      return response;
    }

    if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }

    for (const key of possibleKeys) {
      if (Array.isArray(response?.[key])) {
        return response[key];
      }
    }

    return [];
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        eventsData,
        tasksData,
        deadlinesData,
        volunteersData,
        documentsData,
        meetingsData,
        announcementsData,
      ] = await Promise.all([
        getEvents(),
        getTasks(),
        getUpcomingDeadlines(),
        getVolunteers(),
        getDocuments(),
        getMeetings(),
        getAnnouncements(),
      ]);

      const events = getArrayFromResponse(eventsData, [
        "events",
      ]);

      const tasks = getArrayFromResponse(tasksData, [
        "tasks",
      ]);

      const deadlines = getArrayFromResponse(deadlinesData, [
        "tasks",
        "deadlines",
      ]);

      const volunteers = getArrayFromResponse(volunteersData, [
        "volunteers",
      ]);

      const documents = getArrayFromResponse(documentsData, [
        "documents",
      ]);

      const meetings = getArrayFromResponse(meetingsData, [
        "meetings",
      ]);

      const announcements = getArrayFromResponse(
        announcementsData,
        ["announcements"]
      );

      setStats({
        events: events.length,
        tasks: tasks.length,
        deadlines: deadlines.length,
        volunteers: volunteers.length,
        documents: documents.length,
        meetings: meetings.length,
        announcements: announcements.length,
      });

      const now = new Date();

      const sortedEvents = [...events]
        .filter(
          (event) =>
            event.date &&
            new Date(event.date) >= now
        )
        .sort(
          (a, b) =>
            new Date(a.date).getTime() -
            new Date(b.date).getTime()
        )
        .slice(0, 5);

      const sortedMeetings = [...meetings]
        .filter(
          (meeting) =>
            meeting.date &&
            new Date(meeting.date) >= now
        )
        .sort(
          (a, b) =>
            new Date(a.date).getTime() -
            new Date(b.date).getTime()
        )
        .slice(0, 5);

      setUpcomingEvents(sortedEvents);
      setUpcomingMeetings(sortedMeetings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="events-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">ClubOps AI</p>

          <h1>Dashboard</h1>

          <p>
            Get a quick overview of your club's
            operations.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
        >
          Refresh
        </button>
      </header>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          <section className="events-section">
            <div className="section-heading">
              <h2>Club Overview</h2>
            </div>

            <div className="dashboard-stats">
              <div className="dashboard-stat-card">
                <span>Events</span>
                <strong>{stats.events}</strong>
              </div>

              <div className="dashboard-stat-card">
                <span>Tasks</span>
                <strong>{stats.tasks}</strong>
              </div>

              <div className="dashboard-stat-card">
                <span>Upcoming Deadlines</span>
                <strong>{stats.deadlines}</strong>
              </div>

              <div className="dashboard-stat-card">
                <span>Volunteers</span>
                <strong>{stats.volunteers}</strong>
              </div>

              <div className="dashboard-stat-card">
                <span>Documents</span>
                <strong>{stats.documents}</strong>
              </div>

              <div className="dashboard-stat-card">
                <span>Meetings</span>
                <strong>{stats.meetings}</strong>
              </div>

              <div className="dashboard-stat-card">
                <span>Announcements</span>
                <strong>
                  {stats.announcements}
                </strong>
              </div>
            </div>
          </section>

          <section className="events-section">
            <div className="section-heading">
              <h2>Upcoming Events</h2>
            </div>

            {upcomingEvents.length === 0 ? (
              <p>No upcoming events.</p>
            ) : (
              <div className="events-list">
                {upcomingEvents.map((event) => (
                  <article
                    className="event-card"
                    key={event._id}
                  >
                    <div className="event-card-content">
                      <div>
                        <h3>{event.title}</h3>

                        <p>
                          {event.description ||
                            "No description available."}
                        </p>
                      </div>

                      <div className="event-details">
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(
                            event.date
                          ).toLocaleString()}
                        </p>

                        <p>
                          <strong>Location:</strong>{" "}
                          {event.location ||
                            "Not specified"}
                        </p>

                        <p>
                          <strong>Status:</strong>{" "}
                          {event.status}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="events-section">
            <div className="section-heading">
              <h2>Upcoming Meetings</h2>
            </div>

            {upcomingMeetings.length === 0 ? (
              <p>No upcoming meetings.</p>
            ) : (
              <div className="events-list">
                {upcomingMeetings.map((meeting) => (
                  <article
                    className="event-card"
                    key={meeting._id}
                  >
                    <div className="event-card-content">
                      <div>
                        <h3>{meeting.title}</h3>

                        <p>
                          {meeting.location ||
                            "Location not specified"}
                        </p>
                      </div>

                      <div className="event-details">
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(
                            meeting.date
                          ).toLocaleString()}
                        </p>

                        <p>
                          <strong>Status:</strong>{" "}
                          {meeting.status}
                        </p>

                        <p>
                          <strong>Attendees:</strong>{" "}
                          {meeting.attendees?.length || 0}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard;