import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "react-toastify/dist/ReactToastify.css";
import "../pages/styles/auth.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setTimeout(() => navigate("/login"), 2000); // Redirect after 2s
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error("Reset failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="auth-wrapper">
        <h2>🔒 Reset Your Password</h2>

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
          <span onClick={() => setShowPassword(!showPassword)} className="eye-icon">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="password-field">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
          <span onClick={() => setShowConfirm(!showConfirm)} className="eye-icon">
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit">Reset Password</button>

         <p>
          Back to <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default ResetPassword;
