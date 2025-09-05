// components/host/QuizControls.js
import { FaStepForward } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './QuizControls.css';

const QuizControls = ({
  revealAnswer,
  nextQuestion,
  isQuizOver,
  isMobile,
  showCorrectAnswer,
  isDarkTheme
}) => {
  return (
    <div className="host-control-buttons">
      {!showCorrectAnswer && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={revealAnswer}
          className={`reveal-button ${isDarkTheme ? 'dark-theme' : ''}`}
        >
          Reveal Answer
        </motion.button>
      )}
      <motion.button
        whileHover={!isQuizOver ? { scale: 1.02 } : {}}
        whileTap={!isQuizOver ? { scale: 0.98 } : {}}
        onClick={nextQuestion}
        disabled={isQuizOver}
        className={`next-button ${isDarkTheme ? 'dark-theme' : ''} ${isQuizOver ? 'disabled' : ''}`}
      >
        <FaStepForward className="icon" />
        {isMobile ? (isQuizOver ? "Completed" : "Next") : (isQuizOver ? "Quiz Completed" : "Next Question")}
      </motion.button>
    </div>
  );
};

export default QuizControls;