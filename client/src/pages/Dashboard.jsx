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

      const deadlines = getArrayFromResponse(
        deadlinesData,
        ["tasks", "deadlines"]
      );

      const volunteers = getArrayFromResponse(
        volunteersData,
        ["volunteers"]
      );

      const documents = getArrayFromResponse(
        documentsData,
        ["documents"]
      );

      const meetings = getArrayFromResponse(
        meetingsData,
        ["meetings"]
      );

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
    <div className="dashboard-page">
      <header className="dashboard-header">
        <p className="dashboard-eyebrow">
          ClubOps AI · Overview
        </p>

        <h1 className="dashboard-title">
          Club Operations
        </h1>

        <p className="dashboard-subtitle">
          Your central workspace for events, tasks,
          deadlines, volunteers, meetings and club
          documents.
        </p>
      </header>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="dashboard-empty">
          Loading your club overview...
        </div>
      ) : (
        <>
          {/* HERO */}

          <section className="dashboard-hero">
            <div className="dashboard-hero-badge">
              AI-powered operations hub
            </div>

            <h2>
              Good morning,{" "}
              {localStorage.getItem("clubops_user")
                ? JSON.parse(
                    localStorage.getItem("clubops_user")
                  ).name
                : "there"}
            </h2>

            <p>
              Your club currently has{" "}
              <strong>{stats.events}</strong> events,
              <strong> {stats.tasks}</strong> tasks,
              and{" "}
              <strong>{stats.deadlines}</strong>{" "}
              upcoming deadlines.
            </p>
          </section>

          {/* STAT CARDS */}

          <section className="dashboard-stats">
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-label">
                Upcoming events
              </span>

              <span className="dashboard-stat-value">
                {stats.events}
              </span>

              <span className="dashboard-stat-description">
                {upcomingEvents.length > 0
                  ? `Next: ${upcomingEvents[0].title}`
                  : "No upcoming events"}
              </span>

              <div className="dashboard-stat-icon green">
                📅
              </div>
            </div>

            <div className="dashboard-stat-card">
              <span className="dashboard-stat-label">
                Active tasks
              </span>

              <span className="dashboard-stat-value">
                {stats.tasks}
              </span>

              <span className="dashboard-stat-description">
                Tasks currently in your club
              </span>

              <div className="dashboard-stat-icon blue">
                ✓
              </div>
            </div>

            <div className="dashboard-stat-card">
              <span className="dashboard-stat-label">
                Volunteers
              </span>

              <span className="dashboard-stat-value">
                {stats.volunteers}
              </span>

              <span className="dashboard-stat-description">
                Volunteers registered
              </span>

              <div className="dashboard-stat-icon amber">
                ♧
              </div>
            </div>

            <div className="dashboard-stat-card">
              <span className="dashboard-stat-label">
                Urgent deadlines
              </span>

              <span className="dashboard-stat-value">
                {stats.deadlines}
              </span>

              <span className="dashboard-stat-description">
                Upcoming action items
              </span>

              <div className="dashboard-stat-icon red">
                !
              </div>
            </div>
          </section>

          {/* CURRENT OPERATIONS */}

          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <div>
                <h2>What you have now</h2>

                <p>
                  A quick view of the club's current
                  operations.
                </p>
              </div>
            </div>

            <div className="dashboard-stats">
              <div className="dashboard-stat-card">
                <span className="dashboard-stat-label">
                  Documents
                </span>

                <span className="dashboard-stat-value">
                  {stats.documents}
                </span>

                <span className="dashboard-stat-description">
                  Club documents
                </span>

                <div className="dashboard-stat-icon green">
                  ▣
                </div>
              </div>

              <div className="dashboard-stat-card">
                <span className="dashboard-stat-label">
                  Meetings
                </span>

                <span className="dashboard-stat-value">
                  {stats.meetings}
                </span>

                <span className="dashboard-stat-description">
                  Scheduled meetings
                </span>

                <div className="dashboard-stat-icon blue">
                  ◷
                </div>
              </div>

              <div className="dashboard-stat-card">
                <span className="dashboard-stat-label">
                  Announcements
                </span>

                <span className="dashboard-stat-value">
                  {stats.announcements}
                </span>

                <span className="dashboard-stat-description">
                  Club announcements
                </span>

                <div className="dashboard-stat-icon amber">
                  ✦
                </div>
              </div>

              <div className="dashboard-stat-card">
                <span className="dashboard-stat-label">
                  Deadlines
                </span>

                <span className="dashboard-stat-value">
                  {stats.deadlines}
                </span>

                <span className="dashboard-stat-description">
                  Upcoming deadlines
                </span>

                <div className="dashboard-stat-icon red">
                  !
                </div>
              </div>
            </div>
          </section>

          {/* UPCOMING EVENTS */}

          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <div>
                <h2>Upcoming Events</h2>

                <p>
                  The next events scheduled for your
                  club.
                </p>
              </div>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="dashboard-empty">
                No upcoming events.
              </div>
            ) : (
              <div className="dashboard-list">
                {upcomingEvents.map((event) => (
                  <article
                    className="dashboard-list-card"
                    key={event._id}
                  >
                    <div>
                      <h3>{event.title}</h3>

                      <p>
                        {event.location ||
                          "Location not specified"}
                      </p>
                    </div>

                    <div className="dashboard-list-meta">
                      {new Date(
                        event.date
                      ).toLocaleString()}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* UPCOMING MEETINGS */}

          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <div>
                <h2>Upcoming Meetings</h2>

                <p>
                  Meetings scheduled for your club.
                </p>
              </div>
            </div>

            {upcomingMeetings.length === 0 ? (
              <div className="dashboard-empty">
                No upcoming meetings.
              </div>
            ) : (
              <div className="dashboard-list">
                {upcomingMeetings.map((meeting) => (
                  <article
                    className="dashboard-list-card"
                    key={meeting._id}
                  >
                    <div>
                      <h3>{meeting.title}</h3>

                      <p>
                        {meeting.location ||
                          "Location not specified"}
                      </p>
                    </div>

                    <div className="dashboard-list-meta">
                      {new Date(
                        meeting.date
                      ).toLocaleString()}
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