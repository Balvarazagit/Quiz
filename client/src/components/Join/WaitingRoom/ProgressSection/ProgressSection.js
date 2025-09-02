import { motion } from "framer-motion";
import './ProgressSection.css'

const ProgressSection = () => {
  return (
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
  );
};

export default ProgressSection;