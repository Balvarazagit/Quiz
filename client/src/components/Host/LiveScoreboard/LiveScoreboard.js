import React from 'react'
import './LiveScoreboard.css';
// components/host/LiveScoreboard.js
const LiveScoreboard = ({ scoreboard }) => {
  return (
    <div className="live-scoreboard-host">
      <h3>Live Scoreboard</h3>
      <div className="scoreboard-header">
        <span className="header-rank">Rank</span>
        <span className="header-name">Player</span>
        <span className="header-score">Score</span>
      </div>
      <div className="scoreboard-list">
        {scoreboard.map((player, index) => (
          <div key={index} className="scoreboard-item">
            <span className="player-rank">#{index + 1}</span>
            <span className="player-name">
              {player.name}<span>({player.userId?.slice(0, 6)})</span>
              {index < 3 && <span className="winner-badge">Top {index + 1}</span>}
            </span>
            <span className="player-score-livescoreboard">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


export default LiveScoreboard