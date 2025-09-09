import { motion } from "framer-motion";
import PuzzleComponent from '../../Create-quiz/Puzzle/PuzzleComponent';
import './OptionsGrid.css';

const OptionsGrid = ({
  currentQuestion,
  selectedAnswer,
  showAnswer,
  correctAnswer,
  pollAnswer,
  answerQuestion,
  timeLeft,
  pin,
  userId,
  name,
  socket,
  puzzleResult,
  setPuzzleResult,
  questionStartTime,
  setMyScore,
  setMyStreak,
  isDarkTheme
}) => {
  return (
    <div className="options-grid-join">
      {currentQuestion.type === "Puzzle" ? (
        <PuzzleComponent
          options={currentQuestion?.options || []}
          correctAnswer={currentQuestion?.correct || []}
          socket={socket}
          pin={pin}
          userId={userId}
          timeLeft={timeLeft}
          name={name}
          onAnswer={(isCorrect, arrangedOptions) => {
            setPuzzleResult(isCorrect);
            const now = Date.now();
            const timeTaken = (now - questionStartTime) / 1000;
            const maxTime = 30;
            const baseScore = 1000;
            const earned = isCorrect ? Math.max(0, Math.round(baseScore * ((maxTime - timeTaken) / maxTime))) : 0;

            socket.emit('submit-answer', {
              pin,
              name,
              answer: arrangedOptions,
              score: earned,
              userId
            });

            setMyScore(prev => prev + earned);
            setMyStreak(prev => isCorrect ? prev + 1 : 0);
          }}
          isDarkTheme={isDarkTheme}
        />
      ) : (
        currentQuestion.options.map((opt, idx) => (
          <motion.button
            key={idx}
            whileHover={timeLeft > 0 ? { scale: 1.02 } : {}}
            whileTap={timeLeft > 0 ? { scale: 0.98 } : {}}
            disabled={timeLeft === 0 || (currentQuestion.type !== "Poll" && selectedAnswer !== null)}
            onClick={() => answerQuestion(opt)}
            className={`quiz-option ${
              currentQuestion.type === "Poll"
                ? pollAnswer === opt ? "selected" : "" 
                : showAnswer
                  ? (
                      (Array.isArray(correctAnswer) && correctAnswer.includes(opt)) ||
                      (!Array.isArray(correctAnswer) && opt === correctAnswer)
                    )
                    ? "correct"
                    : selectedAnswer === opt
                      ? "incorrect"
                      : ""
                  : selectedAnswer === opt
                    ? "selected"
                    : ""
            }`}
          >
            <div className="option-marker">{String.fromCharCode(65 + idx)}</div>
            <div className="option-content">
              <span className="option-text">{opt}</span>
            </div>
          </motion.button>
        ))
      )}
    </div>
  );
};

export default OptionsGrid;