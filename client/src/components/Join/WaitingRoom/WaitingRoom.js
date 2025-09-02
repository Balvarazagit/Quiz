import { motion } from "framer-motion";
import { FaHashtag, FaUser, FaIdCard, FaClock, FaUsers } from "react-icons/fa";
import "./WaitingRoom.css";

const WaitingRoom = ({ pin, name, userId, players = 12 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="waiting-room"
    >
      <div className="waiting-content">
        <div className="waiting-header">
          <h2>Quiz Session</h2>
          <div className="player-count">
            <FaUsers className="count-icon" />
            <span>{players} Players</span>
          </div>
        </div>
        
        <div className="waiting-animation">
          <div className="pulse-circle"></div>
          <div className="clock-icon">
            <FaClock />
          </div>
        </div>
        
        <h3 className="waiting-title">Waiting for Host</h3>
        <p className="waiting-message">The quiz will begin shortly</p>
        
        <div className="session-info-card">
          <div className="info-list">
            <div className="info-item">
              <div className="info-icon">
                <FaHashtag />
              </div>
              <div className="info-content">
                <span className="info-label">Game PIN</span>
                <span className="info-value">{pin}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">
                <FaUser />
              </div>
              <div className="info-content">
                <span className="info-label">Player</span>
                <span className="info-value">{name}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">
                <FaIdCard />
              </div>
              <div className="info-content">
                <span className="info-label">ID</span>
                <span className="info-value">{userId}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="progress-container">
          <div className="progress-bar">
            <motion.div 
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            />
          </div>
          <p className="progress-text">Waiting for host to start the game...</p>
        </div>
      </div>
    </motion.div>
  );
};

export default WaitingRoom;