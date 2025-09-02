import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/JoinPage.css';
import { v4 as uuidv4 } from 'uuid';

// Import components
import JoinForm from '../components/Join/JoinForm/JoinForm';
import WaitingRoom from '../components/Join/WaitingRoom/WaitingRoom';
import QuizInterface from '../components/Join/QuizInterface/QuizInterface';
import ResultsScreen from '../components/Join/ResultsScreen/ResultsScreen';

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
  const [userId] = useState(uuidv4());
  const [thought, setThought] = useState('');
  const [showThought, setShowThought] = useState(false);
  const [pollAnswer, setPollAnswer] = useState(null); 
  const [puzzleResult, setPuzzleResult] = useState(null);
  const [playersList, setPlayersList] = useState([]);

  const joinQuiz = () => {
    if (!name.trim()) {
      toast.error("⚠️ Please enter your name!");
      return;
    }
    socket.emit("join-quiz", { pin, name, userId });
  };

  const answerQuestion = (selectedOption) => {
    if (currentQuestion.type === "Poll") {
      setPollAnswer(selectedOption); 
      socket.emit("submit-answer", { pin, name, answer: selectedOption, userId, isPoll: true });
      return;
    }

    if (selectedAnswer || timeLeft === 0 || showAnswer) return;

    const now = Date.now();
    setAnswerTime(now);
    setSelectedAnswer(selectedOption);

    const timeTaken = (now - questionStartTime) / 1000;
    const maxTime = 30;
    const baseScore = 1000;
    const earned =
    (Array.isArray(currentQuestion.correct)
      ? currentQuestion.correct.includes(selectedOption)
      : selectedOption === currentQuestion.correct)
      ? Math.max(0, Math.round(baseScore * ((maxTime - timeTaken) / maxTime)))
      : 0;

    socket.emit('submit-answer', { pin, name, answer: selectedOption, score: earned, userId });
  };

  useEffect(() => {
    socket.on('kicked', () => {
      toast.error("❌ You were removed by the host.");
      navigate('/join');
    });

    socket.on("player-joined", ({ players }) => {
      setJoined(true);
      setError('');
      setPlayersList(players);
    });

    socket.on('error-pin', ({ message }) => setError(message));
    socket.on('quiz-started', () => setQuizStarted(true));

    socket.on("receive-question", (data) => {
  setCurrentQuestion(data);
  setQuestionIndex(data.index + 1);
  setTotalQuestions(data.total || 0);
  setSelectedAnswer(null);
  setCorrectAnswer(data.correct);

  // Calculate elapsed time based on server startTime
  const elapsed = Math.floor((Date.now() - data.startTime) / 1000);
  const remaining = Math.max(0, 30 - elapsed);

  setTimeLeft(remaining);
  setShowAnswer(remaining === 0);
  setQuestionStartTime(data.startTime);

  setJoined(true);
  setQuizStarted(true);
  setThought('');
  setShowThought(false);
  setPuzzleResult(null);

  setTimeout(() => {
    setShowAnswer(false);
    if (data.thought) {
      setThought(data.thought);
      setShowThought(true);
    }
  }, 5000);
});

    socket.on("quiz-ended", (scores) => {
      const sorted = [...scores].sort((a, b) => b.score - a.score);
      setScoreboard(sorted);
      setQuizEnded(true);
      const me = sorted.find(s => s.userId === userId);
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
  }, [name, navigate, userId]);

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
    if (!showAnswer) return;

    if (currentQuestion?.type === "Puzzle" && puzzleResult !== null) {
      if (puzzleResult) {
        toast.success("✅ Correct!", { autoClose: 2500 });
      } else {
        toast.error("❌ Wrong Answer.", { autoClose: 2500 });
      }
      return;
    }

    if (selectedAnswer && correctAnswer) {
      const isCorrect = Array.isArray(correctAnswer)
        ? correctAnswer.includes(selectedAnswer)
        : selectedAnswer === correctAnswer;
      if (isCorrect) {
        toast.success("✅ Correct!", { autoClose: 2500 });
      } else {
        toast.error("❌ Wrong Answer.", { autoClose: 2500 });
      }
    }
  }, [showAnswer, selectedAnswer, correctAnswer, puzzleResult, currentQuestion]);

  useEffect(() => {
    if (!showAnswer) return;
    if (scoreboard.length && name) {
      const me = scoreboard.find(s => s.userId === userId);
      if (me) setMyScore(me.score);
    }
  }, [showAnswer, scoreboard, name, userId]);

  return (
    <div className="quiz-app-join-container">
      {quizEnded && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}

      <div className="quiz-app-join">
        <header className="app-header-join">
          <div className="branding">
            <div className="app-logo">
              <svg className="logo-icon-join" viewBox="0 0 24 24">
                <path fill="#4CAF50" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 极速赛车开奖结果 极速赛车开奖直播 极速赛车开奖记录 极速赛车开奖网 极速赛车开奖官网 极速赛车开奖号码 极速赛车开奖查询 极速赛车开奖公告 极速赛车开奖历史 极速赛车开奖视频 极速赛车开奖结果查询 极速赛车开奖结果官网 极速赛车开奖结果历史 极速赛车开奖结果记录 极速赛车开奖结果直播 极速赛车开奖结果公告 极速赛车开奖结果查询官网 极速赛车开奖结果查询历史 极速赛车开奖结果查询记录 极速赛车开奖结果查询直播 极速赛车开奖结果查询公告 极速赛车开奖结果查询网 极速赛车开奖结果查询网站 极速赛车开奖结果查询网址 极速赛车开奖结果查询官网入口 极速赛车开奖结果查询官网下载 极速赛车开奖结果查询官网地址 极速赛车开奖结果查询官网链接 极速赛车开奖结果查询官网首页 极速赛车开奖结果查询官网平台 极速赛车开奖结果查询官网登录 极速赛车开奖结果查询官网注册 极速赛车开奖结果查询官网app 极速赛车开奖结果查询官网手机版 极速赛车开奖结果查询官网电脑版 极速赛车开奖结果查询官网在线 极速赛车开奖结果查询官网入口 极速赛车开奖结果查询官网下载 极速赛车开奖结果查询官网地址 极速赛车开奖结果查询官网链接 极速赛车开奖结果查询官网首页 极速赛车开奖结果查询官网平台 极速赛车开奖结果查询官网登录 极速赛车开奖结果查询官网注册 极速赛车开奖结果查询官网app 极速赛车开奖结果查询官网手机版 极速赛车开奖结果查询官网电脑版 极速赛车开奖结果查询官网在线"/>
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

        <main className="app-content-join">
          {!joined && (
            <JoinForm 
              pin={pin}
              setPin={setPin}
              name={name}
              setName={setName}
              error={error}
              joinQuiz={joinQuiz}
            />
          )}

          {joined && !quizStarted && (
            <WaitingRoom 
              pin={pin}
              name={name}
              userId={userId}
              players={playersList.length}
            />
          )}

          {quizStarted && currentQuestion && (
            <QuizInterface
              currentQuestion={currentQuestion}
              questionIndex={questionIndex}
              totalQuestions={totalQuestions}
              timeLeft={timeLeft}
              selectedAnswer={selectedAnswer}
              showAnswer={showAnswer}
              correctAnswer={correctAnswer}
              thought={thought}
              showThought={showThought}
              answerQuestion={answerQuestion}
              questionStartTime={questionStartTime}
              answerTime={answerTime}
              pollAnswer={pollAnswer}
              puzzleResult={puzzleResult}
              setPuzzleResult={setPuzzleResult}
              pin={pin}
              userId={userId}
              name={name}
              socket={socket}
              setMyStreak={setMyStreak}
              setMyScore={setMyScore}
            />
          )}

          {quizEnded && (
            <ResultsScreen
              myScore={myScore}
              scoreboard={scoreboard}
              name={name}
              userId={userId}
              navigate={navigate}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default JoinPage;