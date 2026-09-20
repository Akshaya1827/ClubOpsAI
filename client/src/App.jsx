import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";
import Events from "./pages/Events";
import Tasks from "./pages/Tasks";
import Deadlines from "./pages/Deadlines";
import Volunteers from "./pages/Volunteers";
import Documents from "./pages/Documents";
import Meetings from "./pages/Meetings";
import Announcements from "./pages/Announcements";
import Auth from "./pages/Auth";
import {
  canAccessPage,
  getRoleLabel,
} from "./config/permissions";
import "./App.css";

const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
  },
  {
    key: "events",
    label: "Events",
  },
  {
    key: "tasks",
    label: "Tasks",
  },
  {
    key: "deadlines",
    label: "Deadlines",
  },
  {
    key: "volunteers",
    label: "Volunteers",
  },
  {
    key: "documents",
    label: "Documents",
  },
  {
    key: "meetings",
    label: "Meetings",
  },
  {
    key: "announcements",
    label: "Announcements",
  },
];

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("clubops_user");
    const token = localStorage.getItem("clubops_token");

    if (savedUser && token) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        if (!canAccessPage(parsedUser.role, "dashboard")) {
          setActivePage("events");
        }
      } catch {
        localStorage.removeItem("clubops_user");
        localStorage.removeItem("clubops_token");
      }
    }
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);

    if (canAccessPage(loggedInUser.role, "dashboard")) {
      setActivePage("dashboard");
    } else {
      setActivePage("events");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("clubops_token");
    localStorage.removeItem("clubops_user");

    setUser(null);
    setActivePage("dashboard");
  };

  const handlePageChange = (page) => {
    if (!user) {
      return;
    }

    if (!canAccessPage(user.role, page)) {
      return;
    }

    setActivePage(page);
  };

  const renderPage = () => {
    if (!user) {
      return null;
    }

    if (!canAccessPage(user.role, activePage)) {
      return <Dashboard />;
    }

    switch (activePage) {
      case "dashboard":
        return <Dashboard />;

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

      case "announcements":
        return <Announcements />;

      default:
        return <Dashboard />;
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const visibleNavItems = NAV_ITEMS.filter((item) =>
    canAccessPage(user.role, item.key)
  );

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-name">ClubOps AI</span>
          <span className="brand-subtitle">Club Operations</span>
        </div>

        <div className="navbar-links">
          {visibleNavItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={
                activePage === item.key
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() => handlePageChange(item.key)}
            >
              {item.label}
            </button>
          ))}

          <div className="user-section">
            <span className="user-name">{user.name}</span>

            <span className="user-role">
              {getRoleLabel(user.role)}
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