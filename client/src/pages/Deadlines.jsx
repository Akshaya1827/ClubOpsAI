import { useEffect, useState } from "react";
import {
  getUpcomingDeadlines,
  getOverdueDeadlines,
  getTodayDeadlines,
} from "../services/api";

function Deadlines({ showToast }) {
  const [upcoming, setUpcoming] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [today, setToday] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD DEADLINES
     ========================================================= */

  const loadDeadlines = async (showSuccess = false) => {
    try {
      setLoading(true);
      setError("");

      const [
        upcomingData,
        overdueData,
        todayData,
      ] = await Promise.all([
        getUpcomingDeadlines(),
        getOverdueDeadlines(),
        getTodayDeadlines(),
      ]);

      setUpcoming(upcomingData.tasks || []);
      setOverdue(overdueData.tasks || []);
      setToday(todayData.tasks || []);

      if (showSuccess && showToast) {
        showToast(
          "Deadlines refreshed successfully."
        );
      }
    } catch (err) {
      setError(err.message);

      if (showToast) {
        showToast(
          err.message ||
            "Failed to load deadlines.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeadlines();
  }, []);

  /* =========================================================
     EVENT TITLE
     ========================================================= */

  const getEventTitle = (event) => {
    if (!event) {
      return "No event";
    }

    if (typeof event === "object") {
      return event.title;
    }

    return "Event";
  };

  /* =========================================================
     DEADLINE CARD STYLE
     ========================================================= */

  const deadlineCardStyle = {
    background:
      "linear-gradient(135deg, #f4fffa 0%, #dff3e9 100%)",
    border: "1px solid rgba(65, 139, 112, 0.16)",
    borderRadius: "22px",
    boxShadow:
      "0 10px 28px rgba(46, 92, 76, 0.08)",
    padding: "28px 30px",
    marginBottom: "18px",
  };

  const deadlineTitleStyle = {
    margin: "0 0 8px",
    color: "#173f35",
    fontSize: "21px",
    fontWeight: "700",
  };

  const deadlineDescriptionStyle = {
    margin: "0 0 22px",
    color: "#68837a",
    fontSize: "16px",
  };

  const deadlineDetailsStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "14px 24px",
    color: "#52756a",
    fontSize: "14px",
  };

  const deadlineDetailStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
  };

  /* =========================================================
     RENDER TASK
     ========================================================= */

  const renderTask = (task) => (
    <article
      className="deadline-card"
      key={task._id}
      style={deadlineCardStyle}
    >
      <div>
        <h3 style={deadlineTitleStyle}>
          {task.title}
        </h3>

        <p style={deadlineDescriptionStyle}>
          {task.description ||
            "No description provided."}
        </p>

        <div
          className="deadline-details"
          style={deadlineDetailsStyle}
        >
          <span style={deadlineDetailStyle}>
            📌 Event:{" "}
            {getEventTitle(task.event)}
          </span>

          <span style={deadlineDetailStyle}>
            🎯 Priority:{" "}
            {task.priority}
          </span>

          <span style={deadlineDetailStyle}>
            📋 Status:{" "}
            {task.status}
          </span>

          <span style={deadlineDetailStyle}>
            ⏰ Due:{" "}
            {new Date(
              task.dueDate
            ).toLocaleString()}
          </span>
        </div>
      </div>
    </article>
  );

  /* =========================================================
     SECTION STYLE
     ========================================================= */

  const deadlineSectionStyle = {
    marginBottom: "32px",
  };

  const deadlineHeadingStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "18px",
  };

  const deadlineHeadingLeftStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const deadlineHeadingTitleStyle = {
    margin: 0,
    color: "#173f35",
    fontSize: "22px",
    fontWeight: "700",
  };

  const deadlineCountStyle = {
    minWidth: "32px",
    height: "32px",
    padding: "0 10px",
    borderRadius: "999px",
    background: "#e1f2e9",
    color: "#36715d",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
    boxSizing: "border-box",
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
            Deadlines
          </h1>

          <p>
            Keep track of today's,
            upcoming, and overdue tasks.
          </p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={() =>
            loadDeadlines(true)
          }
        >
          Refresh
        </button>

      </header>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* =====================================================
          CONTENT
      ===================================================== */}

      {loading ? (

        <p>
          Loading deadlines...
        </p>

      ) : (

        <>

          {/* =================================================
              OVERDUE
          ================================================= */}

          <section
            className="deadline-section overdue-section"
            style={deadlineSectionStyle}
          >

            <div
              className="deadline-heading"
              style={deadlineHeadingStyle}
            >

              <div
                style={deadlineHeadingLeftStyle}
              >

                <span className="deadline-icon">
                  🔴
                </span>

                <h2
                  style={deadlineHeadingTitleStyle}
                >
                  Overdue
                </h2>

              </div>

              <span
                className="deadline-count"
                style={deadlineCountStyle}
              >
                {overdue.length}
              </span>

            </div>

            {overdue.length === 0 ? (

              <p className="empty-message">
                No overdue tasks.
              </p>

            ) : (

              <div className="deadline-list">
                {overdue.map(renderTask)}
              </div>

            )}

          </section>


          {/* =================================================
              TODAY
          ================================================= */}

          <section
            className="deadline-section today-section"
            style={deadlineSectionStyle}
          >

            <div
              className="deadline-heading"
              style={deadlineHeadingStyle}
            >

              <div
                style={deadlineHeadingLeftStyle}
              >

                <span className="deadline-icon">
                  🟡
                </span>

                <h2
                  style={deadlineHeadingTitleStyle}
                >
                  Due Today
                </h2>

              </div>

              <span
                className="deadline-count"
                style={deadlineCountStyle}
              >
                {today.length}
              </span>

            </div>

            {today.length === 0 ? (

              <p className="empty-message">
                No tasks are due today.
              </p>

            ) : (

              <div className="deadline-list">
                {today.map(renderTask)}
              </div>

            )}

          </section>


          {/* =================================================
              UPCOMING
          ================================================= */}

          <section
            className="deadline-section upcoming-section"
            style={deadlineSectionStyle}
          >

            <div
              className="deadline-heading"
              style={deadlineHeadingStyle}
            >

              <div
                style={deadlineHeadingLeftStyle}
              >

                <span className="deadline-icon">
                  🔵
                </span>

                <h2
                  style={deadlineHeadingTitleStyle}
                >
                  Upcoming
                </h2>

              </div>

              <span
                className="deadline-count"
                style={deadlineCountStyle}
              >
                {upcoming.length}
              </span>

            </div>

            {upcoming.length === 0 ? (

              <p className="empty-message">
                No upcoming deadlines.
              </p>

            ) : (

              <div className="deadline-list">
                {upcoming.map(renderTask)}
              </div>

            )}

          </section>

        </>

      )}

    </div>
  );
}

export default Deadlines;