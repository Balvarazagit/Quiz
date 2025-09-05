// components/host/PlayerList.js
import { FaUserAlt, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './PlayerList.css';

const PlayerList = ({ players, handleKick, isDarkTheme }) => {
  return (
    <div className={`players-container ${isDarkTheme ? 'dark-theme' : ''}`}>
      <h4>
        <span className={`player-icon ${isDarkTheme ? 'dark-theme' : ''}`}><FaUserAlt /></span>
        Players Joined: {players.length}
      </h4>
      <div className="players-list">
        {players.length === 0 ? (
          <p className="empty-players">Waiting for players to join...</p>
        ) : (
          players.map(player => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`player-item ${isDarkTheme ? 'dark-theme' : ''}`}
            >
              <div className="player-info-playerlist">
                <span className="player-name">{player.name}</span>
                <span className={`player-id ${isDarkTheme ? 'dark-theme' : ''}`}>({player.userId?.slice(0, 6)})</span>
              </div>

              <button 
                onClick={() => handleKick(player.id, player.name)}
                aria-label={`Kick ${player.name}`}
                className={isDarkTheme ? 'dark-theme' : ''}
              >
                <FaSignOutAlt />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlayerList;