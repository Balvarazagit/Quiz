import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaLock, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { motion } from "framer-motion";
import "../pages/styles/ResetPassword.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("🔐 Passwords don't match!");
      return;
    }

    setIsSubmitting(true);
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
        toast.success("🎉 Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(data.message || "❌ Password reset failed");
      }
    } catch (err) {
      toast.error("🌐 Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 8) return 2;
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return 3;
    return 4;
  };

  const strength = getPasswordStrength();
  const strengthText = ["Very Weak", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["#f44336", "#ff9800", "#ffc107", "#4caf50", "#388e3c"][strength];

  return (
    <div className="quiz-reset-container">
      <motion.div 
        className="quiz-reset-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="quiz-reset-header">
          <div className="quiz-lock-icon">
            <FaLock size={24} />
          </div>
          <h2>Reset Password</h2>
          <p className="quiz-reset-subtitle">Create a new password to continue quizzing</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="quiz-input-group">
            <label htmlFor="password">
              <FaLock className="input-icon" />
              <span>New Password</span>
            </label>
            <div className="quiz-password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                minLength="6"
              />
              <button 
                type="button" 
                className="quiz-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {password && (
              <div className="password-strength-meter">
                <div className="strength-bar" style={{ 
                  width: `${(strength + 1) * 20}%`,
                  backgroundColor: strengthColor
                }}></div>
                <span style={{ color: strengthColor }}>{strengthText}</span>
              </div>
            )}
          </div>

          <div className="quiz-input-group">
            <label htmlFor="confirmPassword">
              <FaCheck className="input-icon" />
              <span>Confirm Password</span>
            </label>
            <div className="quiz-password-input">
              <input
                type={showConfirm ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
              />
              <button 
                type="button" 
                className="quiz-toggle-password"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {confirmPassword && password === confirmPassword && (
              <div className="password-match">
                <FaCheck className="match-icon" /> Passwords match
              </div>
            )}
          </div>

          <motion.button
            type="submit"
            className="quiz-reset-btn"
            disabled={isSubmitting}
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? (
              <span className="quiz-spinner"></span>
            ) : (
              'Reset Password'
            )}
          </motion.button>
        </form>

        <div className="quiz-back-to-login">
          <Link to="/login">
            <FaArrowLeft /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default ResetPassword;