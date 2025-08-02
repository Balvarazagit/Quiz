import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiUser, FiClock, FiAward, FiEyeOff } from 'react-icons/fi';
import './styles/ViewQuizPage.css';

function ViewQuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
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

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading quiz content...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Error Loading Quiz</h3>
      <p>{error}</p>
      <button className="retry-button" onClick={() => window.location.reload()}>
        Try Again
      </button>
    </div>
  );

  if (!quiz) return (
    <div className="not-found-container">
      <div className="not-found-icon">🔍</div>
      <h3>Quiz Not Found</h3>
      <p>The requested quiz doesn't exist or may have been removed.</p>
    </div>
  );

  return (
    <div className="view-quiz-container">
      <div className="quiz-header">
        <div className="quiz-title-container">
          <h1 className="quiz-title">{quiz.title}</h1>
          <div className="quiz-meta">
            <span className="meta-item">
              <FiUser className="meta-icon" />
              {quiz.creatorName || 'Anonymous'}
            </span>
            <span className="meta-item">
              <FiAward className="meta-icon" />
              {quiz.questions.length} {quiz.questions.length === 1 ? 'Question' : 'Questions'}
            </span>
          </div>
        </div>
      </div>

      <div className="quiz-content">
        {quiz.questions.map((q, i) => (
          <div key={i} className="question-card">
            <div className="question-header">
              <span className="question-number">Question {i+1}</span>
              <h3 className="question-text">{q.question}</h3>
            </div>
            
            <ul className="options-grid">
              {q.options.map((opt, j) => (
                <li 
                  key={j}
                  className={`option-card ${opt === q.correct ? 'correct' : ''}`}
                >
                  <div className="option-letter">
                    {String.fromCharCode(65 + j)}
                  </div>
                  <div className="option-content">
                    <p>{opt}</p>
                    {opt === q.correct && (
                      <div className="correct-indicator">
                        <FiAward className="correct-icon" />
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
        <p>This is a view-only version - answers are revealed for learning purposes</p>
      </div>
    </div>
  );
}

export default ViewQuizPage;