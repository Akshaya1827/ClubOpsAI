import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getEvents,
} from "../services/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    event: "",
    priority: "medium",
    status: "todo",
    dueDate: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [taskData, eventData] = await Promise.all([
        getTasks(),
        getEvents(),
      ]);

      setTasks(taskData.tasks);
      setEvents(eventData.events);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      event: "",
      priority: "medium",
      status: "todo",
      dueDate: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      if (!form.event) {
        setError("Please select an event.");
        return;
      }

      const taskData = {
        title: form.title,
        description: form.description,
        event: form.event,
        priority: form.priority,
        status: form.status,
        dueDate: new Date(form.dueDate).toISOString(),
      };

      if (editingId) {
        await updateTask(editingId, taskData);
      } else {
        await createTask(taskData);
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (task) => {
  setEditingId(task._id);

  const eventId =
    typeof task.event === "object" ? task.event._id : task.event;

  setForm({
    title: task.title || "",
    description: task.description || "",
    event: eventId || "",
    priority: task.priority || "medium",
    status: task.status || "todo",
    dueDate: task.dueDate
      ? new Date(task.dueDate).toISOString().slice(0, 16)
      : "",
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteTask(taskId);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const getEventTitle = (event) => {
    if (!event) {
      return "No event";
    }

    if (typeof event === "object") {
      return event.title;
    }

    const matchingEvent = events.find(
      (item) => item._id === event
    );

    return matchingEvent ? matchingEvent.title : "Unknown event";
  };

  return (
    <div className="events-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">ClubOps AI</p>
          <h1>Tasks</h1>
          <p>Manage tasks, priorities, statuses, and deadlines.</p>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <section className="event-form-section">
        <h2>{editingId ? "Edit Task" : "Create Task"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Task Title</label>

            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="event">Event</label>

              <select
                id="event"
                name="event"
                value={form.event}
                onChange={handleChange}
                required
              >
                <option value="">Select an event</option>

                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>

              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>

              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>

              <input
                id="dueDate"
                name="dueDate"
                type="datetime-local"
                value={form.dueDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit">
              {editingId ? "Update Task" : "Create Task"}
            </button>

            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="events-section">
        <div className="section-heading">
          <h2>All Tasks</h2>

          <button type="button" onClick={loadData}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <div className="events-list">
            {tasks.map((task) => (
              <article className="event-card" key={task._id}>
                <div className="event-card-content">
                  <h3>{task.title}</h3>

                  <p>
                    {task.description ||
                      "No description provided."}
                  </p>

                  <div className="event-details">
                    <span>
                      📌 Event: {getEventTitle(task.event)}
                    </span>

                    <span>
                      🎯 Priority: {task.priority}
                    </span>

                    <span>
                      📋 Status: {task.status}
                    </span>

                    <span>
                      ⏰ Due:{" "}
                      {new Date(
                        task.dueDate
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="event-actions">
                  <button
                    type="button"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(task._id)}
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

export default Tasks;