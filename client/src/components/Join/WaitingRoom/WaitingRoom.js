import './WaitingRoom.css';
import { motion } from "framer-motion";

const WaitingRoom = ({ pin, name, userId }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="waiting-room"
    >
      <div className="waiting-content">
        <div className="waiting-animation">
          <div className="pulse-circle"></div>
          <svg className="waiting-icon" viewBox="0 0 24 24">
            <path fill="#4CAF50" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        </div>
        <h3 className="waiting-title">Waiting for Host</h3>
        <p className="waiting-message">The quiz will begin shortly</p>
        
        <div className="session-info-card">
          <div className="info-list">
            <div className="info-item">
              <div className="info-icon">🔢</div>
              <div className="info-content">
                <span className="info-label-join">Game PIN</span>
                <span className="info-value">{pin}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">👤</div>
              <div className="info-content">
                <span className="info-label-join">Player</span>
                <span className="info-value">{name}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">🆔</div>
              <div className="info-content">
                <span className="info-label-join">ID</span>
                <span className="info-value">{userId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WaitingRoom;