import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowRight, FaKey } from "react-icons/fa";
import { motion } from "framer-motion";
import "../pages/styles/ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);
    
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
        setMessage(data.message || "Password reset link sent successfully!");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Failed to send reset link. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="quiz-forgot-container">
      <motion.div 
        className="quiz-forgot-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="quiz-forgot-header">
          <div className="quiz-key-icon">
            <FaKey size={24} />
          </div>
          <h2>Reset Your Password</h2>
          <p className="quiz-forgot-subtitle">
            Enter your email to receive a reset link and get back to quizzing!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="quiz-input-group">
            <label htmlFor="email">
              <FaEnvelope className="forgot-input-icon" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
              <>
                Send Reset Link <FaArrowRight />
              </>
            )}
          </motion.button>

          {message && (
            <motion.div 
              className="quiz-message success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ✅ {message}
            </motion.div>
          )}
          {error && (
            <motion.div 
              className="quiz-message error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ❌ {error}
            </motion.div>
          )}
        </form>

        <div className="quiz-back-to-login">
          <Link to="/login">
            <FaArrowRight className="arrow-left" /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;