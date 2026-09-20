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

  const getUserName = () => {
    try {
      const user = localStorage.getItem("clubops_user");

      if (!user) {
        return "there";
      }

      const parsedUser = JSON.parse(user);

      return parsedUser?.name || "there";
    } catch {
      return "there";
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return {
        day: "--",
        month: "---",
        weekday: "",
        time: "",
      };
    }

    const parsedDate = new Date(date);

    return {
      day: parsedDate.toLocaleDateString("en-US", {
        day: "2-digit",
      }),

      month: parsedDate.toLocaleDateString("en-US", {
        month: "short",
      }),

      weekday: parsedDate.toLocaleDateString("en-US", {
        weekday: "long",
      }),

      time: parsedDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  };

  /*
   * Shared styling for the new upcoming cards.
   * This keeps the design consistent with the
   * cream + green ClubOps AI theme without
   * requiring changes to App.css right now.
   */

  const upcomingGridStyle = {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "18px",
    marginTop: "22px",
  };

  const upcomingCardStyle = {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    padding: "20px",
    minHeight: "145px",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(247,250,246,0.96))",
    border: "1px solid rgba(43, 101, 83, 0.10)",
    borderRadius: "22px",
    boxShadow:
      "0 10px 28px rgba(38, 76, 64, 0.07)",
    boxSizing: "border-box",
  };

  const eventDateBadgeStyle = {
    minWidth: "68px",
    width: "68px",
    height: "78px",
    borderRadius: "18px",
    background:
      "linear-gradient(145deg, #dcefe5, #c9e5d7)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    border: "1px solid rgba(39, 105, 82, 0.12)",
  };

  const meetingDateBadgeStyle = {
    ...eventDateBadgeStyle,
    background:
      "linear-gradient(145deg, #e2eee9, #d2e5df)",
  };

  const dateMonthStyle = {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#527568",
    marginBottom: "2px",
  };

  const dateDayStyle = {
    fontSize: "27px",
    lineHeight: "1",
    fontWeight: "700",
    color: "#164c3d",
  };

  const upcomingContentStyle = {
    flex: 1,
    minWidth: 0,
  };

  const upcomingTopStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "7px",
  };

  const typeStyle = {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 9px",
    borderRadius: "999px",
    background: "#edf6f1",
    color: "#34715d",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "0.9px",
  };

  const timeStyle = {
    color: "#6f8780",
    fontSize: "12px",
    fontWeight: "500",
    whiteSpace: "nowrap",
  };

  const titleStyle = {
    margin: "0 0 9px",
    color: "#123f34",
    fontSize: "18px",
    lineHeight: "1.3",
    fontWeight: "700",
  };

  const locationStyle = {
    margin: "0 0 5px",
    color: "#668078",
    fontSize: "13px",
  };

  const weekdayStyle = {
    margin: 0,
    color: "#8a9b95",
    fontSize: "12px",
  };

  const emptyUpcomingStyle = {
    padding: "28px",
    marginTop: "20px",
    textAlign: "center",
    background: "rgba(255,255,255,0.65)",
    border: "1px solid rgba(43, 101, 83, 0.08)",
    borderRadius: "18px",
    color: "#72847e",
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}

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
              Good morning, {getUserName()}
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

          {/* TOP STAT CARDS */}

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

          {/* =========================
              UPCOMING EVENTS
             ========================= */}

          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <div>
                <p
                  style={{
                    margin: "0 0 5px",
                    color: "#5b8a76",
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "1.2px",
                    textTransform: "uppercase",
                  }}
                >
                  Schedule
                </p>

                <h2>Upcoming Events</h2>

                <p>
                  The next events scheduled for your
                  club.
                </p>
              </div>
            </div>

            {upcomingEvents.length === 0 ? (
              <div style={emptyUpcomingStyle}>
                No upcoming events.
              </div>
            ) : (
              <div style={upcomingGridStyle}>
                {upcomingEvents.map((event) => {
                  const date = formatDate(event.date);

                  return (
                    <article
                      key={event._id}
                      style={upcomingCardStyle}
                    >
                      {/* DATE */}

                      <div style={eventDateBadgeStyle}>
                        <span style={dateMonthStyle}>
                          {date.month}
                        </span>

                        <strong style={dateDayStyle}>
                          {date.day}
                        </strong>
                      </div>

                      {/* EVENT CONTENT */}

                      <div style={upcomingContentStyle}>
                        <div style={upcomingTopStyle}>
                          <span style={typeStyle}>
                            EVENT
                          </span>

                          <span style={timeStyle}>
                            {date.time}
                          </span>
                        </div>

                        <h3 style={titleStyle}>
                          {event.title}
                        </h3>

                        <p style={locationStyle}>
                          📍{" "}
                          {event.location ||
                            "Location not specified"}
                        </p>

                        <p style={weekdayStyle}>
                          {date.weekday}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* =========================
              UPCOMING MEETINGS
             ========================= */}

          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <div>
                <p
                  style={{
                    margin: "0 0 5px",
                    color: "#5b8a76",
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "1.2px",
                    textTransform: "uppercase",
                  }}
                >
                  Schedule
                </p>

                <h2>Upcoming Meetings</h2>

                <p>
                  Meetings scheduled for your club.
                </p>
              </div>
            </div>

            {upcomingMeetings.length === 0 ? (
              <div style={emptyUpcomingStyle}>
                No upcoming meetings.
              </div>
            ) : (
              <div style={upcomingGridStyle}>
                {upcomingMeetings.map((meeting) => {
                  const date = formatDate(meeting.date);

                  return (
                    <article
                      key={meeting._id}
                      style={upcomingCardStyle}
                    >
                      {/* DATE */}

                      <div style={meetingDateBadgeStyle}>
                        <span style={dateMonthStyle}>
                          {date.month}
                        </span>

                        <strong style={dateDayStyle}>
                          {date.day}
                        </strong>
                      </div>

                      {/* MEETING CONTENT */}

                      <div style={upcomingContentStyle}>
                        <div style={upcomingTopStyle}>
                          <span style={typeStyle}>
                            MEETING
                          </span>

                          <span style={timeStyle}>
                            {date.time}
                          </span>
                        </div>

                        <h3 style={titleStyle}>
                          {meeting.title}
                        </h3>

                        <p style={locationStyle}>
                          📍{" "}
                          {meeting.location ||
                            "Location not specified"}
                        </p>

                        <p style={weekdayStyle}>
                          {date.weekday}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard;