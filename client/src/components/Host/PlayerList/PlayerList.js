// components/host/PlayerList.js
import { FaUserAlt, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './PlayerList.css';

const PlayerList = ({ players, handleKick }) => {
  return (
    <div className="players-container">
      <h4>
        <span className="player-icon"><FaUserAlt /></span>
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
              className="player-item"
            >
              <div className="player-info-playerlist">
                <span className="player-name">{player.name}</span>
                <span className="player-id">({player.userId?.slice(0, 6)})</span>
              </div>

              <button 
                onClick={() => handleKick(player.id, player.name)}
                aria-label={`Kick ${player.name}`}
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