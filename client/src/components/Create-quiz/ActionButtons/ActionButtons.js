import './ActionButtons.css';

function ActionButtons({ handleAddQuestion, handleSubmit, loading }) {
  return (
    <div className="action-buttons">
      <button 
        type="button" 
        onClick={handleAddQuestion}
        className="add-question-btn"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Add Question
      </button>
      <button 
        type="submit" 
        onClick={handleSubmit} 
        className="submit-quiz-btn"
        disabled={loading}
      >
        {loading ? (
          <span className="submit-spinner"></span>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Create Quiz
          </>
        )}
      </button>
    </div>
  );
}

export default ActionButtons;