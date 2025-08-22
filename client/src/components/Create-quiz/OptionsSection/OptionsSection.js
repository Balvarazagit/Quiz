import './OptionsSection.css';

function OptionsSection({ qIndex, question, handleOptionChange, handleChange }) {
  return (
    <>
      <div className="options-section">
        <label className="input-label">
          {question.type === "TrueFalse" || (question.type === "Poll" && question.pollMode === "TrueFalse")
            ? "True/False Options"
            : "Answer Options"}
        </label>

        <div className="options-container">
          {question.options.map((opt, optIndex) => (
            <div key={optIndex} className="option-input-wrapper">
              <span className="option-bullet"></span>
              <input
                type="text"
                placeholder={
                  question.type === "TrueFalse" || (question.type === "Poll" && question.pollMode === "TrueFalse")
                    ? ""
                    : `Option ${optIndex + 1}`
                }
                value={opt}
                onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                className="option-input"
                disabled={question.type === "TrueFalse" || (question.type === "Poll" && question.pollMode === "TrueFalse")}
              />
            </div>
          ))}
        </div>
      </div>

      {question.type !== "Poll" && question.type !== "Puzzle" && (
        <div className="correct-answer-selector">
          <label className="input-label">Correct Answer</label>
          <select
            value={question.correct}
            onChange={e => handleChange(qIndex, 'correct', e.target.value)}
            className="correct-answer-select"
          >
            <option value="">Select correct option</option>
            {question.options.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt || (question.type === 'TrueFalse' ? ['True', 'False'][idx] : `Option ${idx + 1}`)}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
}

export default OptionsSection;