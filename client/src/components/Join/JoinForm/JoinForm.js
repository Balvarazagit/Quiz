import { motion } from "framer-motion";
import './JoinForm.css'

const JoinForm = ({ pin, setPin, name, setName, error, joinQuiz }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="join-section"
    >
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">Join Quiz Session</h2>
          <p className="form-subtitle">Enter your details to participate</p>
        </div>

        <div className="form-group">
          <label className="input-label">Your Name</label>
          <div className="input-container">
            <svg className="input-icon-join" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => { setName(e.target.value); }}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="input-label">Game PIN</label>
          <div className="input-container">
            <svg className="input-icon-join" viewBox="0 0 24 24">
              <path d="M17 10h-4V8.86c1.72-.45 3-2 3-3.86h-2c0 1.1-.9 2-2 2s-2-.9-2-2H6c0 1.86 1.28 3.41 3 3.86V10H7c-1.1 0-2 .9-2 2v9h14v-9c0-1.1-.9-2-2-2zm-5 3c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
            </svg>
            <input
              type="text"
              placeholder="123456"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        {error && (
          <div className="error-notice">
            <svg className="error-icon" viewBox="0 0 24 24">
              <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          onClick={joinQuiz}
          className="primary-action"
        >
          Join Now
          <svg className="action-icon" viewBox="0 0 24 24">
            <path fill="#FFFFFF" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default JoinForm;