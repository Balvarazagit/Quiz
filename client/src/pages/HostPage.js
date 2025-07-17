import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io('http://localhost:5000');

function HostPage() {
  const [quizId, setQuizId] = useState('');
  const [pin, setPin] = useState(null);
  const [players, setPlayers] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isQuizOver, setIsQuizOver] = useState(false);

  const hostQuiz = () => {
    if (!quizId.trim()) {
      toast.error("❌ Enter Quiz ID before hosting.");
      return;
    }
    socket.emit('host-quiz', { quizId });
  };

  const startQuiz = () => {
    if (!pin) return;
    socket.emit('start-quiz', { pin });
  };

  const nextQuestion = () => {
    if (!pin || isQuizOver) return;
    socket.emit('next-question', { pin });
    setQuestionNumber(prev => prev + 1);
  };

  const handleKick = (playerId, playerName) => {
  const confirmKick = window.confirm(`Are you sure you want to kick ${playerName}?`);
  if (confirmKick) {
    socket.emit("kick-player", { pin, playerId });
    toast.info(`👢 Kicked ${playerName}`, { position: "top-center" });
  }
};


  useEffect(() => {
    socket.on('quiz-hosted', ({ pin }) => {
    console.log("🎉 Quiz hosted, received PIN:", pin);
    setPin(pin);
  });
    socket.on('player-joined', ({ players }) => setPlayers(players));
    socket.on('quiz-started', () => setQuizStarted(true));
    socket.on("auto-next", () => nextQuestion());

    socket.on("quiz-ended", () => {
      setIsQuizOver(true);
      toast.success("🎉 Quiz completed!");
    });

    return () => {
      socket.off("quiz-hosted");
      socket.off("player-joined");
      socket.off("quiz-started");
      socket.off("auto-next");
      socket.off("quiz-ended");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">📡 Host Quiz</h2>

        {!pin && (
          <>
            <input
              type="text"
              placeholder="Enter Quiz ID"
              className="w-full mb-4 px-4 py-2 border rounded-md"
              value={quizId}
              onChange={(e) => setQuizId(e.target.value)}
            />
            <button
              onClick={hostQuiz}
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
            >
              Start Hosting
            </button>
          </>
        )}

        {pin && (
          <>
            <h3 className="text-lg font-semibold text-center mb-4">
              Share this PIN:{" "}
              <code className="text-xl bg-gray-100 px-3 py-1 rounded-md">{pin}</code>
            </h3>

            <h4 className="font-medium mb-1">👥 Players Joined:</h4>
            <div className="mb-4 space-y-2">
              {players.length === 0 && (
                <p className="text-sm text-gray-500">No players joined yet.</p>
              )}
              {players.map(player => (
  <div key={player.id} className="flex justify-between items-center border px-4 py-2 rounded my-2 bg-gray-50">
    <span>{player.name}</span>
    <button
      className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600"
      onClick={() => handleKick(player.id, player.name)}
    >
      Kick
    </button>
  </div>
))}

            </div>

            {!quizStarted ? (
              <button
                onClick={startQuiz}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
              >
                Start Quiz
              </button>
            ) : (
              <div className="text-center">
                <h4 className="mb-2 font-medium">
                  Current Question: {questionNumber}
                </h4>
                <button
                  onClick={nextQuestion}
                  disabled={isQuizOver}
                  className={`w-full py-2 rounded-md ${
                    isQuizOver
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isQuizOver ? "Quiz Completed" : "Next Question"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default HostPage;
