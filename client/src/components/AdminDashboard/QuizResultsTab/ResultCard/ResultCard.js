import React from 'react';
import { FiCalendar, FiAward, FiStar, FiChevronDown } from 'react-icons/fi';
import DeleteButton from '../../common/DeleteButton/DeleteButton';
import './ResultCard.css'

const ResultCard = ({ result, onDelete }) => {
  return (
    <div className="result-card">
      <div className="card-header">
        <div className="quiz-meta">
          <span className="quiz-pin">
            <FiChevronDown className="icon-sm" /> PIN: {result.pin}
          </span>
          <span className="quiz-date">
            <FiCalendar className="icon-sm" /> 
            {new Date(result.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
        <DeleteButton 
          onDelete={() => onDelete(result._id)}
          confirmMessage="Delete this quiz result?"
          iconOnly={true}
        />
      </div>

      <div className="player-leaderboard">
        <div className="leaderboard-header">
          <span>Rank</span>
          <span>Player</span>
          <span>Score</span>
        </div>
        <div className="leaderboard-body">
          {result.players.map((player, idx) => (
            <div 
              key={idx} 
              className={`player-row ${idx < 3 ? 'podium-' + (idx + 1) : ''}`}
            >
              <span className="player-rank">
                {idx === 0 ? <FiAward className="gold" /> : 
                idx === 1 ? <FiAward className="silver" /> : 
                idx === 2 ? <FiAward className="bronze" /> : `#${idx + 1}`}
              </span>
              <span className="player-name">
                <span className="name-text">
                  {player.name}
                  {player.userId && (
                    <span className="player-id">
                      ({player.userId.slice(0, 6)})
                    </span>
                  )}
                </span>
                {idx < 3 && <span className="podium-badge">Top {idx + 1}</span>}
              </span>
              <span className="player-score-admin">
                {player.score} <FiStar className="score-icon" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;