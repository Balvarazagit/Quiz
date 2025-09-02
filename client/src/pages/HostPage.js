import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import HostForm from '../components/Host/HostForm/HostForm';
import PinDisplay from '../components/Host/PinDisplay/PinDisplay';
import PlayerList from '../components/Host/PlayerList/PlayerList';
import LiveScoreboard from '../components/Host/LiveScoreboard/LiveScoreboard';
import QuestionDisplay from '../components/Host/QuestionDisplay/QuestionDisplay';
import FinalScoreboard from '../components/Host/FinalScoreboard/FinalScoreboard';
import QuizControls from '../components/Host/QuizControls/QuizControls';
import '../pages/styles/HostPage.css';
import { FaUserAlt, FaPlay, FaQrcode, FaLink } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { QRCodeSVG } from "qrcode.react";
import HostQRCode from '../components/Host/HostQRCode/HostQRCode';

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
  const [finalResults, setFinalResults] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerStats, setAnswerStats] = useState({});
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [timeLeft, setTimeLeft] = useState(null);
  const [scoreboard, setScoreboard] = useState([]);
  const [thought, setThought] = useState('');
  const [showThought, setShowThought] = useState(false);
  const location = useLocation();
  const qrRef = useRef();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("quizId");
    if (id) {
      setQuizId(id);
    }
  }, [location]);
  
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

  const shareQRCode = async () => {
    try {
      // Convert QR code to data URL
      const svgElement = qrRef.current.querySelector('svg');
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      // Create an image to convert SVG to PNG
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const pngUrl = canvas.toDataURL('image/png');
        
        // Try to share with Web Share API
        if (navigator.share) {
          // Fetch the PNG as a blob
          const response = await fetch(pngUrl);
          const blob = await response.blob();
          const file = new File([blob], 'quiz-qr.png', { type: 'image/png' });
          
          await navigator.share({
            title: 'Join My Quiz',
            text: `Join my quiz using PIN: ${pin} or scan the QR code`,
            files: [file],
          });
        } else {
          // Fallback for browsers that don't support sharing files
          const link = document.createElement('a');
          link.download = 'quiz-qr.png';
          link.href = pngUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.info('QR code downloaded!');
        }
        
        URL.revokeObjectURL(svgUrl);
      };
      img.src = svgUrl;
    } catch (error) {
      console.error('Error sharing QR code:', error);
      toast.error('Failed to share QR code');
    }
  };

  useEffect(() => {
    socket.on('quiz-hosted', ({ pin }) => {
      setPin(pin);
      toast.success(`🎉 Quiz hosted successfully!`);
    });

    socket.on('player-joined', ({ players }) => {
      setPlayers(players);
      const lastPlayer = players[players.length - 1];
      if (lastPlayer && lastPlayer.name) {
        toast.info(`👋 ${lastPlayer.name} joined!`);
      }
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

      // Reset thought visibility
      setThought('');
      setShowThought(false);

      // Show thought after 5 seconds
      setTimeout(() => {
        if (data.thought) {
          setThought(data.thought);
          setShowThought(true);
        }
      }, 5000);
    });

    socket.on("answer-stats", (stats) => {
      setAnswerStats(stats);
    });

    socket.on("auto-next", () => nextQuestion());

    socket.on("scoreboard-update", (data) => {
      setScoreboard(data);
    });

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
          <HostForm 
            quizId={quizId} 
            setQuizId={setQuizId} 
            hostQuiz={hostQuiz} 
          />
        ) : (
          <div className="host-game">
            <PinDisplay pin={pin} />
            
            <HostQRCode pin={pin} isMobile={isMobile} />

            <div className="host-content-grid">
              <div className="players-section">
                <PlayerList 
                  players={players} 
                  handleKick={handleKick} 
                />
              </div>
              
              <div className="scoreboard-section">
                <LiveScoreboard scoreboard={scoreboard} />
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
                  <FinalScoreboard finalResults={finalResults} />
                ) : (
                  <>
                    <QuestionDisplay 
                      currentQuestion={currentQuestion}
                      questionNumber={questionNumber}
                      timeLeft={timeLeft}
                      answerStats={answerStats}
                      players={players}
                      showCorrectAnswer={showCorrectAnswer}
                      thought={thought}
                      showThought={showThought}
                    />
                    
                    <QuizControls 
                      revealAnswer={revealAnswer}
                      nextQuestion={nextQuestion}
                      isQuizOver={isQuizOver}
                      isMobile={isMobile}
                      showCorrectAnswer={showCorrectAnswer}
                    />
                  </>
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