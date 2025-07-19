import React, { useState } from "react";
import { Link } from "react-router-dom";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to send reset link.");
    }
  };

  return (
    <div className="login-container">
      <form className="auth-wrapper" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginBottom: '1rem' }}>
          Enter your registered email address. We'll send you a link to reset your password.
        </p>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          onChange={e => setEmail(e.target.value)}
          required
        />

        <button type="submit">Send Reset Link</button>
        {message && <p className="auth-message success">{message}</p>}
        {error && <p className="auth-message error">{error}</p>}
        <p>
          Back to <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}


export default ForgotPassword;
