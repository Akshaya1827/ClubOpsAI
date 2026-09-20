import { useEffect, useState } from "react";
import {
  getVolunteers,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
} from "../services/api";

function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    availability: "Available",
    status: "Active",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getVolunteers();

      setVolunteers(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      skills: "",
      availability: "Available",
      status: "Active",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      const volunteerData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
        availability: formData.availability,
        status: formData.status,
      };

      if (editingId) {
        await updateVolunteer(editingId, volunteerData);
      } else {
        await createVolunteer(volunteerData);
      }

      resetForm();
      await fetchVolunteers();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (volunteer) => {
    setEditingId(volunteer._id);

    setFormData({
      name: volunteer.name || "",
      email: volunteer.email || "",
      phone: volunteer.phone || "",
      skills: Array.isArray(volunteer.skills)
        ? volunteer.skills.join(", ")
        : "",
      availability: volunteer.availability || "Available",
      status: volunteer.status || "Active",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (volunteerId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this volunteer?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteVolunteer(volunteerId);

      if (editingId === volunteerId) {
        resetForm();
      }

      await fetchVolunteers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Volunteers</h1>
          <p>Manage club volunteers and their availability.</p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={fetchVolunteers}
        >
          Refresh
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <section className="form-card">
        <h2>{editingId ? "Edit Volunteer" : "Add Volunteer"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="volunteer-name">Name</label>

              <input
                id="volunteer-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter volunteer name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="volunteer-email">Email</label>

              <input
                id="volunteer-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="volunteer-phone">Phone</label>

              <input
                id="volunteer-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="volunteer-skills">Skills</label>

              <input
                id="volunteer-skills"
                name="skills"
                type="text"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Marketing, Design, Photography"
              />

              <small>
                Separate multiple skills with commas.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="volunteer-availability">
                Availability
              </label>

              <select
                id="volunteer-availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
              >
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="volunteer-status">Status</label>

              <select
                id="volunteer-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button">
              {editingId ? "Update Volunteer" : "Add Volunteer"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="content-section">
        <div className="section-header">
          <h2>Volunteer List</h2>

          <span className="item-count">
            {volunteers.length} volunteer
            {volunteers.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading volunteers...
          </div>
        ) : volunteers.length === 0 ? (
          <div className="empty-state">
            No volunteers found. Add your first volunteer above.
          </div>
        ) : (
          <div className="card-grid">
            {volunteers.map((volunteer) => (
              <article className="data-card" key={volunteer._id}>
                <div className="card-header">
                  <div>
                    <h3>{volunteer.name}</h3>
                    <p>{volunteer.email}</p>
                  </div>

                  <span
                    className={`status-badge ${
                      volunteer.status === "Active"
                        ? "status-active"
                        : "status-inactive"
                    }`}
                  >
                    {volunteer.status}
                  </span>
                </div>

                <div className="card-details">
                  {volunteer.phone && (
                    <p>
                      <strong>Phone:</strong> {volunteer.phone}
                    </p>
                  )}

                  <p>
                    <strong>Availability:</strong>{" "}
                    {volunteer.availability}
                  </p>

                  <div>
                    <strong>Skills:</strong>

                    {volunteer.skills &&
                    volunteer.skills.length > 0 ? (
                      <div className="skill-list">
                        {volunteer.skills.map((skill, index) => (
                          <span
                            className="skill-tag"
                            key={`${volunteer._id}-${index}`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span> No skills listed</span>
                    )}
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => handleEdit(volunteer)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => handleDelete(volunteer._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Volunteers;
