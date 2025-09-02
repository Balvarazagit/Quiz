import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiUser, FiAward, FiEyeOff, FiCheck, FiAlertCircle } from 'react-icons/fi';
import './styles/ViewQuizPage.css';

function ViewQuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  console.log("quiz id",quiz)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/quiz/${quizId}/view`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || 'Failed to load quiz');
        
        setQuiz(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-animation">
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
      </div>
      <p className="loading-text">Loading Quiz Content</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-icon">
        <FiAlertCircle size={48} />
      </div>
      <h3 className="error-title">Error Loading Quiz</h3>
      <p className="error-message">{error}</p>
      <button className="retry-button" onClick={() => window.location.reload()}>
        Try Again
      </button>
    </div>
  );

  if (!quiz) return (
    <div className="not-found-container">
      <div className="not-found-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="not-found-title">Quiz Not Found</h3>
      <p className="not-found-message">The requested quiz doesn't exist or may have been removed.</p>
    </div>
  );

  return (
    <div className="view-quiz-container">
      <div className="quiz-header">
        <div className="quiz-title-container">
          <div className="quiz-badge">Quiz Preview</div>
          <h1 className="quiz-title">{quiz.title}</h1>
          <div className="quiz-meta">
            <span className="meta-item">
              <FiUser className="meta-icon" />
              <span>Created by {quiz.creatorName || 'Anonymous'}</span>
            </span>
            <span className="meta-divider">•</span>
            <span className="meta-item">
              <FiAward className="meta-icon" />
              <span>{quiz.questions.length} {quiz.questions.length === 1 ? 'Question' : 'Questions'}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="quiz-content">
        {quiz.questions.map((q, i) => (
          <div key={i} className="question-card">
            <div className="question-header">
              <div className="question-number-container">
                <span className="question-number">Question {i+1}</span>
                <span className="question-points">{q.points || 1} pt</span>
              </div>
              <h3 className="question-text">{q.question}</h3>
              
              {q.mediaType === "image" && (
                <div className="media-container">
                  <img src={q.mediaUrl} alt="Question visual aid" className="question-media" />
                </div>
              )}

              {q.mediaType === "audio" && (
                <div className="media-container">
                  <div className="audio-player">
                    <audio controls className="media-audio">
                        <source src={q.mediaUrl} type="audio/mpeg" />
                      </audio>
                  </div>
                </div>
              )}

              {q.mediaType === "gif" && (
                <div className="media-container">
                  <img src={q.mediaUrl} alt="Animated illustration" className="question-media" />
                </div>
              )}

              {q.mediaType === "video" && (
                <div className="media-container video-container">
                  <iframe
                    className="question-media"
                    src={`https://www.youtube.com/embed/${extractYouTubeId(q.mediaUrl)}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
            
            <ul className="options-grid">
              {q.options.map((opt, j) => (
                <li
                  key={j}
                  className={`option-card ${q.correct.includes(opt) ? 'correct' : ''}`}
                >
                  <div className="option-letter">
                    {String.fromCharCode(65 + j)}
                  </div>
                  <div className="option-content">
                    <p className="option-text">{opt}</p>
                    {q.correct.includes(opt) && (
                      <div className="correct-indicator">
                        <FiCheck className="correct-icon" />
                        <span>Correct Answer</span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="view-only-banner">
        <FiEyeOff className="banner-icon" />
        <p className="banner-text">This is a view-only version - answers are revealed for learning purposes</p>
      </div>
    </div>
  );
}

export default ViewQuizPage;