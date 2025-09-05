import React from 'react'
import './LiveScoreboard.css';
// components/host/LiveScoreboard.js
const LiveScoreboard = ({ scoreboard, isDarkTheme }) => {
  return (
    <div className={`live-scoreboard-host ${isDarkTheme ? 'dark-theme' : ''}`}>
      <div className="scoreboard-header-main">
        <h3>Live Scoreboard</h3>
        <div className={`live-indicator ${isDarkTheme ? 'dark-theme' : ''}`}>
          <span className="pulse"></span>
          LIVE
        </div>
      </div>
      <div className="scoreboard-header">
        <span className="header-rank">Rank</span>
        <span className="header-name">Player</span>
        <span className="header-score">Score</span>
      </div>
      <div className="scoreboard-list">
        {scoreboard.map((player, index) => (
          <div key={index} className={`scoreboard-item ${isDarkTheme ? 'dark-theme' : ''} ${index < 3 ? `top-${index + 1}` : ''}`}>
            <span className="player-rank">
              {index < 3 ? (
                <span className="rank-icon">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
              ) : (
                `#${index + 1}`
              )}
            </span>
            <span className="player-name">
              <span className="name-text">{player.name}</span>
              <span className="player-id">({player.userId?.slice(0, 6)})</span>
              {index < 3 && <span className="winner-badge">Top {index + 1}</span>}
            </span>
            <span className="player-score-livescoreboard">
              <span className="score-value">{player.score}</span>
              <span className="score-label">pts</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveScoreboard;