import { FaClock } from "react-icons/fa";
import './WaitingAnimation.css'

const WaitingAnimation = () => {
  return (
    <div className="waiting-animation">
      <div className="pulse-circle"></div>
      <div className="clock-icon">
        <FaClock />
      </div>
    </div>
  );
};

export default WaitingAnimation;