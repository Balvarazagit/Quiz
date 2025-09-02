import React, { useState } from 'react';
import QuizSearchSort from './QuizSearchSort/QuizSearchSort';
import QuizCard from './QuizCard/QuizCard';
import EmptyQuizzes from './EmptyQuizzes/EmptyQuizzes';
import './QuizzesTab.css'

const QuizzesTab = ({ quizzes, onDeleteQuiz, isMobile }) => {
  const [quizSearch, setQuizSearch] = useState('');
  const [quizSortBy, setQuizSortBy] = useState('date');

  const filteredQuizzes = quizzes
    .filter((q) => {
      const search = quizSearch.toLowerCase();
      return (
        q._id.toLowerCase().includes(search) ||
        q.title.toLowerCase().includes(search) ||
        q.host?.name?.toLowerCase().includes(search) ||
        q.host?.email?.toLowerCase().includes(search) ||
        new Date(q.createdAt).toLocaleDateString().toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      if (quizSortBy === 'name') {
        return a.title.localeCompare(b.title);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  return (
    <div className="quizzes-tab">
      <div className="quizzes-header">
        <div className="header-content">
          <h2 className="section-title">
            <span className="title-icon">🧩</span>
            Quiz Management
          </h2>
          <p className="section-subtitle">View and manage all created quizzes</p>
        </div>
        
        <QuizSearchSort
          quizSearch={quizSearch}
          setQuizSearch={setQuizSearch}
          quizSortBy={quizSortBy}
          setQuizSortBy={setQuizSortBy}
          isMobile={isMobile}
        />
      </div>

      {filteredQuizzes.length === 0 ? (
        <EmptyQuizzes 
          onReset={() => { setQuizSearch(''); setQuizSortBy('date'); }}
        />
      ) : (
        <div className="quiz-cards-container">
          {filteredQuizzes.map(quiz => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
              onDelete={onDeleteQuiz}
              isMobile={isMobile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizzesTab;