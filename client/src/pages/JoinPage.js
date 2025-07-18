import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from "framer-motion";
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // if using react-router

const socket = io('https://quiz-backend-nrd7.onrender.com', {
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
  const [timeLeft, setTimeLeft] = useState(10);
  const [width, height] = useWindowSize();
  const [showAnswer, setShowAnswer] = useState(false);
  const [players, setPlayers] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [isQuizOver, setIsQuizOver] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [myScore, setMyScore] = useState(0); // 🆕 track own score
  const [answerTime, setAnswerTime] = useState(null);
  const [myStreak, setMyStreak] = useState(0);
  const [userBehind, setUserBehind] = useState(null);
  const navigate = useNavigate();


  const joinQuiz = () => {
    socket.emit('join-quiz', { pin, name });
  };

  const answerQuestion = (selectedOption) => {
    setSelectedAnswer(selectedOption);

    const now = Date.now();
    setAnswerTime(now); // 🆕 Store time of answering

    const timeTaken = (now - questionStartTime) / 1000;
    const maxTime = 10;
    const baseScore = 1000;
    const score = Math.max(0, Math.round(baseScore * ((maxTime - timeTaken) / maxTime)));

    socket.emit('submit-answer', {
      pin,
      name,
      answer: selectedOption,
      score
    });
  };

useEffect(() => {
  socket.on('kicked', () => {
    alert("❌ You were removed by the host.");
    navigate('/join'); // adjust this to your JoinQuiz route
  });

  return () => socket.off('kicked');
}, []);
  useEffect(() => {
    if (!quizStarted || quizEnded || !currentQuestion) return;
    if (timeLeft === 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          setShowAnswer(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [quizStarted, quizEnded, currentQuestion, timeLeft]);

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setCorrectAnswer(null);
  };

  useEffect(() => {
    socket.on('player-joined', () => {
      setJoined(true);
      setError('');
    });

    socket.on('error-pin', ({ message }) => setError(message));
    socket.on('quiz-started', () => setQuizStarted(true));

    socket.on("receive-question", (data) => {
  setCurrentQuestion(data);
  setSelectedAnswer(null);
  setCorrectAnswer(data.correct);

  const remaining = data.timeLeft ?? 10;
  setTimeLeft(remaining);

  setShowAnswer(remaining === 0); // ✅ If time is over, show answer immediately

  setQuestionStartTime(data.startTime || Date.now());

  setJoined(true);
  setQuizStarted(true);
});





    socket.on("quiz-ended", (scores) => {
      const sorted = [...scores].sort((a, b) => b.score - a.score); // 🔥 sort high-to-low
      setScoreboard(sorted);
      setQuizEnded(true);

      const me = sorted.find(s => s.name === name);
      if (me) setMyScore(me.score);
    });

    // ⬇️ Add this block BELOW quiz-ended ⬇️
    socket.on("scoreboard-update", (scores) => {
      const sorted = [...scores].sort((a, b) => b.score - a.score);
      setScoreboard(sorted);

      const myIndex = sorted.findIndex(p => p.name === name);
      if (myIndex !== -1 && myIndex < sorted.length - 1) {
        const nextUser = sorted[myIndex + 1];
        setUserBehind(nextUser);
      } else {
        setUserBehind(null);
      }
    });

    return () => {
      socket.off('player-joined');
      socket.off('error-pin');
      socket.off('quiz-started');
      socket.off('receive-question');
      socket.off('quiz-ended');
      socket.off('scoreboard-update'); // ✅ Clean up
    };
  }, [name]);


  // 🟢 TOAST FEEDBACK AFTER ANSWER SHOWN
  useEffect(() => {
    if (showAnswer && selectedAnswer && correctAnswer) {
      const isCorrect = selectedAnswer === correctAnswer;
      const timeTaken = (answerTime - questionStartTime) / 1000;
      const maxTime = 10;
      const baseScore = 1000;
      const earned = Math.max(0, Math.round(baseScore * ((maxTime - timeTaken) / maxTime)));

      if (isCorrect) {
        toast.success(`✅ Correct! You earned ${earned} points`, { autoClose: 2500 });
        setMyScore(prev => prev + earned);
        setMyStreak(prev => prev + 1); // ⬅️ Update streak
      } else {
        toast.error(`❌ Wrong Answer. You earned 0 points`, { autoClose: 2500 });
        setMyStreak(0); // ⬅️ Reset streak
      }
      // After updating score and streak
if (scoreboard && scoreboard.length > 0) {
  const sorted = [...scoreboard].sort((a, b) => b.score - a.score);
  const myIndex = sorted.findIndex(p => p.name === name);

  if (myIndex !== -1 && myIndex < sorted.length - 1) {
    const nextUser = sorted[myIndex + 1];
    setUserBehind(nextUser);
  } else {
    setUserBehind(null); // No one behind
  }
}

    }
  }, [showAnswer, selectedAnswer, correctAnswer, answerTime]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md relative">
        {/* 📉 Live Score Top Right */}
        {joined && quizStarted && !quizEnded && (
          <div className="absolute top-3 right-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md text-sm shadow">
            🎯 Your Score: {myScore}
          </div>
        )}

        {!joined && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Join Quiz</h2>
            <input
              type="text"
              placeholder="Enter Name"
              className="w-full mb-3 px-4 py-2 border rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter PIN"
              className="w-full mb-4 px-4 py-2 border rounded-md"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <button
              onClick={joinQuiz}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Join
            </button>
            {error && <p className="text-red-600 mt-3">{error}</p>}
          </>
        )}

        {joined && !quizStarted && (
          <h3 className="text-center text-lg font-medium">⏳ Waiting for host to start quiz...</h3>
        )}

        <AnimatePresence mode="wait">
          {quizStarted && currentQuestion && (
            <motion.div
              key={currentQuestion.question}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="mt-4"
            >
              <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>
              <div className="grid gap-3">
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={selectedAnswer !== null || timeLeft === 0} // ⛔ disable if time's up
                    onClick={() => answerQuestion(opt)}
                    className={`py-2 px-4 rounded-md border text-left transition ${
                      showAnswer
                        ? opt === correctAnswer
                          ? 'bg-green-500 text-white'
                          : opt === selectedAnswer
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200'
                        : selectedAnswer === opt
                        ? 'bg-yellow-300'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <p className="text-right text-sm text-gray-500">⏳ Time left: {timeLeft}s</p>
              {timeLeft === 0 && !selectedAnswer && (
  <p className="text-sm text-red-500 mt-2 text-center">⏱️ Time’s up! You can’t answer this question.</p>
)}


{/* Visual progress bar below timer */}
<div className="w-full bg-gray-300 h-2 rounded overflow-hidden mt-2">
  <div
    className="h-full bg-blue-500 transition-all duration-1000"
    style={{
      width: `${(timeLeft / 10) * 100}%`
    }}
  ></div>
</div>

              {showAnswer && (
  <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-800 p-3 rounded text-center shadow">
    ✅ Correct Answer: <strong>{correctAnswer}</strong>

    <div className="mt-2 text-sm text-indigo-700">
      🔥 Streak: {myStreak} {myStreak > 1 ? 'answers in a row!' : 'correct answer!'}
    </div>

    {userBehind && (
      <div className="mt-1 text-xs text-gray-600">
        ⬇️ Just behind you: <strong>{userBehind.name}</strong> ({userBehind.score} pts)
      </div>
    )}
  </div>
)}



            </motion.div>
          )}
        </AnimatePresence>

        {quizEnded && (
          <>
            <Confetti width={width} height={height} />
            <div className="mt-6 bg-white rounded-xl shadow-md p-6 text-center">
              <h2 className="text-3xl font-bold text-green-600 mb-6">🏁 Quiz Finished</h2>

              <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">🏆 Leaderboard</h3>
                <ul className="space-y-3">
                  {scoreboard.map((s, i) => (
                    <li
                      key={i}
                      className={`flex items-center justify-between px-4 py-2 rounded-lg shadow-sm transition ${
                        s.name === name
                          ? "bg-yellow-100 border border-yellow-400"
                          : "bg-white hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {i + 1}
                        </div>
                        <span className="font-medium text-gray-900">
                          {i === 0 && '🥇 '}
                          {i === 1 && '🥈 '}
                          {i === 2 && '🥉 '}
                          {s.name}
                        </span>
                      </div>
                      <span className="font-bold text-indigo-600 text-lg">{s.score} pts</span>
                    </li>
                  ))}
                </ul>
              </div>

              {navigator.share && (
                <button
                  onClick={() =>
                    navigator.share({
                      title: 'Quiz Result',
                      text: `I scored ${scoreboard.find(s => s.name === name)?.score || 0} in the quiz!`,
                      url: window.location.href,
                    })
                  }
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  📤 Share Result
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default JoinPage;
