import { useEffect, useState } from "react";
import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  getEvents,
} from "../services/api";
import { canPerformAction } from "../config/permissions";

const API_BASE_URL = "http://localhost:5000";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    eventId: "",
    uploadedBy: "",
    file: null,
  });

  const [editingId, setEditingId] = useState(null);

  /* =========================================================
     USER / PERMISSIONS
     ========================================================= */

  const savedUser = localStorage.getItem("clubops_user");

  let user = null;

  try {
    user = savedUser
      ? JSON.parse(savedUser)
      : null;
  } catch {
    user = null;
  }

  const userRole = user?.role;

  const canUploadDocument = canPerformAction(
    userRole,
    "uploadDocument"
  );

  const canEditDocument = canPerformAction(
    userRole,
    "editDocument"
  );

  const canDeleteDocument = canPerformAction(
    userRole,
    "deleteDocument"
  );

  const canManageDocuments =
    canUploadDocument || canEditDocument;

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
    padding: "30px",
  };

  const inputStyle = {
    background: "rgba(255, 255, 255, 0.82)",
    border:
      "1px solid rgba(65, 139, 112, 0.20)",
    borderRadius: "12px",
  };

  const headingStyle = {
    color: "#173f35",
  };

  /* =========================================================
     LOAD DOCUMENTS
     ========================================================= */

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDocuments();

      setDocuments(data.data || []);
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
      const data = await getEvents();

      setEvents(data.events || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadDocuments();
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
     FILE CHANGE
     ========================================================= */

  const handleFileChange = (event) => {
    const file =
      event.target.files[0] || null;

    setForm((previousForm) => ({
      ...previousForm,
      file,
    }));
  };

  /* =========================================================
     RESET FORM
     ========================================================= */

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      eventId: "",
      uploadedBy: "",
      file: null,
    });

    setEditingId(null);

    const fileInput =
      document.getElementById("file");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  /* =========================================================
     CREATE / UPDATE DOCUMENT
     ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (editingId && !canEditDocument) {
      setError(
        "You do not have permission to edit documents."
      );

      return;
    }

    if (!editingId && !canUploadDocument) {
      setError(
        "You do not have permission to upload documents."
      );

      return;
    }

    try {
      setError("");
      setSuccess("");

      /* EDIT EXISTING DOCUMENT */

      if (editingId) {
        const documentData = {
          name: form.name,
          description: form.description,
          eventId:
            form.eventId || undefined,
          uploadedBy: form.uploadedBy,
        };

        await updateDocument(
          editingId,
          documentData
        );

        setSuccess(
          "Document updated successfully."
        );
      }

      /* UPLOAD NEW DOCUMENT */

      else {
        if (!form.file) {
          setError(
            "Please select a file to upload."
          );

          return;
        }

        await createDocument({
          name: form.name,
          description: form.description,
          eventId: form.eventId,
          uploadedBy: form.uploadedBy,
          file: form.file,
        });

        setSuccess(
          "Document uploaded successfully."
        );
      }

      resetForm();

      await loadDocuments();
    } catch (err) {
      setError(err.message);
    }
  };

  /* =========================================================
     EDIT DOCUMENT
     ========================================================= */

  const handleEdit = (document) => {
    if (!canEditDocument) {
      setError(
        "You do not have permission to edit documents."
      );

      return;
    }

    setEditingId(document._id);

    setForm({
      name: document.name || "",
      description:
        document.description || "",
      eventId:
        document.eventId || "",
      uploadedBy:
        document.uploadedBy || "",
      file: null,
    });

    setSuccess("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     DELETE DOCUMENT
     ========================================================= */

  const handleDelete = async (
    documentId
  ) => {
    if (!canDeleteDocument) {
      setError(
        "You do not have permission to delete documents."
      );

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteDocument(documentId);

      setSuccess(
        "Document deleted successfully."
      );

      await loadDocuments();
    } catch (err) {
      setError(err.message);
    }
  };

  /* =========================================================
     EVENT NAME
     ========================================================= */

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

  /* =========================================================
     FILE URL
     ========================================================= */

  const getFileUrl = (fileUrl) => {
    if (!fileUrl) {
      return "";
    }

    if (fileUrl.startsWith("http")) {
      return fileUrl;
    }

    return `${API_BASE_URL}${fileUrl}`;
  };

  /* =========================================================
     UI
     ========================================================= */

  return (
    <div className="documents-page">

      <header className="page-header">

        <div>

          <p className="eyebrow">
            ClubOps AI
          </p>

          <h1>
            Documents
          </h1>

          <p>
            Upload and manage club documents
            and event files.
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
          UPLOAD / EDIT DOCUMENT
      ===================================================== */}

      {canManageDocuments && (
        <section
          className="event-form-section"
          style={mintSectionStyle}
        >

          <h2 style={headingStyle}>
            {editingId
              ? "Edit Document"
              : "Upload Document"}
          </h2>

          <form onSubmit={handleSubmit}>

            {/* DOCUMENT NAME */}

            <div className="form-group">

              <label htmlFor="name">
                Document Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter document name"
                required
                style={inputStyle}
              />

            </div>

            {/* DESCRIPTION */}

            <div className="form-group">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter document description"
                rows="4"
                style={inputStyle}
              />

            </div>

            {/* EVENT + UPLOADED BY */}

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
                  style={inputStyle}
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

                <label htmlFor="uploadedBy">
                  Uploaded By
                </label>

                <input
                  id="uploadedBy"
                  name="uploadedBy"
                  type="text"
                  value={form.uploadedBy}
                  onChange={handleChange}
                  placeholder="Enter uploader name"
                  style={inputStyle}
                />

              </div>

            </div>

            {/* FILE */}

            {!editingId && (
              <div className="form-group">

                <label htmlFor="file">
                  File
                </label>

                <input
                  id="file"
                  name="file"
                  type="file"
                  onChange={handleFileChange}
                  required
                  style={inputStyle}
                />

                {form.file && (
                  <p>
                    Selected file:{" "}
                    <strong>
                      {form.file.name}
                    </strong>
                  </p>
                )}

              </div>
            )}

            {/* EDIT FILE MESSAGE */}

            {editingId && (
              <p>
                The existing uploaded file will
                be kept. File replacement is not
                supported by the current backend
                update route.
              </p>
            )}

            {/* BUTTONS */}

            <div className="form-actions">

              <button type="submit">
                {editingId
                  ? "Update Document"
                  : "Upload Document"}
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

      {/* VIEW ONLY */}

      {!canManageDocuments && (
        <div className="empty-state">
          You can view and open documents,
          but you do not have permission to
          upload or edit them.
        </div>
      )}

      {/* =====================================================
          ALL DOCUMENTS
      ===================================================== */}

      <section
        className="events-section"
        style={mintSectionStyle}
      >

        <div className="section-heading">

          <h2>
            All Documents
          </h2>

          <button
            type="button"
            onClick={loadDocuments}
          >
            Refresh
          </button>

        </div>

        {loading ? (

          <p>
            Loading documents...
          </p>

        ) : documents.length === 0 ? (

          <p>
            No documents found.
          </p>

        ) : (

          <div className="events-list">

            {documents.map((document) => (

              <article
                className="event-card"
                key={document._id}
              >

                <div className="event-card-content">

                  <h3>
                    {document.name}
                  </h3>

                  <p>
                    {document.description ||
                      "No description provided."}
                  </p>

                  <div className="event-details">

                    <span>
                      Event:{" "}
                      {getEventName(
                        document.eventId
                      )}
                    </span>

                    <span>
                      File Type:{" "}
                      {document.fileType ||
                        "Not specified"}
                    </span>

                    <span>
                      Uploaded By:{" "}
                      {document.uploadedBy ||
                        "Not specified"}
                    </span>

                    <span>
                      Uploaded:{" "}
                      {document.createdAt
                        ? new Date(
                            document.createdAt
                          ).toLocaleString()
                        : "Date not available"}
                    </span>

                  </div>

                </div>

                <div className="event-actions">

                  {/* OPEN */}

                  {document.fileUrl && (
                    <a
                      href={getFileUrl(
                        document.fileUrl
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open
                    </a>
                  )}

                  {/* EDIT */}

                  {canEditDocument && (
                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(
                          document
                        )
                      }
                    >
                      Edit
                    </button>
                  )}

                  {/* DELETE */}

                  {canDeleteDocument && (
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          document._id
                        )
                      }
                    >
                      Delete
                    </button>
                  )}

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default Documents;