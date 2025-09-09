import React from 'react';
import DeleteButton from '../../common/DeleteButton/DeleteButton';
import './QuizCard.css'

const QuizCard = ({ quiz, onDelete, isMobile,isDarkTheme  }) => {
  return (
    <div key={quiz._id} className="quiz-card glassmorphism" data-theme={isDarkTheme ? "dark" : "light"}>
      <div className="card-header">
        <div className="quiz-title-wrapper">
          <h3 className="quiz-title">{quiz.title}</h3>
        </div>
        <div className="quiz-id-wrapper">
          {!isMobile ? <span className="id-label">ID:</span> : ''}
          <span className="quiz-id" title={quiz._id}>
            {quiz._id}
          </span>
        </div>
      </div>
      
      <div className="card-body">
        <div className="info-row">
          <span className="info-label">Host:</span>
          <div className="host-info">
            <span className="host-name">{quiz.host?.name || "System"}</span>
            <span className="host-email">{quiz.host?.email || ""}</span>
          </div>
        </div>
        
        <div className="info-row">
          <span className="info-label">Created:</span>
          <div className="date-info">
            <span className="create-date">
              {new Date(quiz.createdAt).toLocaleDateString()}
            </span>
            <span className="create-time">
              {new Date(quiz.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
        </div>
      </div>
      
      <div className="card-footer">
        <DeleteButton 
          onDelete={() => onDelete(quiz._id)}
          confirmMessage="Are you sure you want to delete this quiz?"
          isMobile={isMobile}
          label="Delete Quiz"
        />
      </div>
    </div>
  );
};

export default QuizCard;