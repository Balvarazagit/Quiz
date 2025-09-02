import React from 'react';
import './QuizSearchSort.css'

const QuizSearchSort = ({
  quizSearch,
  setQuizSearch,
  quizSortBy,
  setQuizSortBy,
  isMobile
}) => {
  return (
    <div className="controls">
      <div className="search-container glassmorphism">
        <div className="search-icon">🔍</div>
        <input
          type="text"
          placeholder="Search by title, ID or host..."
          value={quizSearch}
          onChange={(e) => setQuizSearch(e.target.value)}
          className="search-input"
        />
        <div className="search-underline"></div>
      </div>
      
      <div className="sort-tabs glassmorphism">
        <button
          onClick={() => setQuizSortBy('date')}
          className={`sort-tab ${quizSortBy === 'date' ? 'active' : ''}`}
        >
          <span className="tab-icon">🕒</span>
          {!isMobile && <span className="tab-label">Newest First</span>}
        </button>
        <button
          onClick={() => setQuizSortBy('name')}
          className={`sort-tab ${quizSortBy === 'name' ? 'active' : ''}`}
        >
          <span className="tab-icon">🔠</span>
          {!isMobile && <span className="tab-label">A-Z</span>}
        </button>
      </div>
    </div>
  );
};

export default QuizSearchSort;