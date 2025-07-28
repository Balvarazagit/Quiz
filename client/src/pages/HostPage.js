import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { FaPlay, FaStepForward, FaUserAlt, FaSignOutAlt, FaClipboard, FaClipboardCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../pages/styles/HostPage.css';

const socket = io(`${process.env.REACT_APP_API_URL}`, {
  transports: ['websocket'],
});

function HostPage() {
  const [quizId, setQuizId] = useState('');
  const [pin, setPin] = useState(null);
  const [players, setPlayers] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isQuizOver, setIsQuizOver] = useState(false);
  const [finalResults, setFinalResults] = useState([]); // ✅ NEW: scoreboard
  const [copied, setCopied] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerStats, setAnswerStats] = useState({});
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
  if (!currentQuestion) return;

  const interval = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(interval);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [currentQuestion]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pin);
    setCopied(true);
    toast.success('PIN copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const hostQuiz = () => {
    if (!quizId.trim()) {
      toast.error("❌ Please enter a Quiz ID");
      return;
    }
    socket.emit('host-quiz', { quizId });
  };

  const startQuiz = () => {
    if (!pin) return;
    socket.emit('start-quiz', { pin });
    setQuizStarted(true);
  };

  const nextQuestion = () => {
    if (!pin || isQuizOver) return;
    socket.emit('next-question', { pin });
    setQuestionNumber(prev => prev + 1);
    setShowCorrectAnswer(false);
  };

  const revealAnswer = () => {
    setShowCorrectAnswer(true);
  };

  const handleKick = (playerId, playerName) => {
    const confirmKick = window.confirm(`Remove ${playerName} from the quiz?`);
    if (confirmKick) {
      socket.emit("kick-player", { pin, playerId });
      toast.info(`👢 ${playerName} was removed`, { position: "top-center" });
    }
  };

  useEffect(() => {
    socket.on('quiz-hosted', ({ pin }) => {
      setPin(pin);
      toast.success(`🎉 Quiz hosted successfully!`);
    });

    socket.on('player-joined', ({ players }) => {
      setPlayers(players);
      toast.info(`👋 ${players[players.length - 1].name} joined!`);
    });

    socket.on('quiz-started', () => {
      setQuizStarted(true);
      toast.success("🚀 Quiz started!");
    });

    socket.on("receive-question", (data) => {
      setCurrentQuestion(data);
      setAnswerStats({});
      const elapsed = Math.floor((Date.now() - data.startTime) / 1000);
      const remaining = Math.max(0, 30 - elapsed);
      setTimeLeft(remaining);
    });

    socket.on("answer-stats", (stats) => {
      setAnswerStats(stats);
    });

    socket.on("auto-next", () => nextQuestion());

    // ✅ Updated handler to receive final scoreboard
    socket.on("quiz-ended", (scoreboard) => {
      setIsQuizOver(true);
      setFinalResults(scoreboard);
      toast.success("🏆 Quiz completed!");
    });

    return () => {
      socket.off("quiz-hosted");
      socket.off("player-joined");
      socket.off("quiz-started");
      socket.off("receive-question");
      socket.off("answer-stats");
      socket.off("auto-next");
      socket.off("quiz-ended");
    };
  }, []);

  const getOptionPercentage = (option) => {
    if (!answerStats.totalAnswers || answerStats.totalAnswers === 0) return 0;
    return Math.round((answerStats[option] || 0) / answerStats.totalAnswers * 100);
  };

  return (
    <div className="host-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="host-card"
      >
        <div className="host-header">
          <div className="host-icon">
            <FaUserAlt />
          </div>
          <h2>Quiz Host Dashboard</h2>
        </div>

        {!pin ? (
          <div className="host-form">
            <div>
              <label>Quiz ID</label>
              <input
                type="text"
                placeholder="Enter your quiz ID"
                value={quizId}
                onChange={(e) => setQuizId(e.target.value)}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={hostQuiz}
              className="host-button"
            >
              <FaPlay className="icon" /> Host Quiz
            </motion.button>
          </div>
        ) : (
          <div className="host-game">
            <div className="pin-container">
              <h3>Game PIN</h3>
              <div className="pin-display">
                <code>{pin}</code>
                <button onClick={copyToClipboard} aria-label="Copy PIN">
                  {copied ? <FaClipboardCheck className="copied" /> : <FaClipboard />}
                </button>
              </div>
              <p>Share this PIN with players to join</p>
            </div>

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
                      <span>{player.name}</span>
                      <button onClick={() => handleKick(player.id, player.name)}>
                        <FaSignOutAlt />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {!quizStarted ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startQuiz}
                className="start-button"
                disabled={players.length === 0}
              >
                <FaPlay className="icon" /> Start Quiz
              </motion.button>
            ) : (
              <>
                {isQuizOver ? (
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
                          {finalResults.map((player, index) => (
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
                              <span className="player-score">
                                <span className="score-value">{player.score}</span>
                                <span className="score-label">pts</span>
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                ) : (
                  <div className="quiz-controls">
                    {currentQuestion && (
                      <div className="question-display-container">
                        <div className="question-display">
                                <div className="question-host-header">
                                  {timeLeft !== null && (
                                    <div className="question-timer">⏳ {timeLeft}s remaining</div>
                                  )}
                                  <span className="question-number-host">Question {questionNumber}</span>
                                  <h3 className="question-text">{currentQuestion.question}</h3>
                                </div>
                          <div className="options-stats-container">
                            {currentQuestion.options.map((option, index) => {
                              const percentage = getOptionPercentage(option);
                              const isCorrect = showCorrectAnswer && option === currentQuestion.correct;

                              return (
                                <div key={index} className="option-stat-wrapper">
                                  <div className="option-stat">
                                    <div className="option-label">
                                      <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                                      <span className="option-text">{option}</span>
                                      {isCorrect && <span className="correct-indicator">✓</span>}
                                    </div>

                                    <div className="stat-visualization">
                                      <div className="stat-bar-container">
                                        <div
                                          className="stat-bar"
                                          style={{
                                            width: `${percentage}%`,
                                            backgroundColor: isCorrect ? '#4CAF50' : '#2196F3'
                                          }}
                                        ></div>
                                      </div>

                                      <div className="stat-numbers">
                                        <span className="stat-percentage">{percentage}%</span>
                                        <span className="stat-count">({answerStats[option] || 0})</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="participation-metrics">
                            <div className="total-responses">
                              <span className="metric-value">{answerStats.totalAnswers || 0}</span>
                              <span className="metric-label">Responses</span>
                            </div>
                            <div className="response-rate">
                              <span className="metric-value">
                                {players.length > 0
                                  ? Math.round((answerStats.totalAnswers || 0) / players.length * 100)
                                  : 0}%
                              </span>
                              <span className="metric-label">Participation</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="host-control-buttons">
                      {!showCorrectAnswer && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={revealAnswer}
                          className="reveal-button"
                        >
                          Reveal Answer
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={!isQuizOver ? { scale: 1.02 } : {}}
                        whileTap={!isQuizOver ? { scale: 0.98 } : {}}
                        onClick={nextQuestion}
                        disabled={isQuizOver}
                        className={`next-button ${isQuizOver ? 'disabled' : ''}`}
                      >
                        <FaStepForward className="icon" />
                        {isMobile ? (isQuizOver ? "Completed" : "Next") : (isQuizOver ? "Quiz Completed" : "Next Question")}
                      </motion.button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default HostPage;
