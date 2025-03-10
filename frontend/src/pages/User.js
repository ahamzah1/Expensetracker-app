import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/User.css"; // External CSS file

const User = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState("signin");
  const [user, setUser] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const API_URL = "http://localhost:8080/api";

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, user);
      // Save only the token to sessionStorage
      sessionStorage.setItem("token", response.data);
      setIsLoggedIn(true);
      setError("");
      alert("Logged in successfully!");
    } catch (err) {
      setError("Invalid username or password. Please try again.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/signup`, user);
      setView("signin");
      setError("");
      alert("Account created successfully! Please log in.");
    } catch (err) {
      setError("Signup failed. Username or email might already be taken.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({ username: "", password: "" });

    // Clear only the token from sessionStorage
    sessionStorage.removeItem("token");

    alert("Logged out successfully!");
  };

  return (
    <div className="user-container">
      {isLoggedIn ? (
        <div className="dashboard">
          <h1>Welcome, {user.username}!</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      ) : (
        <div className="auth-container">
          {view === "signin" ? (
            <div className="form-wrapper">
              <h1>Sign In</h1>
              {error && <p className="error">{error}</p>}
              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  placeholder="Username"
                  value={user.username}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  required
                />
                <button type="submit" className="primary-btn">
                  Sign In
                </button>
              </form>
              <p>
                Don't have an account?{" "}
                <span
                  className="link-text"
                  onClick={() => {
                    setView("signup");
                    setError("");
                  }}
                >
                  Sign Up
                </span>
              </p>
            </div>
          ) : (
            <div className="form-wrapper">
              <h1>Sign Up</h1>
              {error && <p className="error">{error}</p>}
              <form onSubmit={handleSignup}>
                <input
                  type="text"
                  placeholder="Username"
                  value={user.username}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={user.email}
                  onChange={(e) =>
                    setUser({ ...user, email: e.target.value })
                  }
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  required
                />
                <button type="submit" className="primary-btn">
                  Sign Up
                </button>
              </form>
              <p>
                Already have an account?{" "}
                <span
                  className="link-text"
                  onClick={() => {
                    setView("signin");
                    setError("");
                  }}
                >
                  Sign In
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default User;