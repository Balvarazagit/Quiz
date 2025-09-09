import { motion } from "framer-motion";
import './FeedbackPanel.css';

const FeedbackPanel = ({
  currentQuestion,
  selectedAnswer,
  correctAnswer,
  questionStartTime,
  answerTime,
  puzzleResult,
  isDarkTheme
}) => {
  if (currentQuestion.type === "Puzzle") {
    return (
      <motion.div className={`feedback-panel ${puzzleResult ? 'positive' : 'negative'}`}>
        <div className="feedback-content">
          {puzzleResult ? (
            <h4>✅ Correct!</h4>
          ) : (
            <>
              <h4>Correct Answer: {currentQuestion.correct.join(', ')}</h4>
              <p>Keep going! Next question coming soon</p>
            </>
          )}
        </div>
      </motion.div>
    );
  }

  if (!selectedAnswer) return null;

  const isCorrect = Array.isArray(correctAnswer)
    ? correctAnswer.includes(selectedAnswer)
    : selectedAnswer === correctAnswer;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`feedback-panel ${isCorrect ? 'positive' : 'negative'}`}
    >
      <div className="feedback-content">
        {isCorrect ? (
          <>
            <div className="feedback-icon-container">
              <svg className="feedback-icon" viewBox="0 0 24 24">
                <path fill={isDarkTheme ? "#81C784" : "#4CAF50"} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg> 
            </div>
            <div className="feedback-details">
              <h4>Correct Answer!</h4>
              <p className="points-earned">
                +{Math.max(
                  0,
                  Math.round(1000 * ((30 - (answerTime - questionStartTime) / 1000) / 30))
                )}
              </p>
            </div>
          </>
        ) : (
          <>
            <h4>Incorrect!</h4>
            <p>Correct: {Array.isArray(correctAnswer) ? correctAnswer.join(', ') : correctAnswer}</p>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default FeedbackPanel;