// components/host/FinalScoreboard.js
import { motion } from 'framer-motion';
import './FinalScoreboard.css';

const FinalScoreboard = ({ finalResults }) => {
  return (
    <div className="final-scoreboard">
      <h2 className="scoreboard-title">
        <span className="trophy-icon">🏆</span>
        Final Results
        <span className="trophy-icon">🏆</span>
      </h2>
      <div className="scoreboard-header">
        <span className="header-rank">Rank</span>
        <span className="header-name">Player</span>
        <span className="header-score">Score</span>
      </div>
      <div className="scoreboard-list">
        {finalResults.slice(0, 10).map((player, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`scoreboard-item ${index < 3 ? `top-${index + 1}` : ''}`}
          >
            <span className="player-rank">
              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
            </span>
            <span className="player-name">
              {player.name}<span style={{ fontSize: '12px', color: '#999' }}>({player.userId?.slice(0, 6)})</span>
              {index < 3 && <span className="winner-badge">Winner</span>}
            </span>
            <span className="player-score-finalscoreboard">
              <span className="score-value">{player.score}</span>
              <span className="score-label">pts</span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FinalScoreboard;