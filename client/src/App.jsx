import { useState } from "react";
import Events from "./pages/Events";
import Tasks from "./pages/Tasks";
import Deadlines from "./pages/Deadlines";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("events");

  const renderPage = () => {
    switch (activePage) {
      case "events":
        return <Events />;

      case "tasks":
        return <Tasks />;

      case "deadlines":
        return <Deadlines />;

      default:
        return <Events />;
    }
  };

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
            className={activePage === "events" ? "nav-button active" : "nav-button"}
            onClick={() => setActivePage("events")}
          >
            Events
          </button>

          <button
            type="button"
            className={activePage === "tasks" ? "nav-button active" : "nav-button"}
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
        </div>
      </nav>

      <main>{renderPage()}</main>
    </div>
  );
}

export default App;