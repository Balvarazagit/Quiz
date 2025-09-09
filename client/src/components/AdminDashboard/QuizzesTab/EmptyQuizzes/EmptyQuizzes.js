import React from 'react';
import './EmptyQuizzes.css'

const EmptyQuizzes = ({ onReset,isDarkTheme  }) => {
  return (
    <div className="empty-state-emptyquizzes glassmorphism" data-theme={isDarkTheme ? "dark" : "light"}>
      <div className="empty-illustration">
        <div className="puzzle-piece">🧩</div>
        <div className="magnifying-glass">🔍</div>
      </div>
      <h3>No quizzes match your search</h3>
      <p>Try different keywords or create a new quiz</p>
      <button 
        onClick={onReset}
        className="reset-btn neon-hover"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default EmptyQuizzes;