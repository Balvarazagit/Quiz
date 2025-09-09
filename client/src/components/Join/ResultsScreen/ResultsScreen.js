import { motion } from "framer-motion";
import Leaderboard from './Leaderboard';
import './ResultsScreen.css';

const ResultsScreen = ({ myScore, scoreboard, name, userId, navigate, isDarkTheme }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="results-screen"
    >
      <div className="results-header-resultsscreen">
        <div className="trophy-icon-container">
          <svg className="results-icon" viewBox="0 0 24 24">
            <path fill={isDarkTheme ? "#FFC107" : "#FFC107"} d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
          </svg>
        </div>
        <h2 className="results-title">Quiz Completed</h2>
        <div className="final-score-container">
          <p className="final-score-label">Your Final Score</p>
          <p className="final-score">{myScore}</p>
        </div>
      </div>

      <Leaderboard scoreboard={scoreboard} name={name} userId={userId} isDarkTheme={isDarkTheme} />
      
      <div className="results-actions">
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          className="share-results"
          onClick={() => navigator.share({
            title: 'Quiz Results',
            text: `I scored ${myScore} points in QuizMaster Pro!`,
            url: window.location.href
          })}
        >
          <svg className="action-icon" viewBox="0 0 24 24">
            <path fill="#FFFFFF" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
          </svg>
          Share Results
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          className="new-session"
          onClick={() => navigate('/')}
        >
          <svg className="action-icon" viewBox="0 0 24 24">
            <path fill="#FFFFFF" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          Return Home
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ResultsScreen;