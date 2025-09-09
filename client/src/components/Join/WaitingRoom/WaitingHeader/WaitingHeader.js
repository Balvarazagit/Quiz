import { FaUsers } from "react-icons/fa";
import './WaitingHeader.css'

const WaitingHeader = ({ players, isDarkTheme }) => {
  return (
    <div className={`waiting-header ${isDarkTheme ? 'dark-theme' : ''}`}>
      <h2>Quiz Session</h2>
      <div className="player-count">
        <FaUsers className="count-icon" />
        <span>{players} Players</span>
      </div>
    </div>
  );
};

export default WaitingHeader;