import React, { useState, useEffect } from "react";
import axios from "axios";

const User = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check login status
  const [view, setView] = useState("signin"); // View: 'signin' or 'signup'
  const [user, setUser] = useState({ username: "", password: "" }); // User credentials
  const [error, setError] = useState(""); // Error message state

  // Backend API URL
  const API_URL = "http://localhost:8000/api"; // Change to your backend's URL

  // Check session on load
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const savedUser = sessionStorage.getItem("user");
    if (token && savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser)); // Restore user data
    }
  }, []);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, user);
      const { token } = response.data;

      // Save token and user to sessionStorage
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      setIsLoggedIn(true);
      setError(""); // Clear errors
      alert("Logged in successfully!");
    } catch (err) {
      setError("Invalid username or password. Please try again.");
    }
  };

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/signup`, user);
      setView("signin"); // Switch to sign-in view
      setError(""); // Clear errors
      alert("Account created successfully! Please log in.");
    } catch (err) {
      setError("Signup failed. Username might already be taken.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({ username: "", password: "" });
    sessionStorage.clear(); // Clear session storage
    alert("Logged out successfully!");
  };

  return (
    <div style={{ padding: "20px" }}>
      {isLoggedIn ? (
        // Logged-in View
        <div>
          <h1>Welcome, {user.username}!</h1>
          <button onClick={handleLogout} style={{ marginTop: "10px" }}>
            Log Out
          </button>
        </div>
      ) : (
        // Not Logged-in View
        <div>
          {view === "signin" ? (
            <div>
              <h1>Sign In</h1>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  placeholder="Username"
                  value={user.username}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                  required
                  style={{ marginBottom: "10px", display: "block" }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  required
                  style={{ marginBottom: "10px", display: "block" }}
                />
                <button type="submit">Sign In</button>
              </form>
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    setView("signup");
                    setError(""); // Clear errors when switching views
                  }}
                  style={{
                    color: "blue",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Sign Up
                </button>
              </p>
            </div>
          ) : (
            <div>
              <h1>Sign Up</h1>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <form onSubmit={handleSignup}>
                <input
                  type="text"
                  placeholder="Username"
                  value={user.username}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                  required
                  style={{ marginBottom: "10px", display: "block" }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  required
                  style={{ marginBottom: "10px", display: "block" }}
                />
                <button type="submit">Sign Up</button>
              </form>
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setView("signin");
                    setError(""); // Clear errors when switching views
                  }}
                  style={{
                    color: "blue",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Sign In
                </button>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default User;
