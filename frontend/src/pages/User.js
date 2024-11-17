import React, { useState } from "react";

const User = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check login status
  const [view, setView] = useState("signin"); // View: 'signin' or 'signup'
  const [user, setUser] = useState({ username: "", password: "" }); // User credentials

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    // Here, you would validate credentials with a backend API
    if (user.username === "testuser" && user.password === "password123") {
      setIsLoggedIn(true);
      alert("Logged in successfully!");
    } else {
      alert("Invalid credentials");
    }
  };

  // Handle signup
  const handleSignup = (e) => {
    e.preventDefault();
    // You'd send these credentials to your backend for registration
    alert(`Account created for ${user.username}`);
    setView("signin"); // Switch back to sign-in after signup
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({ username: "", password: "" });
  };

  return (
    <div style={{ padding: "20px" }}>
      {isLoggedIn ? (
        // Logged-in View
        <div>
          <h1>Welcome, {user.username}!</h1>
          <p>Your password: {user.password}</p>
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
              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  placeholder="Username"
                  value={user.username}
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
                  required
                  style={{ marginBottom: "10px", display: "block" }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  required
                  style={{ marginBottom: "10px", display: "block" }}
                />
                <button type="submit">Sign In</button>
              </form>
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => setView("signup")}
                  style={{ color: "blue", background: "none", border: "none", cursor: "pointer" }}
                >
                  Sign Up
                </button>
              </p>
            </div>
          ) : (
            <div>
              <h1>Sign Up</h1>
              <form onSubmit={handleSignup}>
                <input
                  type="text"
                  placeholder="Username"
                  value={user.username}
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
                  required
                  style={{ marginBottom: "10px", display: "block" }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  required
                  style={{ marginBottom: "10px", display: "block" }}
                />
                <button type="submit">Sign Up</button>
              </form>
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setView("signin")}
                  style={{ color: "blue", background: "none", border: "none", cursor: "pointer" }}
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
