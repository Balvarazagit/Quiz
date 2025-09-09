import React from 'react';
import './ResultsStats.css'

const ResultsStats = ({ results, isDarkTheme }) => {
  return (
    <div className="stats-card" data-theme={isDarkTheme ? "dark" : "light"}>
      <div className="stat-item">
        <span className="stat-value">{results.length}</span>
        <span className="stat-label">Results</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">
          {results.reduce((acc, curr) => acc + curr.players.length, 0)}
        </span>
        <span className="stat-label">Participants</span>
      </div>
    </div>
  );
};

export default ResultsStats;