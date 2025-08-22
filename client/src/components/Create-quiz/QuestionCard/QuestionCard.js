import MediaUploader from '../MediaUploader/MediaUploader';
import OptionsSection from '../OptionsSection/OptionsSection';
import PuzzleOrderEditor from '../PuzzleOrderEditor/PuzzleOrderEditor';
import './QuestionCard.css';

function QuestionCard({
  qIndex,
  question,
  questions,
  tempOrders,
  setTempOrders,
  handleChange,
  handleOptionChange,
  handleRemoveQuestion,
  handleFileUpload,
  extractYouTubeId,
  setQuestions
}) {
  return (
    <div className="question-card">
      <div className="question-create-header">
        <div className="question-number-create-container">
          <span className="question-number-create-badge">{qIndex + 1}</span>
          <h3 className="question-number-create">Question</h3>
        </div>
        <button 
          type="button" 
          onClick={() => handleRemoveQuestion(qIndex)}
          className="remove-question-btn"
          disabled={questions.length <= 1}
          aria-label="Remove question"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="question-content">
        <div className="question-type-selector">
          <label className="input-label">Question Type</label>
          <select
            value={question.type}
            onChange={e => handleChange(qIndex, 'type', e.target.value)}
            className="question-type-select"
          >
            <option value="MCQ">Multiple Choice</option>
            <option value="TrueFalse">True / False</option>
            <option value="Poll">Poll (No correct answer)</option>
            <option value="Puzzle">Puzzle</option>
          </select>
        </div>

        <div className="question-textarea-container">
          <label className="input-label">Question Text</label>
          <textarea
            placeholder="Enter your question here..."
            value={question.question}
            onChange={e => handleChange(qIndex, 'question', e.target.value)}
            className="question-textarea"
            rows={3}
          />
        </div>

        {question.type === "Poll" && (
          <div className="poll-mode-selector">
            <label className="input-label">Poll Type</label>
            <select
              value={question.pollMode || "MCQ"}
              onChange={(e) => handleChange(qIndex, "pollMode", e.target.value)}
              className="question-type-select"
            >
              <option value="MCQ">MCQ Poll (4 Options)</option>
              <option value="TrueFalse">True/False Poll</option>
            </select>
          </div>
        )}

        <MediaUploader
          qIndex={qIndex}
          question={question}
          handleChange={handleChange}
          handleFileUpload={handleFileUpload}
          extractYouTubeId={extractYouTubeId}
        />

        <OptionsSection
          qIndex={qIndex}
          question={question}
          handleOptionChange={handleOptionChange}
          handleChange={handleChange}
        />

        {question.type === "Puzzle" && (
          <PuzzleOrderEditor
            qIndex={qIndex}
            question={question}
            questions={questions}
            tempOrders={tempOrders}
            setTempOrders={setTempOrders}
            setQuestions={setQuestions}
          />
        )}

        <div className="thought-input-container">
          <label className="input-label">Host's Thought (Optional)</label>
          <textarea
            placeholder="Add a motivational or guiding thought for participants..."
            value={question.thought}
            onChange={e => handleChange(qIndex, 'thought', e.target.value)}
            className="thought-textarea"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;