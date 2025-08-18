import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/Myquizzes.css';

function Myquizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuiz, setExpandedQuiz] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
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

  const handlePublishAndShare = async (quizId) => {
    const token = localStorage.getItem('token');
    try {
      const publishRes = await fetch(`${process.env.REACT_APP_API_URL}/api/quiz/${quizId}/publish`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const publishData = await publishRes.json();
      if (!publishRes.ok) throw new Error(publishData.message || 'Failed to publish');

      setQuizzes(prev => prev.map(q => 
        q._id === quizId ? { ...q, isPublished: true } : q
      ));

      const shareUrl = `${window.location.origin}/view-quiz/${quizId}`;
      if (navigator.share) {
        await navigator.share({
          title: 'View My Quiz on QuizMaster!',
          text: 'Check out this quiz I created',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('Quiz link copied to clipboard!');
      }
    } catch (err) {
      console.error('Publish & Share error:', err);
      alert('Failed to publish/share quiz. Please try again.');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/quiz/${quizId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete quiz');
      }

      setQuizzes(prev => prev.filter(q => q._id !== quizId));
      alert('Quiz deleted successfully!');
    } catch (err) {
      console.error('Delete quiz error:', err);
      alert('Failed to delete quiz. Please try again.');
    }
  };

  const handleGoBack = () => navigate(-1);

  const filteredQuizzes = quizzes.filter(quiz => {
    if (activeTab === 'published') return quiz.isPublished;
    if (activeTab === 'drafts') return !quiz.isPublished;
    return true;
  });

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
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
        <button onClick={handleGoBack} className="back-button-myquizzes">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <div className="empty-icon">📝</div>
        <h2>No quizzes created yet</h2>
        <p>Get started by creating your first quiz!</p>
        <button onClick={() => navigate('/create-quiz')} className="create-quiz-btn pulse">
          Create New Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="my-quizzes-page">
      <button onClick={handleGoBack} className="back-button-myquizzes">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </button>
      
      <div className="quizzes-header">
        <div className="header-content">
          <h1 className="page-title">My Quizzes</h1>
          <p className="page-subtitle">Manage and share your quiz collection</p>
          
          <div className="tabs">
            <button 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Quizzes
            </button>
            <button 
              className={`tab-btn ${activeTab === 'published' ? 'active' : ''}`}
              onClick={() => setActiveTab('published')}
            >
              Published
            </button>
            <button 
              className={`tab-btn ${activeTab === 'drafts' ? 'active' : ''}`}
              onClick={() => setActiveTab('drafts')}
            >
              Drafts
            </button>
          </div>
        </div>
        
        <div className="header-buttons">
          <button onClick={() => navigate('/host')} className="host-quiz-btn">
            <span className="host-icon-quizzes">🎮</span> Host Quiz
          </button>
          <button onClick={() => navigate('/create-quiz')} className="create-quiz-btn pulse">
            <span className="plus-icon">+</span> New Quiz
          </button>
        </div>
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="empty-filter-state">
          <p>No {activeTab === 'published' ? 'published' : 'draft'} quizzes found</p>
          <button onClick={() => navigate('/create-quiz')} className="create-quiz-btn">
            Create New Quiz
          </button>
        </div>
      ) : (
        <div className="quizzes-list">
          {filteredQuizzes.map((quiz) => (
            <div 
              key={quiz._id} 
              className={`quiz-card-myquizzes ${expandedQuiz === quiz._id ? 'expanded' : ''}`}
            >
              <div className="quiz-summary" onClick={() => toggleQuizExpand(quiz._id)}>
                <div className="quiz-header">
                  <div className="quiz-title-wrapper">
                    <h3 className="quiz-title">{quiz.title}</h3>
                    <span className={`quiz-status-badge ${quiz.isPublished ? 'published' : 'draft'}`}>
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
                    <svg className="meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 6V12L16 14" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Created: {new Date(quiz.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="quiz-actions">
                  <div className="expand-icon">
                    {expandedQuiz === quiz._id ? '▲' : '▼'}
                  </div>
                </div>
              </div>

              {expandedQuiz === quiz._id && (
                <div className="quiz-details">
                  <div className="questions-container">
                    <h4 className="questions-title">Questions Preview</h4>
                    {quiz.questions?.map((question, qIndex) => (
                      <div key={qIndex} className="question-block">
                        <div className="question-header-myquizzes">
                          <span className="question-number-myquizzes">Q{qIndex + 1}</span>
                          <h4 className="question-text">{question.question}</h4>
                          {question.mediaType === "image" && (
                            <img src={question.mediaUrl} alt="question" className="question-media-myquizzes" />
                          )}
                          {question.mediaType === "audio" && (
                            <audio controls className="question-media-myquizzes">
                              <source src={question.mediaUrl} type="audio/mpeg" />
                            </audio>
                          )}
                          {question.mediaType === "gif" && (
                            <img src={question.mediaUrl} alt="gif" className="question-media-myquizzes" />
                          )}
                          {question.mediaType === "video" && (
                            <iframe
                              className="question-media-myquizzes"
                              src={`https://www.youtube.com/embed/${extractYouTubeId(question.mediaUrl)}`}
                              title="YouTube video"
                              frameBorder="0"
                              allowFullScreen
                            />
                          )}
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
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  <span className="correct-text-label">Correct</span>
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  
                  <div className="quiz-footer-actions">
                    {!quiz.isPublished && (
                      <button 
                        className="action-btn publish-btn"
                        onClick={() => handlePublishAndShare(quiz._id)}
                      >
                        Publish & Share Quiz
                      </button>
                    )}
                    {quiz.isPublished && (
                      <button 
                        className="action-btn share-btn"
                        onClick={() => {
                          const shareUrl = `${window.location.origin}/view-quiz/${quiz._id}`;
                          navigator.clipboard.writeText(shareUrl);
                          alert('Quiz link copied to clipboard!');
                        }}
                      >
                        Copy Share Link
                      </button>
                    )}
                    <button
                      className="action-btn delete-btn-myquizzes"
                      onClick={() => handleDeleteQuiz(quiz._id)}
                    >
                      Delete Quiz
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Myquizzes;