import { useEffect, useState } from "react";
import {
  getVolunteers,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
} from "../services/api";
import { canPerformAction } from "../config/permissions";

function Volunteers({ showToast }) {
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

  const canManageVolunteers =
    canPerformAction(
      userRole,
      "manageVolunteers"
    );

  const canDeleteVolunteer =
    canPerformAction(
      userRole,
      "deleteVolunteer"
    );


  /* =========================================================
     LOAD VOLUNTEERS
     ========================================================= */

  const fetchVolunteers = async (
    showSuccess = false
  ) => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getVolunteers();

      setVolunteers(
        response.data || []
      );

      if (showSuccess && showToast) {
        showToast(
          "Volunteers refreshed successfully."
        );
      }

    } catch (err) {
      setError(err.message);

      if (showToast) {
        showToast(
          err.message ||
            "Failed to load volunteers.",
          "error"
        );
      }

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchVolunteers();
  }, []);


  /* =========================================================
     FORM CHANGE
     ========================================================= */

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value,
    });
  };


  /* =========================================================
     RESET FORM
     ========================================================= */

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


  /* =========================================================
     CREATE / UPDATE VOLUNTEER
     ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canManageVolunteers) {
      const message =
        "You do not have permission to manage volunteers.";

      setError(message);

      if (showToast) {
        showToast(message, "error");
      }

      return;
    }

    try {
      setError("");

      const volunteerData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),

        skills: formData.skills
          .split(",")
          .map((skill) =>
            skill.trim()
          )
          .filter(
            (skill) => skill !== ""
          ),

        availability:
          formData.availability,

        status: formData.status,
      };


      if (editingId) {

        await updateVolunteer(
          editingId,
          volunteerData
        );

        if (showToast) {
          showToast(
            "Volunteer updated successfully."
          );
        }

      } else {

        await createVolunteer(
          volunteerData
        );

        if (showToast) {
          showToast(
            "Volunteer added successfully."
          );
        }

      }


      resetForm();

      await fetchVolunteers();


      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } catch (err) {

      setError(err.message);

      if (showToast) {
        showToast(
          err.message ||
            "Something went wrong.",
          "error"
        );
      }

    }
  };


  /* =========================================================
     EDIT VOLUNTEER
     ========================================================= */

  const handleEdit = (volunteer) => {

    if (!canManageVolunteers) {

      const message =
        "You do not have permission to edit volunteers.";

      setError(message);

      if (showToast) {
        showToast(message, "error");
      }

      return;
    }


    setEditingId(
      volunteer._id
    );


    setFormData({
      name: volunteer.name || "",
      email: volunteer.email || "",
      phone: volunteer.phone || "",

      skills: Array.isArray(
        volunteer.skills
      )
        ? volunteer.skills.join(", ")
        : "",

      availability:
        volunteer.availability ||
        "Available",

      status:
        volunteer.status ||
        "Active",
    });


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* =========================================================
     DELETE VOLUNTEER
     ========================================================= */

  const handleDelete = async (
    volunteerId
  ) => {

    if (!canDeleteVolunteer) {

      const message =
        "You do not have permission to delete volunteers.";

      setError(message);

      if (showToast) {
        showToast(message, "error");
      }

      return;
    }


    const confirmed =
      window.confirm(
        "Are you sure you want to delete this volunteer?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setError("");

      await deleteVolunteer(
        volunteerId
      );


      if (
        editingId === volunteerId
      ) {
        resetForm();
      }


      if (showToast) {
        showToast(
          "Volunteer deleted successfully."
        );
      }


      await fetchVolunteers();

    } catch (err) {

      setError(err.message);

      if (showToast) {
        showToast(
          err.message ||
            "Failed to delete volunteer.",
          "error"
        );
      }

    }
  };


  /* =========================================================
     UI
     ========================================================= */

  return (
    <div className="page-container">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="page-header">

        <div>

          <h1>
            Volunteers
          </h1>

          <p>
            Manage club volunteers and
            their availability.
          </p>

        </div>


        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            fetchVolunteers(true)
          }
        >
          Refresh
        </button>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* =====================================================
          ADD / EDIT FORM
      ===================================================== */}

      {canManageVolunteers && (

        <section className="form-card">

          <h2>
            {editingId
              ? "Edit Volunteer"
              : "Add Volunteer"}
          </h2>


          <form
            onSubmit={handleSubmit}
          >

            <div className="form-grid">

              {/* NAME */}

              <div className="form-group">

                <label htmlFor="volunteer-name">
                  Name
                </label>

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


              {/* EMAIL */}

              <div className="form-group">

                <label htmlFor="volunteer-email">
                  Email
                </label>

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


              {/* PHONE */}

              <div className="form-group">

                <label htmlFor="volunteer-phone">
                  Phone
                </label>

                <input
                  id="volunteer-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />

              </div>


              {/* SKILLS */}

              <div className="form-group">

                <label htmlFor="volunteer-skills">
                  Skills
                </label>

                <input
                  id="volunteer-skills"
                  name="skills"
                  type="text"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Marketing, Design, Photography"
                />

                <small>
                  Separate multiple skills
                  with commas.
                </small>

              </div>


              {/* AVAILABILITY */}

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

                  <option value="Available">
                    Available
                  </option>

                  <option value="Busy">
                    Busy
                  </option>

                  <option value="Unavailable">
                    Unavailable
                  </option>

                </select>

              </div>


              {/* STATUS */}

              <div className="form-group">

                <label htmlFor="volunteer-status">
                  Status
                </label>

                <select
                  id="volunteer-status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>

            </div>


            {/* FORM ACTIONS */}

            <div className="form-actions">

              <button
                type="submit"
                className="primary-button"
              >
                {editingId
                  ? "Update Volunteer"
                  : "Add Volunteer"}
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

      )}


      {/* =====================================================
          VOLUNTEER LIST
      ===================================================== */}

      <section className="content-section">

        <div className="section-header">

          <h2>
            Volunteer List
          </h2>

          <span className="item-count">

            {volunteers.length} volunteer
            {volunteers.length !== 1
              ? "s"
              : ""}

          </span>

        </div>


        {/* ===================================================
            LOADING
        =================================================== */}

        {loading ? (

          <div className="empty-state">
            Loading volunteers...
          </div>

        ) : volunteers.length === 0 ? (

          <div className="empty-state">

            No volunteers found.

            {canManageVolunteers
              ? " Add your first volunteer above."
              : ""}

          </div>

        ) : (

          <div className="card-grid">

            {volunteers.map(
              (volunteer) => (

                <article
                  className="data-card"
                  key={volunteer._id}
                >

                  {/* =========================================
                      CARD HEADER
                  ========================================= */}

                  <div className="card-header">

                    <div>

                      <h3>
                        {volunteer.name}
                      </h3>

                      <p>
                        {volunteer.email}
                      </p>

                    </div>


                    <span
                      className={`status-badge ${
                        volunteer.status ===
                        "Active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      {volunteer.status}
                    </span>

                  </div>


                  {/* =========================================
                      CARD DETAILS
                  ========================================= */}

                  <div className="card-details">

                    {volunteer.phone && (

                      <p>
                        <strong>
                          Phone:
                        </strong>{" "}
                        {volunteer.phone}
                      </p>

                    )}


                    <p>
                      <strong>
                        Availability:
                      </strong>{" "}
                      {volunteer.availability}
                    </p>


                    <div>

                      <strong>
                        Skills:
                      </strong>


                      {volunteer.skills &&
                      volunteer.skills.length >
                        0 ? (

                        <div className="skill-list">

                          {volunteer.skills.map(
                            (
                              skill,
                              index
                            ) => (

                              <span
                                className="skill-tag"
                                key={`${volunteer._id}-${index}`}
                              >
                                {skill}
                              </span>

                            )
                          )}

                        </div>

                      ) : (

                        <span>
                          {" "}
                          No skills listed
                        </span>

                      )}

                    </div>

                  </div>


                  {/* =========================================
                      ACTIONS
                  ========================================= */}

                  {canManageVolunteers && (

                    <div className="card-actions">

                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                          handleEdit(
                            volunteer
                          )
                        }
                      >
                        Edit
                      </button>


                      {canDeleteVolunteer && (

                        <button
                          type="button"
                          className="danger-button"
                          onClick={() =>
                            handleDelete(
                              volunteer._id
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

export default Volunteers;