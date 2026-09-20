import { useEffect, useState } from "react";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
  unpublishAnnouncement,
  getEvents,
} from "../services/api";
import { canPerformAction } from "../config/permissions";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    content: "",
    eventId: "",
    createdBy: "",
  });

  const [editingId, setEditingId] = useState(null);

  /* =========================================================
     USER / PERMISSIONS
     ========================================================= */

  const savedUser =
    localStorage.getItem("clubops_user");

  let user = null;

  try {
    user = savedUser
      ? JSON.parse(savedUser)
      : null;
  } catch {
    user = null;
  }

  const userRole = user?.role;

  const canCreateAnnouncement =
    canPerformAction(
      userRole,
      "createAnnouncement"
    );

  const canEditAnnouncement =
    canPerformAction(
      userRole,
      "editAnnouncement"
    );

  const canDeleteAnnouncement =
    canPerformAction(
      userRole,
      "deleteAnnouncement"
    );

  const canPublishAnnouncement =
    canPerformAction(
      userRole,
      "publishAnnouncement"
    );

  const canManageAnnouncements =
    canCreateAnnouncement ||
    canEditAnnouncement;

  /* =========================================================
     CLUBOPS AI THEME
     ========================================================= */

  const mintSectionStyle = {
    background:
      "linear-gradient(135deg, #f4fffa 0%, #dff3e9 100%)",
    border:
      "1px solid rgba(65, 139, 112, 0.16)",
    borderRadius: "24px",
    boxShadow:
      "0 10px 30px rgba(46, 92, 76, 0.08)",
    padding: "34px 38px",
  };

  const formInnerStyle = {
    width: "100%",
    maxWidth: "1080px",
    margin: "0 auto",
  };

  const headingStyle = {
    color: "#173f35",
    textAlign: "center",
    fontSize: "25px",
    fontWeight: "700",
    marginBottom: "28px",
  };

  const labelStyle = {
    display: "block",
    textAlign: "center",
    color: "#173f35",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "9px",
  };

  const inputStyle = {
    width: "100%",
    height: "52px",
    boxSizing: "border-box",
    padding: "0 15px",
    background:
      "rgba(255, 255, 255, 0.88)",
    border:
      "1px solid rgba(65, 139, 112, 0.20)",
    borderRadius: "11px",
    color: "#173f35",
    fontSize: "15px",
    fontFamily: "inherit",
    outline: "none",
  };

  const textareaStyle = {
    width: "100%",
    minHeight: "145px",
    boxSizing: "border-box",
    padding: "14px 15px",
    background:
      "rgba(255, 255, 255, 0.88)",
    border:
      "1px solid rgba(65, 139, 112, 0.20)",
    borderRadius: "11px",
    color: "#173f35",
    fontSize: "15px",
    lineHeight: "1.55",
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
  };

  const formGroupStyle = {
    marginBottom: "22px",
  };

  const formRowStyle = {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1fr) minmax(0, 1fr)",
    gap: "20px",
    marginBottom: "22px",
  };

  const buttonRowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "8px",
  };

  /* =========================================================
     LOAD ANNOUNCEMENTS
     ========================================================= */

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getAnnouncements();

      setAnnouncements(
        data.data || []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     LOAD EVENTS
     ========================================================= */

  const loadEvents = async () => {
    try {
      const data =
        await getEvents();

      setEvents(
        data.events || []
      );
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadAnnouncements();
    loadEvents();
  }, []);

  /* =========================================================
     FORM CHANGE
     ========================================================= */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

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
      content: "",
      eventId: "",
      createdBy: "",
    });

    setEditingId(null);
  };

  /* =========================================================
     CREATE / UPDATE
     ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      editingId &&
      !canEditAnnouncement
    ) {
      setError(
        "You do not have permission to edit announcements."
      );

      return;
    }

    if (
      !editingId &&
      !canCreateAnnouncement
    ) {
      setError(
        "You do not have permission to create announcements."
      );

      return;
    }

    try {
      setError("");
      setSuccess("");

      const announcementData = {
        title: form.title,
        content: form.content,
        eventId:
          form.eventId || undefined,
        createdBy: form.createdBy,
      };

      if (editingId) {
        await updateAnnouncement(
          editingId,
          announcementData
        );

        setSuccess(
          "Announcement updated successfully."
        );
      } else {
        await createAnnouncement(
          announcementData
        );

        setSuccess(
          "Announcement created successfully."
        );
      }

      resetForm();

      await loadAnnouncements();
    } catch (err) {
      setError(err.message);
    }
  };

  /* =========================================================
     EDIT
     ========================================================= */

  const handleEdit = (
    announcement
  ) => {
    if (!canEditAnnouncement) {
      setError(
        "You do not have permission to edit announcements."
      );

      return;
    }

    setEditingId(
      announcement._id
    );

    setForm({
      title:
        announcement.title || "",
      content:
        announcement.content || "",
      eventId:
        announcement.eventId?._id ||
        announcement.eventId ||
        "",
      createdBy:
        announcement.createdBy || "",
    });

    setSuccess("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     DELETE
     ========================================================= */

  const handleDelete = async (
    announcementId
  ) => {
    if (!canDeleteAnnouncement) {
      setError(
        "You do not have permission to delete announcements."
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this announcement?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteAnnouncement(
        announcementId
      );

      setSuccess(
        "Announcement deleted successfully."
      );

      await loadAnnouncements();
    } catch (err) {
      setError(err.message);
    }
  };

  /* =========================================================
     PUBLISH
     ========================================================= */

  const handlePublish = async (
    announcementId
  ) => {
    if (!canPublishAnnouncement) {
      setError(
        "You do not have permission to publish announcements."
      );

      return;
    }

    try {
      setError("");
      setSuccess("");

      await publishAnnouncement(
        announcementId
      );

      setSuccess(
        "Announcement published successfully."
      );

      await loadAnnouncements();
    } catch (err) {
      setError(err.message);
    }
  };

  /* =========================================================
     UNPUBLISH
     ========================================================= */

  const handleUnpublish = async (
    announcementId
  ) => {
    if (!canPublishAnnouncement) {
      setError(
        "You do not have permission to unpublish announcements."
      );

      return;
    }

    try {
      setError("");
      setSuccess("");

      await unpublishAnnouncement(
        announcementId
      );

      setSuccess(
        "Announcement unpublished successfully."
      );

      await loadAnnouncements();
    } catch (err) {
      setError(err.message);
    }
  };

  /* =========================================================
     EVENT NAME
     ========================================================= */

  const getEventName = (
    eventId
  ) => {
    if (!eventId) {
      return "No event linked";
    }

    const event = events.find(
      (item) =>
        item._id ===
        (eventId?._id ||
          eventId)
    );

    return event
      ? event.title
      : "Event not found";
  };

  /* =========================================================
     UI
     ========================================================= */

  return (
    <div className="events-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <header className="page-header">

        <div>

          <p className="eyebrow">
            ClubOps AI
          </p>

          <h1>
            Announcements
          </h1>

          <p>
            Create, manage, and publish
            club announcements.
          </p>

        </div>

      </header>

      {/* ERROR */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {/* =====================================================
          CREATE / EDIT ANNOUNCEMENT
      ===================================================== */}

      {canManageAnnouncements && (
        <section
          className="event-form-section"
          style={mintSectionStyle}
        >

          <div style={formInnerStyle}>

            <h2 style={headingStyle}>
              {editingId
                ? "Edit Announcement"
                : "Create Announcement"}
            </h2>

            <form
              onSubmit={handleSubmit}
            >

              {/* TITLE */}

              <div
                className="form-group"
                style={formGroupStyle}
              >

                <label
                  htmlFor="title"
                  style={labelStyle}
                >
                  Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter announcement title"
                  required
                  style={inputStyle}
                />

              </div>

              {/* CONTENT */}

              <div
                className="form-group"
                style={formGroupStyle}
              >

                <label
                  htmlFor="content"
                  style={labelStyle}
                >
                  Content
                </label>

                <textarea
                  id="content"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Write your announcement..."
                  rows="5"
                  required
                  style={textareaStyle}
                />

              </div>

              {/* EVENT + CREATED BY */}

              <div
                className="form-row"
                style={formRowStyle}
              >

                <div className="form-group">

                  <label
                    htmlFor="eventId"
                    style={labelStyle}
                  >
                    Event
                  </label>

                  <select
                    id="eventId"
                    name="eventId"
                    value={form.eventId}
                    onChange={handleChange}
                    style={inputStyle}
                  >

                    <option value="">
                      No event
                    </option>

                    {events.map(
                      (event) => (
                        <option
                          key={
                            event._id
                          }
                          value={
                            event._id
                          }
                        >
                          {event.title}
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div className="form-group">

                  <label
                    htmlFor="createdBy"
                    style={labelStyle}
                  >
                    Created By
                  </label>

                  <input
                    id="createdBy"
                    name="createdBy"
                    type="text"
                    value={form.createdBy}
                    onChange={handleChange}
                    placeholder="Enter creator name"
                    required
                    style={inputStyle}
                  />

                </div>

              </div>

              {/* BUTTONS */}

              <div
                className="form-actions"
                style={buttonRowStyle}
              >

                <button
                  type="submit"
                >
                  {editingId
                    ? "Update Announcement"
                    : "Create Announcement"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                  >
                    Cancel Edit
                  </button>
                )}

              </div>

            </form>

          </div>

        </section>
      )}

      {/* VIEW ONLY */}

      {!canManageAnnouncements && (
        <div className="empty-state">
          You can view announcements,
          but you do not have permission
          to create or edit them.
        </div>
      )}

      {/* =====================================================
          ALL ANNOUNCEMENTS
      ===================================================== */}

      <section
        className="events-section"
        style={mintSectionStyle}
      >

        <div className="section-heading">

          <h2>
            All Announcements
          </h2>

          <button
            type="button"
            onClick={
              loadAnnouncements
            }
          >
            Refresh
          </button>

        </div>

        {loading ? (

          <p>
            Loading announcements...
          </p>

        ) : announcements.length === 0 ? (

          <p>
            No announcements found.
          </p>

        ) : (

          <div className="events-list">

            {announcements.map(
              (announcement) => (

                <article
                  className="event-card"
                  key={
                    announcement._id
                  }
                >

                  <div className="event-card-content">

                    <div>

                      <h3>
                        {
                          announcement.title
                        }
                      </h3>

                      <p>
                        {
                          announcement.content
                        }
                      </p>

                    </div>

                    <div className="event-details">

                      <p>
                        <strong>
                          Status:
                        </strong>{" "}
                        {
                          announcement.status
                        }
                      </p>

                      <p>
                        <strong>
                          Created By:
                        </strong>{" "}
                        {
                          announcement.createdBy
                        }
                      </p>

                      <p>
                        <strong>
                          Event:
                        </strong>{" "}
                        {getEventName(
                          announcement.eventId
                        )}
                      </p>

                      {announcement.publishedAt && (
                        <p>
                          <strong>
                            Published:
                          </strong>{" "}
                          {new Date(
                            announcement.publishedAt
                          ).toLocaleString()}
                        </p>
                      )}

                      <p>
                        <strong>
                          Created:
                        </strong>{" "}
                        {new Date(
                          announcement.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>

                  </div>

                  {(canEditAnnouncement ||
                    canPublishAnnouncement ||
                    canDeleteAnnouncement) && (

                    <div className="event-actions">

                      {canEditAnnouncement && (
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              announcement
                            )
                          }
                        >
                          Edit
                        </button>
                      )}

                      {canPublishAnnouncement &&
                        announcement.status ===
                          "Draft" && (
                          <button
                            type="button"
                            onClick={() =>
                              handlePublish(
                                announcement._id
                              )
                            }
                          >
                            Publish
                          </button>
                        )}

                      {canPublishAnnouncement &&
                        announcement.status !==
                          "Draft" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleUnpublish(
                                announcement._id
                              )
                            }
                          >
                            Unpublish
                          </button>
                        )}

                      {canDeleteAnnouncement && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              announcement._id
                            )
                          }
                        >
                          Delete
                        </button>
                      )}

                    </div>

                  )}

                </article>

              )
            )}

          </div>

        )}

      </section>

    </div>
  );
}

export default Announcements;