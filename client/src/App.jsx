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
import EventDetails from "./pages/EventDetails";
import Tasks from "./pages/Tasks";
import Deadlines from "./pages/Deadlines";
import Volunteers from "./pages/Volunteers";
import Documents from "./pages/Documents";
import Meetings from "./pages/Meetings";
import Announcements from "./pages/Announcements";
import Auth from "./pages/Auth";

import AIAssistant from "./components/AIAssistant";
import Toast from "./components/Toast";

import {
  canAccessPage,
  getRoleLabel,
} from "./config/permissions";

import "./App.css";

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
    key: "meetings",
    label: "Meetings",
    path: "/meetings",
  },
];

const MORE_ITEMS = [
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
    key: "announcements",
    label: "Announcements",
    path: "/announcements",
  },
];

const FUTURE_ITEMS = [
  {
    key: "about",
    label: "About",
    path: "/about",
  },
  {
    key: "contact",
    label: "Contact Us",
    path: "/contact",
  },
];

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

function ProtectedApp({
  user,
  onLogout,
  toast,
  clearToast,
  showToast,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [moreOpen, setMoreOpen] = useState(false);

  const allExistingItems = [
    ...NAV_ITEMS,
    ...MORE_ITEMS,
  ];

  const currentNavItem = allExistingItems.find(
    (item) => item.path === location.pathname
  );

  const activePage = currentNavItem?.key || "";

  const visibleNavItems = NAV_ITEMS.filter((item) =>
    canAccessPage(user.role, item.key)
  );

  const visibleMoreItems = MORE_ITEMS.filter((item) =>
    canAccessPage(user.role, item.key)
  );

  const isMoreActive = visibleMoreItems.some(
    (item) => item.path === location.pathname
  );

  useEffect(() => {
    if (isMoreActive) {
      setMoreOpen(true);
    }
  }, [isMoreActive]);

  useEffect(() => {
    const currentItem = allExistingItems.find(
      (item) => item.path === location.pathname
    );

    const futurePath = FUTURE_ITEMS.some(
      (item) => item.path === location.pathname
    );

    if (futurePath) {
      return;
    }

    /*
      Event detail pages such as /events/:eventId
      are handled separately and should not be
      redirected to Dashboard.
    */
    const isEventDetailsPage =
      location.pathname.startsWith("/events/") &&
      location.pathname !== "/events";

    if (isEventDetailsPage) {
      return;
    }

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

  const handleLogout = () => {
    localStorage.removeItem("clubops_token");
    localStorage.removeItem("clubops_user");

    onLogout();

    navigate("/", {
      replace: true,
    });
  };

  const handlePageChange = (item) => {
    if (!canAccessPage(user.role, item.key)) {
      return;
    }

    if (location.pathname === item.path) {
      return;
    }

    navigate(item.path);
  };

  const handleFuturePage = (path) => {
    navigate(path);
  };

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={clearToast}
      />

      <div className="app">
        <nav className="navbar">
          <div className="navbar-brand">
            <span className="brand-name">
              ClubOps AI
            </span>

            <span className="brand-subtitle">
              Club Operations
            </span>
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
                onClick={() =>
                  handlePageChange(item)
                }
              >
                {item.label}
              </button>
            ))}

            {visibleMoreItems.length > 0 && (
              <>
                <button
                  type="button"
                  className={
                    isMoreActive
                      ? "nav-button active"
                      : "nav-button"
                  }
                  onClick={() =>
                    setMoreOpen(
                      (current) => !current
                    )
                  }
                >
                  <span>More</span>

                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "12px",
                    }}
                  >
                    {moreOpen ? "▲" : "▼"}
                  </span>
                </button>

                {moreOpen && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      marginLeft: "12px",
                      marginTop: "-4px",
                      marginBottom: "8px",
                    }}
                  >
                    {visibleMoreItems.map((item) => (
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
                        style={{
                          fontSize: "14px",
                          paddingLeft: "28px",
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {FUTURE_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={
                  activePage === item.key
                    ? "nav-button active"
                    : "nav-button"
                }
                onClick={() =>
                  handleFuturePage(item.path)
                }
              >
                {item.label}
              </button>
            ))}
          </div>

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

        <main>
          <Routes>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/events"
              element={
                <Events
                  showToast={showToast}
                />
              }
            />

            <Route
              path="/events/:eventId"
              element={<EventDetails />}
            />

            <Route
              path="/tasks"
              element={
                <Tasks
                  showToast={showToast}
                />
              }
            />

            <Route
              path="/deadlines"
              element={
                <Deadlines
                  showToast={showToast}
                />
              }
            />

            <Route
              path="/volunteers"
              element={
                <Volunteers
                  showToast={showToast}
                />
              }
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
              path="/about"
              element={
                <div className="page-container">
                  <section className="content-section">
                    <h1>About</h1>

                    <p>
                      About ClubOps AI will be added
                      here.
                    </p>
                  </section>
                </div>
              }
            />

            <Route
              path="/contact"
              element={
                <div className="page-container">
                  <section className="content-section">
                    <h1>Contact Us</h1>

                    <p>
                      Contact information will be
                      added here.
                    </p>
                  </section>
                </div>
              }
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

        {/* AI Assistant from main branch */}
        <AIAssistant />
      </div>
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const showToast = (
    message,
    type = "success"
  ) => {
    setToast({
      message,
      type,
    });
  };

  const clearToast = () => {
    setToast({
      message: "",
      type: "success",
    });
  };

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

  const handleLogin = (
    loggedInUser
  ) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

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

  return (
    <BrowserRouter>
      <Routes>
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
                onLogin={
                  handleLogin
                }
              />
            )
          }
        />

        <Route
          path="/*"
          element={
            <ProtectedRoute
              user={user}
            >
              <ProtectedApp
                user={user}
                onLogout={
                  handleLogout
                }
                toast={toast}
                clearToast={
                  clearToast
                }
                showToast={
                  showToast
                }
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;