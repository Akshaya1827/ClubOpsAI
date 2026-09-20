import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
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


/* =========================================================
   NAVIGATION ITEMS
   ========================================================= */

const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    key: "events",
    label: "Events",
    path: "/events",
  },
  {
    key: "tasks",
    label: "Tasks",
    path: "/tasks",
  },
  {
    key: "deadlines",
    label: "Deadlines",
    path: "/deadlines",
  },
  {
    key: "volunteers",
    label: "Volunteers",
    path: "/volunteers",
  },
  {
    key: "documents",
    label: "Documents",
    path: "/documents",
  },
  {
    key: "meetings",
    label: "Meetings",
    path: "/meetings",
  },
  {
    key: "announcements",
    label: "Announcements",
    path: "/announcements",
  },
];


/* =========================================================
   PROTECTED ROUTE
   ========================================================= */

function ProtectedRoute({ user, children }) {
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}


/* =========================================================
   PROTECTED APPLICATION
   ========================================================= */

function ProtectedApp({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentNavItem = NAV_ITEMS.find(
    (item) => item.path === location.pathname
  );

  const activePage = currentNavItem?.key || "dashboard";

  const visibleNavItems = NAV_ITEMS.filter((item) =>
    canAccessPage(user.role, item.key)
  );


  /* =======================================================
     CHECK PAGE PERMISSION
     ======================================================= */

  useEffect(() => {
    const currentItem = NAV_ITEMS.find(
      (item) => item.path === location.pathname
    );

    if (!currentItem) {
      navigate("/dashboard", {
        replace: true,
      });

      return;
    }

    if (!canAccessPage(user.role, currentItem.key)) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [
    location.pathname,
    user.role,
    navigate,
  ]);


  /* =======================================================
     LOGOUT
     ======================================================= */

  const handleLogout = () => {
    localStorage.removeItem("clubops_token");
    localStorage.removeItem("clubops_user");

    onLogout();

    navigate("/", {
      replace: true,
    });
  };


  /* =======================================================
     SIDEBAR NAVIGATION
     ======================================================= */

  const handlePageChange = (item) => {
    if (!canAccessPage(user.role, item.key)) {
      return;
    }

    if (location.pathname === item.path) {
      return;
    }

    navigate(item.path);
  };


  return (
    <div className="app">

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <nav className="navbar">

        <div className="navbar-brand">
          <span className="brand-name">
            ClubOps AI
          </span>

          <span className="brand-subtitle">
            Club Operations
          </span>
        </div>


        {/* =================================================
            NAVIGATION
        ================================================= */}

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
              onClick={() =>
                handlePageChange(item)
              }
            >
              {item.label}
            </button>
          ))}

        </div>


        {/* =================================================
            USER
        ================================================= */}

        <div className="user-section">

          <span className="user-name">
            {user.name}
          </span>

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

      </nav>


      {/* ===================================================
          PAGE CONTENT
      =================================================== */}

      <main>

        <Routes>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/events"
            element={<Events />}
          />

          <Route
            path="/tasks"
            element={<Tasks />}
          />

          <Route
            path="/deadlines"
            element={<Deadlines />}
          />

          <Route
            path="/volunteers"
            element={<Volunteers />}
          />

          <Route
            path="/documents"
            element={<Documents />}
          />

          <Route
            path="/meetings"
            element={<Meetings />}
          />

          <Route
            path="/announcements"
            element={<Announcements />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

        </Routes>

      </main>

    </div>
  );
}


/* =========================================================
   ROOT APP
   ========================================================= */

function App() {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);


  /* =======================================================
     LOAD SESSION
     ======================================================= */

  useEffect(() => {

    const savedUser =
      localStorage.getItem("clubops_user");

    const token =
      localStorage.getItem("clubops_token");


    if (savedUser && token) {

      try {

        const parsedUser =
          JSON.parse(savedUser);

        setUser(parsedUser);

      } catch {

        localStorage.removeItem(
          "clubops_user"
        );

        localStorage.removeItem(
          "clubops_token"
        );

      }

    }

    setLoading(false);

  }, []);


  /* =======================================================
     LOGIN
     ======================================================= */

  const handleLogin = (loggedInUser) => {

    setUser(loggedInUser);

  };


  /* =======================================================
     LOGOUT
     ======================================================= */

  const handleLogout = () => {

    setUser(null);

  };


  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f3ec",
          color: "#285f50",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        Loading ClubOps AI...
      </div>
    );

  }


  /* =======================================================
     APPLICATION ROUTER
     ======================================================= */

  return (
    <BrowserRouter>

      <Routes>

        {/* ================================================
            LOGIN / AUTH
        ================================================= */}

        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Auth
                onLogin={handleLogin}
              />
            )
          }
        />


        {/* ================================================
            PROTECTED APPLICATION
        ================================================= */}

        <Route
          path="/*"
          element={
            <ProtectedRoute user={user}>
              <ProtectedApp
                user={user}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;