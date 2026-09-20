import { useEffect, useState } from "react";

import {
  loginUser,
  logoutUser,
  getCurrentUser,
  getAuthToken,
} from "../services/authService";

import {
  sendAIMessage,
} from "../services/aiService";

function AIAssistant() {
  const [user, setUser] =
    useState(getCurrentUser());

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loginLoading, setLoginLoading] =
    useState(false);

  const [loginError, setLoginError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([
      {
        role: "assistant",
        text:
          "Hi! I'm ClubOps AI. Ask me about tasks, deadlines, events, meetings, volunteers, or announcements.",
      },
    ]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      setUser(null);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoginError("");

    if (!email.trim() || !password) {
      setLoginError(
        "Email and password are required."
      );
      return;
    }

    setLoginLoading(true);

    try {
      const data =
        await loginUser(
          email.trim(),
          password
        );

      setUser(data.user);

      setPassword("");

      setMessages([
        {
          role: "assistant",
          text:
            `Welcome ${data.user?.name || "to ClubOps"}! 🤖 I'm ready to help.`,
        },
      ]);
    } catch (error) {
      setLoginError(
        error.message ||
          "Login failed."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();

    setUser(null);

    setMessages([
      {
        role: "assistant",
        text:
          "You have been logged out.",
      },
    ]);
  };

  const handleSend = async () => {
    const trimmedMessage =
      message.trim();

    if (
      !trimmedMessage ||
      loading
    ) {
      return;
    }

    setMessages(
      (previous) => [
        ...previous,
        {
          role: "user",
          text: trimmedMessage,
        },
      ]
    );

    setMessage("");
    setLoading(true);

    try {
      const data =
        await sendAIMessage(
          trimmedMessage
        );

      const reply =
        data?.result?.reply ||
        "I completed the request.";

      setMessages(
        (previous) => [
          ...previous,
          {
            role: "assistant",
            text: reply,
          },
        ]
      );
    } catch (error) {
      setMessages(
        (previous) => [
          ...previous,
          {
            role: "assistant",
            text:
              `⚠️ ${error.message}`,
          },
        ]
      );

      if (
        error.message
          ?.toLowerCase()
          .includes("session")
      ) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSend();
    }
  };

  /*
   * LOGIN SCREEN
   */

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          background:
            "#f5f7fb",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "#ffffff",
            padding: "32px",
            borderRadius: "16px",
            boxShadow:
              "0 8px 30px rgba(0,0,0,0.08)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "8px",
              }}
            >
              🤖
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "28px",
              }}
            >
              ClubOps AI
            </h1>

            <p
              style={{
                color: "#666",
                marginTop: "8px",
              }}
            >
              Sign in to use your
              AI event assistant.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
          >
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
              }}
            >
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="you@example.com"
              disabled={
                loginLoading
              }
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "16px",
                border:
                  "1px solid #ccc",
                borderRadius: "8px",
                boxSizing: "border-box",
              }}
            />

            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
              }}
            >
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Password"
              disabled={
                loginLoading
              }
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "16px",
                border:
                  "1px solid #ccc",
                borderRadius: "8px",
                boxSizing: "border-box",
              }}
            />

            {loginError && (
              <div
                style={{
                  padding: "10px",
                  marginBottom: "16px",
                  borderRadius: "8px",
                  background:
                    "#fff0f0",
                  color: "#c62828",
                  fontSize: "14px",
                }}
              >
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={
                loginLoading
              }
              style={{
                width: "100%",
                padding: "13px",
                border: "none",
                borderRadius: "8px",
                background:
                  "#111827",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "600",
                cursor:
                  loginLoading
                    ? "default"
                    : "pointer",
              }}
            >
              {loginLoading
                ? "Signing in..."
                : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /*
   * AI SCREEN
   */

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "#f5f7fb",
        padding: "30px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "20px",
            background:
              "#ffffff",
            padding: "16px 20px",
            borderRadius: "12px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: "700",
              }}
            >
              🤖 ClubOps AI
            </div>

            <div
              style={{
                color: "#666",
                fontSize: "14px",
                marginTop: "4px",
              }}
            >
              Logged in as{" "}
              <strong>
                {user.name}
              </strong>{" "}
              ({user.role})
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding:
                "8px 14px",
              border:
                "1px solid #ddd",
              borderRadius: "8px",
              background:
                "#ffffff",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        <div
          style={{
            background:
              "#ffffff",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow:
              "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              height: "500px",
              overflowY: "auto",
              padding: "20px",
              boxSizing:
                "border-box",
            }}
          >
            {messages.map(
              (item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent:
                      item.role ===
                      "user"
                        ? "flex-end"
                        : "flex-start",
                    marginBottom:
                      "14px",
                  }}
                >
                  <div
                    style={{
                      maxWidth:
                        "75%",
                      padding:
                        "12px 16px",
                      borderRadius:
                        "12px",
                      background:
                        item.role ===
                        "user"
                          ? "#e8f0fe"
                          : "#f1f3f5",
                      whiteSpace:
                        "pre-wrap",
                      lineHeight:
                        "1.5",
                    }}
                  >
                    {item.text}
                  </div>
                </div>
              )
            )}

            {loading && (
              <div
                style={{
                  color: "#666",
                  padding:
                    "10px 0",
                }}
              >
                🤖 ClubOps AI is
                thinking...
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              padding: "14px",
              borderTop:
                "1px solid #eee",
            }}
          >
            <input
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              disabled={loading}
              placeholder="Ask ClubOps AI..."
              style={{
                flex: 1,
                padding: "13px",
                border:
                  "1px solid #ccc",
                borderRadius: "9px",
                fontSize: "15px",
                outline: "none",
              }}
            />

            <button
              onClick={
                handleSend
              }
              disabled={
                loading ||
                !message.trim()
              }
              style={{
                padding:
                  "12px 20px",
                border: "none",
                borderRadius: "9px",
                background:
                  "#111827",
                color:
                  "#ffffff",
                fontWeight:
                  "600",
                cursor:
                  loading
                    ? "default"
                    : "pointer",
              }}
            >
              {loading
                ? "..."
                : "Send"}
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: "16px",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {[
            "Show my tasks",
            "Show overdue tasks",
            "Show upcoming deadlines",
            "What can you do?",
          ].map(
            (suggestion) => (
              <button
                key={suggestion}
                onClick={() =>
                  setMessage(
                    suggestion
                  )
                }
                disabled={loading}
                style={{
                  padding:
                    "8px 12px",
                  border:
                    "1px solid #ddd",
                  borderRadius:
                    "20px",
                  background:
                    "#ffffff",
                  cursor:
                    "pointer",
                }}
              >
                {suggestion}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;