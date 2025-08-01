import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/Myquizzes.css';

function Myquizzes() {
  const [quizzes, setQuizzes] = useState([]);
  console.log("myquizzes",quizzes);
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

  const handlePublishAndShare = async (quizId) => {
  const token = localStorage.getItem('token');
  try {
    // Step 1: Publish quiz
    const publishRes = await fetch(`${process.env.REACT_APP_API_URL}/api/quiz/${quizId}/publish`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const publishData = await publishRes.json();
    if (!publishRes.ok) throw new Error(publishData.message || 'Failed to publish');

    // Step 2: Share link
    const shareUrl = `${window.location.origin}/view-quiz/${quizId}`;

    if (navigator.share) {
      await navigator.share({
        title: 'View My Quiz on QuizMaster!',
        text: 'Check out this quiz I created',
        url: shareUrl,
      });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Link copied to clipboard!');
    }
  } catch (err) {
    console.error('Publish & Share error:', err);
    alert('Failed to publish/share quiz. Please try again.');
  }
};


   const handleGoBack = () => {
    navigate(-1); // Goes back to previous page
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
        <button 
          onClick={handleGoBack}
          className="back-button-myquizzes"
          aria-label="Go back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <div className="empty-icon">📝</div>
        <h2>No quizzes created yet</h2>
        <p>Get started by creating your first quiz!</p>
        <button 
          onClick={() => navigate('/create-quiz')}
          className="create-quiz-btn pulse"
        >
          Create New Quiz
        </button>
      </div>
    );
  }
  


  return (
    <div className="my-quizzes-page">
        <button 
        onClick={handleGoBack}
        className="back-button-myquizzes"
        aria-label="Go back"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </button>
      <div className="quizzes-header">
        <div className="header-content">
          <h1 className="page-title">My Quizzes</h1>
          <p className="page-subtitle">Manage and edit your quiz collection</p>
        </div>
         <div className="header-buttons">
        <button
          onClick={() => navigate('/host')}  // Update this route as needed
          className="host-quiz-btn"
        >
          <span className="host-icon-quizzes">🎮</span> Host Quiz
        </button>
        <button 
          onClick={() => navigate('/create-quiz')}
          className="create-quiz-btn pulse"
        >
          <span className="plus-icon">+</span> New Quiz
        </button>
        </div>
      </div>

      <div className="quizzes-list">
        {quizzes.map((quiz) => (
          <div 
            key={quiz._id} 
            className={`quiz-card-myquizzes ${expandedQuiz === quiz._id ? 'expanded' : ''}`}
          >
            <div 
              className="quiz-summary"
              onClick={() => toggleQuizExpand(quiz._id)}
            >
              <div className="quiz-header">
                <div className="quiz-title-wrapper">
                  <h3 className="quiz-title">{quiz.title}</h3>
                  <span className="quiz-status-badge">
                    {quiz.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <div className="quiz-id-myquizzes" style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
                    ID: {quiz._id}
                  </div>
                </div>
                <span className="question-count">
                  {quiz.questions?.length || 0} {quiz.questions?.length === 1 ? 'question' : 'questions'}
                </span>
              </div>
              
              <div className="quiz-meta">
                <span className="meta-item">
                  <span className="meta-icon">📅</span>
                  Created: {new Date(quiz.createdAt).toLocaleDateString()}
                </span>
                {/* <span className="meta-item">
                  <span className="meta-icon">🔄</span>
                  Updated: {new Date(quiz.updatedAt).toLocaleDateString()}
                </span> */}
              </div>
              
              <div className="quiz-actions">
                {/* <button 
                  onClick={(e) => handleEditQuiz(quiz._id, e)}
                  className="action-btn edit-btn"
                >
                  Edit
                </button> */}
                <div className="expand-icon">
                  {expandedQuiz === quiz._id ? '▲' : '▼'}
                </div>
              </div>
            </div>

            {expandedQuiz === quiz._id && (
              <div className="quiz-details">
                {/* <div className="quiz-description">
                  {quiz.description || "No description provided"}
                </div> */}
                
                <div className="questions-container">
                  <h4 className="questions-title">Questions Preview</h4>
                  {quiz.questions?.map((question, qIndex) => (
                    <div key={qIndex} className="question-block">
                      <div className="question-header-myquizzes">
                        <span className="question-number-myquizzes">Q{qIndex + 1}</span>
                        <h4 className="question-text">{question.question}</h4>
                      </div>
                      
                      <ul className="options-list">
                        {question.options?.map((option, oIndex) => (
                          <li 
                            key={oIndex}
                            className={`option-item ${option === question.correct ? 'correct' : ''}`}
                          >
                            <span className="option-letter">
                              {String.fromCharCode(65 + oIndex)}.
                            </span>
                            {option}
                            {option === question.correct && (
                              <span className="correct-badge">
                                <span className="check-icon">✓</span>
                                <span className="correct-text-label">Correct Answer</span>
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                <div className="quiz-footer-actions">
                  <button className="action-btn share-btn"  onClick={() => handlePublishAndShare(quiz._id)}>
                    Publish & Share Quiz
                  </button>

                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Myquizzes; 