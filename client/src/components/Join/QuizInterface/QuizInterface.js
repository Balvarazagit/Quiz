import { motion, AnimatePresence } from "framer-motion";
import QuestionSection from './QuestionSection';
import OptionsGrid from './OptionsGrid';
import FeedbackPanel from './FeedbackPanel';
import './QuizInterface.css';

const QuizInterface = ({
  currentQuestion,
  questionIndex,
  totalQuestions,
  timeLeft,
  selectedAnswer,
  showAnswer,
  correctAnswer,
  thought,
  showThought,
  answerQuestion,
  questionStartTime,
  answerTime,
  pollAnswer,
  setPuzzleResult,
  puzzleResult,
  pin,
  userId,
  name,
  socket,
  setMyStreak,
  setMyScore
}) => {
  return (
    <AnimatePresence mode="wait">
      {currentQuestion && (
        <motion.div
          key={currentQuestion.question}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="quiz-interface"
        >
          <QuestionSection
            currentQuestion={currentQuestion}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            timeLeft={timeLeft}
          />
          
                  <OptionsGrid
                      currentQuestion={currentQuestion}
                      selectedAnswer={selectedAnswer}
                      showAnswer={showAnswer}
                      correctAnswer={correctAnswer}
                      pollAnswer={pollAnswer}
                      answerQuestion={answerQuestion}
                      timeLeft={timeLeft}
                      pin={pin}
                      userId={userId}
                      name={name}
                      socket={socket}
                      puzzleResult={puzzleResult}
                      setPuzzleResult={setPuzzleResult}
                      questionStartTime={questionStartTime}
                      setMyScore={setMyScore}
                      setMyStreak={setMyStreak}
                  />
          
          {showAnswer && (
            <FeedbackPanel
              currentQuestion={currentQuestion}
              selectedAnswer={selectedAnswer}
              correctAnswer={correctAnswer}
              questionStartTime={questionStartTime}
              answerTime={answerTime}
              puzzleResult={puzzleResult}
            />
          )}
          
          {showThought && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="thought-panel"
            >
              <div className="thought-bubble">
                💡 <strong>Thought:</strong> {thought}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuizInterface;