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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0] || null;

    setForm((previousForm) => ({
      ...previousForm,
      file,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      eventId: "",
      uploadedBy: "",
      file: null,
    });

    setEditingId(null);

    const fileInput = document.getElementById("file");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Permission checks
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

      // Editing an existing document
      if (editingId) {
        const documentData = {
          name: form.name,
          description: form.description,
          eventId: form.eventId || undefined,
          uploadedBy: form.uploadedBy,
        };

        await updateDocument(editingId, documentData);

        setSuccess(
          "Document updated successfully."
        );
      } else {
        // Uploading a new document
        if (!form.file) {
          setError("Please select a file to upload.");
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
      description: document.description || "",
      eventId: document.eventId || "",
      uploadedBy: document.uploadedBy || "",
      file: null,
    });

    setSuccess("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (documentId) => {
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

  const getFileUrl = (fileUrl) => {
    if (!fileUrl) {
      return "";
    }

    if (fileUrl.startsWith("http")) {
      return fileUrl;
    }

    return `${API_BASE_URL}${fileUrl}`;
  };

  return (
    <div className="documents-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">ClubOps AI</p>

          <h1>Documents</h1>

          <p>
            Upload and manage club documents and event files.
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

      {/* Upload / Edit form */}
      {canManageDocuments && (
        <section className="event-form-section">
          <h2>
            {editingId
              ? "Edit Document"
              : "Upload Document"}
          </h2>

          <form onSubmit={handleSubmit}>
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
              />
            </div>

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
                />
              </div>
            </div>

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

            {editingId && (
              <p>
                The existing uploaded file will be kept.
                File replacement is not supported by the
                current backend update route.
              </p>
            )}

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

      {/* Volunteer information */}
      {!canManageDocuments && (
        <div className="empty-state">
          You can view and open documents, but you do not
          have permission to upload or edit them.
        </div>
      )}

      <section className="events-section">
        <div className="section-heading">
          <h2>All Documents</h2>

          <button
            type="button"
            onClick={loadDocuments}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading documents...</p>
        ) : documents.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          <div className="events-list">
            {documents.map((document) => (
              <article
                className="event-card"
                key={document._id}
              >
                <div className="event-card-content">
                  <h3>{document.name}</h3>

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
                  {/* Everyone can open/view the document */}
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

                  {/* Coordinator + Admin */}
                  {canEditDocument && (
                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(document)
                      }
                    >
                      Edit
                    </button>
                  )}

                  {/* Admin only */}
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