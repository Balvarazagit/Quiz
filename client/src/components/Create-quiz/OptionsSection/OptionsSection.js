// OptionsSection.js
import './OptionsSection.css';
import { useState, useEffect } from 'react';

function OptionsSection({ qIndex, question, handleOptionChange, handleChange }) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('options-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('options-theme', 'light');
    }
  };

  // Check for saved theme preference on component mount
    useEffect(() => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setIsDarkTheme(true);
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }, []);

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