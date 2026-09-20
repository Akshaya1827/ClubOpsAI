import { useState } from "react";
import { loginUser, registerUser } from "../services/api";

function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        const data = await loginUser({
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("clubops_token", data.token);
        localStorage.setItem("clubops_user", JSON.stringify(data.user));

        onLogin(data.user);
      } else {
        await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        setSuccess("Registration successful. You can now log in.");

        setMode("login");

        setFormData({
          name: "",
          email: formData.email,
          password: "",
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(isLogin ? "register" : "login");
    setError("");
    setSuccess("");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>ClubOps AI</h1>
          <p>Club Operations Management</p>
        </div>

        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

        <p className="auth-subtitle">
          {isLogin
            ? "Sign in to manage your club operations."
            : "Create your ClubOps AI account."}
        </p>

        {error && <div className="auth-message error">{error}</div>}

        {success && (
          <div className="auth-message success">{success}</div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Name</label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="primary-button auth-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
                ? "Login"
                : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          <span>
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>

          <button type="button" onClick={switchMode}>
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;