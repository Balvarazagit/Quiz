import './QuestionSection.css';

const QuestionSection = ({ currentQuestion, questionIndex, totalQuestions, timeLeft }) => {
  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div className="question-section">
      <div className="question-meta">
        <span className="question-tag">Question {questionIndex} of {totalQuestions}</span>
        <div className="time-remaining">
          <svg className="timer-icon" viewBox="0 0 24 24">
            <path fill="#4CAF50" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            <path fill="#4CAF50" d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          <span>{timeLeft}s</span>
        </div>
      </div>
      <h3 className="question-text">{currentQuestion.question}</h3>
      <div className="media-display-join">
        {currentQuestion.mediaType === "image" && (
          <img src={currentQuestion.mediaUrl} alt="question" className="media-preview" />
        )}

        {currentQuestion.mediaType === "audio" && (
          <audio controls className="media-audio">
            <source src={currentQuestion.mediaUrl} type="audio/mpeg" />
          </audio>
        )}

        {currentQuestion.mediaType === "gif" && (
          <img src={currentQuestion.mediaUrl} alt="gif" className="media-preview" />
        )}

        {currentQuestion.mediaType === "video" && (
          <iframe
            className="media-video"
            src={`https://www.youtube.com/embed/${extractYouTubeId(currentQuestion.mediaUrl)}`}
            title="YouTube video"
            frameBorder="0"
            allowFullScreen
          />
        )}
      </div>
      
      <div className="progress-track">
        <div 
          className="progress-bar" 
          style={{ width: `${(timeLeft / 30) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default QuestionSection;