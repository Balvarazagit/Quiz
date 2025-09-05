// components/host/QuestionDisplay.js
import { motion, AnimatePresence } from 'framer-motion';
import './QuestionDisplay.css';

const QuestionDisplay = ({
  currentQuestion,
  questionNumber,
  timeLeft,
  answerStats,
  players,
  showCorrectAnswer,
  thought,
  showThought,
  isDarkTheme
}) => {
  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getOptionPercentage = (option) => {
    if (!answerStats.totalAnswers || answerStats.totalAnswers === 0) return 0;
    return Math.round((answerStats[option] || 0) / answerStats.totalAnswers * 100);
  };

  if (!currentQuestion) return null;

  return (
    <div className="quiz-controls">
      <div className={`question-display-container ${isDarkTheme ? 'dark-theme' : ''}`}>
        <div className="question-display">
          <div className={`question-host-header ${isDarkTheme ? 'dark-theme' : ''}`}>
            {timeLeft !== null && (
              <div className={`question-timer ${isDarkTheme ? 'dark-theme' : ''}`}>
                ⏳ {timeLeft}s remaining
              </div>
            )}
            <span className={`question-number-host ${isDarkTheme ? 'dark-theme' : ''}`}>
              Question {questionNumber}
            </span>
            <h3 className={`question-text ${isDarkTheme ? 'dark-theme' : ''}`}>
              {currentQuestion.question}
            </h3>
            <div className="media-display-host">
              {currentQuestion.mediaType === "image" && (
                <img src={currentQuestion.mediaUrl} alt="question" className="media-preview" />
              )}

              {currentQuestion.mediaType === "audio" && (
                <audio controls className="media-audio">
                  <source src={currentQuestion.mediaUrl} type="audio/mpeg" />
                </audio>
              )}

              {currentQuestion.mediaType === "gif" && (
                <img src={currentQuestion.mediaUrl} alt="gif" className="media-preview" />
              )}

              {currentQuestion.mediaType === "video" && (
                <iframe
                  className="media-video"
                  src={`https://www.youtube.com/embed/${extractYouTubeId(currentQuestion.mediaUrl)}`}
                  title="YouTube video"
                  frameBorder="0"
                  allowFullScreen
                />
              )}
            </div>
          </div>
          <div className="options-stats-container">
            {currentQuestion.options.map((option, index) => {
              const percentage = getOptionPercentage(option);
              const isCorrect = showCorrectAnswer && (
                Array.isArray(currentQuestion.correct)
                  ? currentQuestion.correct.includes(option)
                  : option === currentQuestion.correct
              );

              return (
                <div key={index} className={`option-stat-wrapper ${isDarkTheme ? 'dark-theme' : ''}`}>
                  <div className="option-stat">
                    <div className="option-label">
                      <span className={`option-letter ${isDarkTheme ? 'dark-theme' : ''}`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className={`option-text ${isDarkTheme ? 'dark-theme' : ''}`}>
                        {option}
                      </span>
                      {isCorrect && <span className="correct-indicator">✓</span>}
                    </div>

                    <div className="stat-visualization">
                      <div className={`stat-bar-container ${isDarkTheme ? 'dark-theme' : ''}`}>
                        <div
                          className="stat-bar"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: isCorrect ? '#4CAF50' : '#2196F3'
                          }}
                        ></div>
                      </div>

                      <div className="stat-numbers">
                        <span className={`stat-percentage ${isDarkTheme ? 'dark-theme' : ''}`}>
                          {percentage}%
                        </span>
                        <span className={`stat-count ${isDarkTheme ? 'dark-theme' : ''}`}>
                          ({answerStats[option] || 0})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {showCorrectAnswer && currentQuestion.type === "Puzzle" && (
            <div className={`puzzle-answer-box ${isDarkTheme ? 'dark-theme' : ''}`}>
              <h4>🧩 Correct Answer:</h4>
              <p className={`puzzle-answer-text ${isDarkTheme ? 'dark-theme' : ''}`}>
                {Array.isArray(currentQuestion.correct)
                  ? currentQuestion.correct.join(", ")
                  : currentQuestion.correct}
              </p>
            </div>
          )}

          <div className={`participation-metrics ${isDarkTheme ? 'dark-theme' : ''}`}>
            <div className="total-responses">
              <span className={`metric-value ${isDarkTheme ? 'dark-theme' : ''}`}>
                {answerStats.totalAnswers || 0}
              </span>
              <span className={`metric-label ${isDarkTheme ? 'dark-theme' : ''}`}>
                Responses
              </span>
            </div>
            <div className="response-rate">
              <span className={`metric-value ${isDarkTheme ? 'dark-theme' : ''}`}>
                {players.length > 0
                  ? Math.round((answerStats.totalAnswers || 0) / players.length * 100)
                  : 0}%
              </span>
              <span className={`metric-label ${isDarkTheme ? 'dark-theme' : ''}`}>
                Participation
              </span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showThought && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            className={`host-thought-box ${isDarkTheme ? 'dark-theme' : ''}`}
          >
            💡 <strong>Host Thought:</strong> {thought}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionDisplay;