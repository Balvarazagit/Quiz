import { FaHashtag, FaUser, FaIdCard } from "react-icons/fa";
import './SessionInfo.css'

const SessionInfo = ({ pin, name, userId, isDarkTheme }) => {
  return (
    <div className={`session-info-card ${isDarkTheme ? 'dark-theme' : ''}`}>
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
  );
};

export default SessionInfo;