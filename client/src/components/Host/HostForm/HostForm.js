// components/host/HostForm.js
import { FaPlay } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './HostForm.css'

const HostForm = ({ quizId, setQuizId, hostQuiz }) => {
  return (
    <div className="host-form">
      <div>
        <label>Quiz ID</label>
        <input
          type="text"
          placeholder="Enter your quiz ID"
          value={quizId}
          onChange={(e) => setQuizId(e.target.value)}
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={hostQuiz}
        className="host-button"
      >
        <FaPlay className="icon" /> Host Quiz
      </motion.button>
    </div>
  );
};

export default HostForm;