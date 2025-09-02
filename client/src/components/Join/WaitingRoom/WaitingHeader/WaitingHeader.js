import { FaUsers } from "react-icons/fa";
import './WaitingHeader.css'

const WaitingHeader = ({ players }) => {
  return (
    <div className="waiting-header">
      <h2>Quiz Session</h2>
      <div className="player-count">
        <FaUsers className="count-icon" />
        <span>{players} Players</span>
      </div>
    </div>
  );
};

export default WaitingHeader;