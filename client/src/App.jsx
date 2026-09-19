import { useEffect, useState } from "react";
import Events from "./pages/Events";
import Tasks from "./pages/Tasks";
import Deadlines from "./pages/Deadlines";
import Volunteers from "./pages/Volunteers";
import Documents from "./pages/Documents";
import Meetings from "./pages/Meetings";
import Auth from "./pages/Auth";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("events");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("clubops_user");
    const token = localStorage.getItem("clubops_token");

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("clubops_user");
        localStorage.removeItem("clubops_token");
      }
    }
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setActivePage("events");
  };

  const handleLogout = () => {
    localStorage.removeItem("clubops_token");
    localStorage.removeItem("clubops_user");

    setUser(null);
    setActivePage("events");
  };

  const renderPage = () => {
    switch (activePage) {
      case "events":
        return <Events />;

      case "tasks":
        return <Tasks />;

      case "deadlines":
        return <Deadlines />;

      case "volunteers":
        return <Volunteers />;

      case "documents":
        return <Documents />;

      case "meetings":
        return <Meetings />;

      default:
        return <Events />;
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-name">ClubOps AI</span>
          <span className="brand-subtitle">Club Operations</span>
        </div>

        <div className="navbar-links">
          <button
            type="button"
            className={
              activePage === "events"
                ? "nav-button active"
                : "nav-button"
            }
            onClick={() => setActivePage("events")}
          >
            Events
          </button>

          <button
            type="button"
            className={
              activePage === "tasks"
                ? "nav-button active"
                : "nav-button"
            }
            onClick={() => setActivePage("tasks")}
          >
            Tasks
          </button>

          <button
            type="button"
            className={
              activePage === "deadlines"
                ? "nav-button active"
                : "nav-button"
            }
            onClick={() => setActivePage("deadlines")}
          >
            Deadlines
          </button>

          <button
            type="button"
            className={
              activePage === "volunteers"
                ? "nav-button active"
                : "nav-button"
            }
            onClick={() => setActivePage("volunteers")}
          >
            Volunteers
          </button>

          <button
            type="button"
            className={
              activePage === "documents"
                ? "nav-button active"
                : "nav-button"
            }
            onClick={() => setActivePage("documents")}
          >
            Documents
          </button>

          <button
            type="button"
            className={
              activePage === "meetings"
                ? "nav-button active"
                : "nav-button"
            }
            onClick={() => setActivePage("meetings")}
          >
            Meetings
          </button>

          <div className="user-section">
            <span className="user-name">
              {user.name}
            </span>

            <span className="user-role">
              {user.role}
            </span>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main>{renderPage()}</main>
    </div>
  );
}

export default App;