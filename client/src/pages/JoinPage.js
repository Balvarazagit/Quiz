import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from "framer-motion";
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/JoinPage.css';
import { v4 as uuidv4 } from 'uuid';

const socket = io(`${process.env.REACT_APP_API_URL}`, {
  transports: ['websocket'],
});

function JoinPage() {
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [quizEnded, setQuizEnded] = useState(false);
  const [scoreboard, setScoreboard] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [width, height] = useWindowSize();
  const [showAnswer, setShowAnswer] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [myScore, setMyScore] = useState(0);
  const [answerTime, setAnswerTime] = useState(null);
  const [myStreak, setMyStreak] = useState(0);
  const [userBehind, setUserBehind] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const navigate = useNavigate();
  const [userId] = useState(uuidv4()); // ← unique ID per session

  const joinQuiz = () => {
    if (!name.trim()) {
      toast.error("⚠️ Please enter your name!");
      return;
    }
    socket.emit("join-quiz", { pin, name, userId });
  };

  const answerQuestion = (selectedOption) => {
    setSelectedAnswer(selectedOption);
    const now = Date.now();
    setAnswerTime(now);
    const timeTaken = (now - questionStartTime) / 1000;
    const maxTime = 30;
    const baseScore = 1000;
    const score = Math.max(0, Math.round(baseScore * ((maxTime - timeTaken) / maxTime)));
    socket.emit('submit-answer', { pin, name, answer: selectedOption, score, userId });
  };

  useEffect(() => {
    socket.on('kicked', () => {
      toast.error("❌ You were removed by the host.");
      navigate('/join');
    });

    socket.on('player-joined', () => {
      setJoined(true);
      setError('');
    });

    socket.on('error-pin', ({ message }) => setError(message));
    socket.on('quiz-started', () => setQuizStarted(true));

    socket.on("receive-question", (data) => {
      setCurrentQuestion(data);
      setQuestionIndex(data.index + 1); // human-readable
      setTotalQuestions(data.total || 0);
      setSelectedAnswer(null);
      setCorrectAnswer(data.correct);
      setTimeLeft(data.timeLeft ?? 30);
      setShowAnswer(data.timeLeft === 0);
      setQuestionStartTime(data.startTime || Date.now());
      setJoined(true);
      setQuizStarted(true);
    });

    socket.on("quiz-ended", (scores) => {
      const sorted = [...scores].sort((a, b) => b.score - a.score);
      setScoreboard(sorted);
      setQuizEnded(true);
      const me = sorted.find(s => s.name === name);
      if (me) setMyScore(me.score);
    });

    socket.on("scoreboard-update", (scores) => {
      const sorted = [...scores].sort((a, b) => b.score - a.score);
      setScoreboard(sorted);
      const myIndex = sorted.findIndex(p => p.name === name);
      setUserBehind(myIndex !== -1 && myIndex < sorted.length - 1 ? sorted[myIndex + 1] : null);
    });

    return () => {
      socket.off('kicked');
      socket.off('player-joined');
      socket.off('error-pin');
      socket.off('quiz-started');
      socket.off('receive-question');
      socket.off('quiz-ended');
      socket.off('scoreboard-update');
    };
  }, [name, navigate]);

  useEffect(() => {
    if (!quizStarted || quizEnded || !currentQuestion) return;
    if (timeLeft === 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(prev => {
        if (prev === 1) setShowAnswer(true);
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [quizStarted, quizEnded, currentQuestion, timeLeft]);

  useEffect(() => {
    if (showAnswer && selectedAnswer && correctAnswer) {
      const isCorrect = selectedAnswer === correctAnswer;
      const timeTaken = (answerTime - questionStartTime) / 1000;
      const maxTime = 30;
      const baseScore = 1000;
      const earned = Math.max(0, Math.round(baseScore * ((maxTime - timeTaken) / maxTime)));

      if (isCorrect) {
        toast.success(`✅ Correct! You earned ${earned} points`, { autoClose: 2500 });
        setMyScore(prev => prev + earned);
        setMyStreak(prev => prev + 1);
      } else {
        toast.error(`❌ Wrong Answer. You earned 0 points`, { autoClose: 2500 });
        setMyStreak(0);
      }
    }
  }, [showAnswer, selectedAnswer, correctAnswer, answerTime]);

  return (
    <div className="quiz-app-container">
      {/* Celebration Confetti */}
      {quizEnded && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}

      {/* Main App Container */}
      <div className="quiz-app">
        {/* App Header */}
        <header className="app-header">
          <div className="branding">
            <div className="app-logo">
              <svg className="logo-icon" viewBox="0 0 24 24">
                <path fill="#4CAF50" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <h1 className="app-title">QuizMaster Pro</h1>
          </div>
          
          {joined && quizStarted && !quizEnded && (
            <div className="live-stats">
              <div className="stat-pill">
                <span className="stat-label">Score</span>
                <span className="stat-value">{myScore}</span>
              </div>
              {myStreak > 0 && (
                <div className="stat-pill streak">
                  <span className="stat-label">Streak</span>
                  <span className="stat-value">{myStreak}x</span>
                </div>
              )}
              {!timeLeft && userBehind && (
                <div className="stat-pill behind">
                  <span className="stat-label">Next: {userBehind.name}</span>
                  <span className="stat-value">{userBehind.score - myScore}</span>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="app-content">
          {/* Join Form */}
          {!joined && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="join-section"
            >
              <div className="form-card">
                <div className="form-header">
                  <h2 className="form-title">Join Quiz Session</h2>
                  <p className="form-subtitle">Enter your details to participate</p>
                </div>

                <div className="form-group">
                  <label className="input-label">Your Name</label>
                  <div className="input-container">
                    <svg className="input-icon-join" viewBox="0 0 24 24">
                      <path fill="#81C784" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(""); }}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="input-label">Game PIN</label>
                  <div className="input-container">
                    <svg className="input-icon-join" viewBox="0 0 24 24">
                      <path fill="#81C784" d="M17 10h-4V8.86c1.72-.45 3-2 3-3.86h-2c0 1.1-.9 2-2 2s-2-.9-2-2H6c0 1.86 1.28 3.41 3 3.86V10H7c-1.1 0-2 .9-2 2v9h14v-9c0-1.1-.9-2-2-2zm-5 3c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="123456"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                {error && (
                  <div className="error-notice">
                    <svg className="error-icon" viewBox="0 0 24 24">
                      <path fill="#E57373" d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={joinQuiz}
                  className="primary-action"
                >
                  Join Now
                  <svg className="action-icon" viewBox="0 0 24 24">
                    <path fill="#FFFFFF" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Waiting Room */}
          {joined && !quizStarted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="waiting-room"
            >
              <div className="waiting-content">
                <div className="waiting-animation">
                  <div className="pulse-circle"></div>
                  <svg className="waiting-icon" viewBox="0 0 24 24">
                    <path fill="#4CAF50" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                <h3 className="waiting-title">Waiting for Host</h3>
                <p className="waiting-message">The quiz will begin shortly</p>
                
                <div className="session-info-card">
                  <div className="info-list">
                    <div className="info-item">
                      <div className="info-icon">🔢</div>
                      <div className="info-content">
                        <span className="info-label">Game PIN</span>
                        <span className="info-value">{pin}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <div className="info-icon">👤</div>
                      <div className="info-content">
                        <span className="info-label">Player</span>
                        <span className="info-value">{name}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <div className="info-icon">🆔</div>
                      <div className="info-content">
                        <span className="info-label">ID</span>
                        <span className="info-value">{userId}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quiz Interface */}
          <AnimatePresence mode="wait">
            {quizStarted && currentQuestion && (
              <motion.div
                key={currentQuestion.question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="quiz-interface"
              >
                {/* Question Section */}
                <div className="question-section">
                  <div className="question-meta">
                    <span className="question-tag">Question {questionIndex} of {totalQuestions}</span>
                    <div className="time-remaining">
                      <svg className="timer-icon" viewBox="0 0 24 24">
                        <path fill="#4CAF50" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                        <path fill="#4CAF50" d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                      </svg>
                      <span>{timeLeft}s</span>
                    </div>
                  </div>
                  
                  <h3 className="question-text">{currentQuestion.question}</h3>
                  
                  {/* Progress Bar */}
                  <div className="progress-track">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${(timeLeft / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Options Grid */}
                <div className="options-grid">
                  {currentQuestion.options.map((opt, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={!selectedAnswer && timeLeft > 0 ? { 
                        scale: 1.02,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                      } : {}}
                      whileTap={!selectedAnswer && timeLeft > 0 ? { scale: 0.98 } : {}}
                      disabled={selectedAnswer !== null || timeLeft === 0}
                      onClick={() => answerQuestion(opt)}
                      className={`quiz-option ${
                        showAnswer
                          ? opt === correctAnswer
                            ? 'correct'
                            : opt === selectedAnswer
                            ? 'incorrect'
                            : ''
                          : selectedAnswer === opt
                          ? 'selected'
                          : ''
                      }`}
                    >
                      <div className="option-marker">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <div className="option-content">
                        <span className="option-text">{opt}</span>
                        {showAnswer && opt === correctAnswer && (
                          <svg className="check-icon" viewBox="0 0 24 24">
                            <path fill="#4CAF50" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Answer Feedback */}
                {showAnswer && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`feedback-panel ${
                      selectedAnswer === correctAnswer ? 'positive' : 'negative'
                    }`}
                  >
                    <div className="feedback-content">
                      {selectedAnswer === correctAnswer ? (
                        <>
                          <div className="feedback-icon-container">
                            <svg className="feedback-icon" viewBox="0 0 24 24">
                              <path fill="#4CAF50" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          </div>
                          <div className="feedback-details">
                            <h4>Correct Answer!</h4>
                            <p className="points-earned">
                              +{Math.max(0, Math.round(1000 * ((30 - (answerTime - questionStartTime) / 1000) / 30)))} points
                            </p>
                            {myStreak > 1 && (
                              <div className="streak-notice">
                                <svg className="streak-icon" viewBox="0 0 24 24">
                                  <path fill="#FFC107" d="M17.09 4.56c-.7-1.03-1.5-1.99-2.4-2.85-.35-.34-.94-.02-.84.46.19.94.39 2.18.39 3.29 0 2.06-1.35 3.73-3.41 3.73-1.54 0-2.8-.93-3.35-2.26-.1-.2-.14-.32-.2-.54-.11-.42-.66-.55-.9-.18-.18.27-.35.54-.51.83C4.68 8.13 4 10.05 4 12.26 4 17.14 8.37 21 13.75 21s9.75-3.86 9.75-8.74c0-4.46-3.41-8.09-7.66-8.7z"/>
                                </svg>
                                <span>🔥 {myStreak} correct in a row!</span>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="feedback-icon-container">
                            <svg className="feedback-icon" viewBox="0 0 24 24">
                              <path fill="#E57373" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                            </svg>
                          </div>
                          <div className="feedback-details">
                            <h4>Correct Answer: {correctAnswer}</h4>
                            <p className="encouragement">Keep going! Next question coming soon</p>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Screen */}
          {quizEnded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="results-screen"
            >
              <div className="results-header">
                <div className="trophy-icon-container">
                  <svg className="results-icon" viewBox="0 0 24 24">
                    <path fill="#FFC107" d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
                  </svg>
                </div>
                <h2 className="results-title">Quiz Completed</h2>
                <div className="final-score-container">
                  <p className="final-score-label">Your Final Score</p>
                  <p className="final-score">{myScore}</p>
                </div>
              </div>

              <div className="leaderboard-container">
                <div className="leaderboard-header">
                  <svg className="leaderboard-icon" viewBox="0 0 24 24">
                    <path fill="#4CAF50" d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
                  </svg>
                  <h3 className="leaderboard-title">Final Standings</h3>
                </div>

                <div className="leaderboard-list">
                  {scoreboard.map((player, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`leaderboard-item ${
                        player.name === name ? 'current-player' : ''
                      } ${index < 3 ? 'podium' : ''}`}
                    >
                      <div className="player-rank">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                      </div>
                      <div className="player-info">
                        <span className="player-name">{player.name}</span>
                        {player.userId === userId && (
                          <span className="player-id" style={{ fontSize: '10px', color: '#888' }}>
                            ID: {player.userId?.slice(0, 6)}
                          </span>
                        )}
                        <div className="player-score-container">
                          <span className="player-score">{player.score}</span>
                          <span className="score-label">pts</span>
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </div>
              </div>

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
          )}
        </main>
      </div>
    </div>
  );
}

export default JoinPage;