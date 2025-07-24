import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/Myquizzes.css';

function Myquizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuiz, setExpandedQuiz] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));

      fetch(`${process.env.REACT_APP_API_URL}/api/quiz/by-user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setQuizzes(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load quizzes', err);
          setLoading(false);
        });
    }
  }, [navigate]);

  const toggleQuizExpand = (quizId) => {
    setExpandedQuiz(expandedQuiz === quizId ? null : quizId);
  };

  const handleEditQuiz = (quizId, e) => {
    e.stopPropagation();
    navigate(`/quiz/${quizId}/edit`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your quizzes...</p>
      </div>
    );
  }

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h2>No quizzes created yet</h2>
        <p>Get started by creating your first quiz!</p>
        <button 
          onClick={() => navigate('/create-quiz')}
          className="create-quiz-btn"
        >
          Create New Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="my-quizzes-page">
      <div className="quizzes-header">
        <h1 className="page-title">My Quizzes</h1>
        <button 
          onClick={() => navigate('/create-quiz')}
          className="create-quiz-btn"
        >
          + New Quiz
        </button>
      </div>

      <div className="quizzes-list">
        {quizzes.map((quiz) => (
          <div 
            key={quiz._id} 
            className={`quiz-card ${expandedQuiz === quiz._id ? 'expanded' : ''}`}
          >
            <div 
              className="quiz-summary"
              onClick={() => toggleQuizExpand(quiz._id)}
            >
              <div className="quiz-header">
                <h3 className="quiz-title">{quiz.title}</h3>
                <span className="question-count">
                  {quiz.questions?.length || 0} questions
                </span>
              </div>
              
              <div className="quiz-meta">
                <span className="meta-item">
                  <span className="meta-icon">📅</span>
                  {new Date(quiz.createdAt).toLocaleDateString()}
                </span>
                {/* <span className="meta-item">
                  <span className="meta-icon">👤</span>
                  {quiz.participants || 0} participants
                </span> */}
              </div>
              
              <div className="expand-icon">
                {expandedQuiz === quiz._id ? '▲' : '▼'}
              </div>
            </div>

            {expandedQuiz === quiz._id && (
              <div className="quiz-details">
                <div className="questions-container">
                  {quiz.questions?.map((question, qIndex) => (
                    <div key={qIndex} className="question-block">
                      <div className="question-header">
                        <span className="question-number">Q{qIndex + 1}</span>
                        <h4 className="question-text">{question.question}</h4>
                      </div>
                      
                      <ul className="options-list">
                        {question.options?.map((option, oIndex) => (
                          <li 
                            key={oIndex}
                            className={`option-item ${option === question.correct ? 'correct' : ''}`}
                          >
                            {option}
                            {option === question.correct && (
                              <span className="correct-badge">Correct</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                {/* <div className="quiz-actions">
                  <button 
                    onClick={(e) => handleEditQuiz(quiz._id, e)}
                    className="action-btn edit-btn"
                  >
                    Edit Quiz
                  </button>
                </div> */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Myquizzes;