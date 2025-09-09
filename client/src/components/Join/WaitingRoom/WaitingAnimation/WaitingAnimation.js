import { FaClock } from "react-icons/fa";
import './WaitingAnimation.css'

const WaitingAnimation = ({ isDarkTheme }) => {
  return (
    <div className={`waiting-animation ${isDarkTheme ? 'dark-theme' : ''}`}>
      <div className="pulse-circle"></div>
      <div className="clock-icon">
        <FaClock />
      </div>
    </div>
  );
};

export default WaitingAnimation;