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
     RENDER TASK
     ========================================================= */

  const renderTask = (task) => (
    <article
      className="deadline-card"
      key={task._id}
    >

      <div>

        <h3>
          {task.title}
        </h3>

        <p>
          {task.description ||
            "No description provided."}
        </p>


        <div className="deadline-details">

          <span>
            📌 Event:{" "}
            {getEventTitle(task.event)}
          </span>

          <span>
            🎯 Priority:{" "}
            {task.priority}
          </span>

          <span>
            📋 Status:{" "}
            {task.status}
          </span>

          <span>
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

          <section className="deadline-section overdue-section">

            <div className="deadline-heading">

              <div>

                <span className="deadline-icon">
                  🔴
                </span>

                <h2>
                  Overdue
                </h2>

              </div>


              <span className="deadline-count">
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

          <section className="deadline-section today-section">

            <div className="deadline-heading">

              <div>

                <span className="deadline-icon">
                  🟡
                </span>

                <h2>
                  Due Today
                </h2>

              </div>


              <span className="deadline-count">
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

          <section className="deadline-section upcoming-section">

            <div className="deadline-heading">

              <div>

                <span className="deadline-icon">
                  🔵
                </span>

                <h2>
                  Upcoming
                </h2>

              </div>


              <span className="deadline-count">
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