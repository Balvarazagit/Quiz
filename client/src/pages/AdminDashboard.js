import React, { useEffect, useState } from 'react';
import AdminLogin from './AdminLogin';
import { 
  FiSearch, 
  FiCalendar, 
  FiTrash2, 
  FiAward, 
  FiStar,
  FiChevronDown,
  FiFilter,
  FiX,
} from 'react-icons/fi';
import '../pages/styles/AdminDashboard.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FILTER_OPTIONS = [
  { label: 'All Time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: 'last7' },
  { label: 'This Month', value: 'month' },
];
const TABS = ['Users', 'Quiz Results', 'Quizzes','Messages'];  

function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('Users');
  const [results, setResults] = useState([]);  
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [searchPIN, setSearchPIN] = useState('');
  const [filter, setFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [quizSearch, setQuizSearch] = useState('');
  const [quizSortBy, setQuizSortBy] = useState('date');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Results Fetch
  useEffect(() => {
    if (!loggedIn) return;

    const query = new URLSearchParams();
    if (searchPIN) query.append('pin', searchPIN);
    if (filter) query.append('filter', filter);

    fetch(`${process.env.REACT_APP_API_URL}/api/results/all?${query.toString()}`)
      .then((res) => res.json())
      .then(setResults)
      .catch(console.error);
  }, [loggedIn, searchPIN, filter]);

  // Users Fetch
  useEffect(() => {
    if (loggedIn) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users`)
        .then(res => res.json())
        .then(setUsers)
        .catch(console.error);
    }
  }, [loggedIn]);

  // Quizzes Fetch
  useEffect(() => {
    if (loggedIn) {
      fetch(`${process.env.REACT_APP_API_URL}/api/quiz/admin/all`)
        .then(res => res.json())
        .then(setQuizzes)
        .catch(console.error);
    }
  }, [loggedIn]);

  // Messages Fetch
  useEffect(() => {
  if (loggedIn) {
    fetch(`${process.env.REACT_APP_API_URL}/api/messages`)
      .then(res => res.json())
      .then(setMessages)
      .catch(console.error);
  }
}, [loggedIn]);

  const handleDeleteResults = async (id) => {
    if (!window.confirm('Delete this quiz result?')) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/results/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      toast.success(data.message || 'Deleted');
      setResults(prev => prev.filter(r => r._id !== id));
    } catch (e) {
      toast.error('Error deleting result.');
      console.error(e);
    }
  };

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

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

  const handleDeleteQuiz = async (quizId) => {
    const confirm = window.confirm("Are you sure you want to delete this quiz?");
    if (!confirm) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/quiz/${quizId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      toast.success(data.message);
      setQuizzes(prev => prev.filter(q => q._id !== quizId));
    } catch (err) {
      console.error("Error deleting quiz:", err);
      toast.error("Failed to delete quiz");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/users/${userId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setUsers(prev => prev.filter(user => user._id !== userId));
      } else {
        toast.error('Failed to delete user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting user');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this message?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
      },
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'Message deleted successfully');
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
      } else {
        toast.error(data.message || 'Failed to delete message');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting message');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-glass">
        {/* Header */}
        <div className="dashboard-header">
          <h1>
            <span className="header-icon">🌱</span>
            Quiz Admin Portal
          </h1>
          <div className="header-accent"></div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
              {activeTab === tab && <span className="tab-underline"></span>}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === 'Users' && (
          <div className="tab-content">
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
            
            {filteredUsers.length === 0 ? (
              <div className="empty-state">
                <img src="/empty-users.svg" alt="No users" />
                <p>No users found</p>
              </div>
            ) : (
              <div className="user-cards">
                {filteredUsers.map(user => (
                  <div key={user._id} className="user-card">
                    <div className="user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                      <h3>{user.name}</h3>
                      <p>{user.email}</p>
                      <div className="user-id">{isMobile ? `${user._id}` : user._id}</div>
                    </div>
                    <button 
                      onClick={() => handleDeleteUser(user._id)}
                      className="delete-btn"
                    >
                      {isMobile ? '🗑️' : '🗑️ Delete'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quiz Results Tab */}
        {activeTab === 'Quiz Results' && (
          <div className="results-tab">
            <div className="results-header">
              <div className="search-filter">
                <div className="search-bar">
                  <FiSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by PIN..."
                    value={searchPIN}
                    onChange={(e) => setSearchPIN(e.target.value)}
                  />
                </div>
                {isMobile ? (
                  <>
                    <button 
                      className="mobile-filter-btn"
                      onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                    >
                      <FiFilter /> Filters
                    </button>
                    {mobileFilterOpen && (
                      <div className="mobile-filter-dropdown">
                        <div className="filter-header">
                          <h4>Filter Options</h4>
                          <button onClick={() => setMobileFilterOpen(false)}>
                            <FiX />
                          </button>
                        </div>
                        {FILTER_OPTIONS.map((f) => (
                          <button
                            key={f.value}
                            className={`filter-option ${filter === f.value ? 'active' : ''}`}
                            onClick={() => {
                              setFilter(f.value);
                              setMobileFilterOpen(false);
                            }}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="time-filter"
                  >
                    {FILTER_OPTIONS.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                )}
              </div>
              <div className="stats-card">
                <div className="stat-item">
                  <span className="stat-value">{results.length}</span>
                  <span className="stat-label">Results</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {results.reduce((acc, curr) => acc + curr.players.length, 0)}
                  </span>
                  <span className="stat-label">Participants</span>
                </div>
              </div>
            </div>

            {results.length === 0 ? (
              <div className="empty-results">
                <div className="empty-state">
                  <svg
                    viewBox="0 0 400 300"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ maxWidth: '100%' }}
                  >
                    <style>
                      {`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
            @keyframes rotate {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .magnifier {
              animation: float 3s ease-in-out infinite;
            }
            .glass {
              animation: pulse 2s ease infinite;
            }
            .search-line {
              stroke-dasharray: 100;
              stroke-dashoffset: 100;
              animation: dash 1.5s linear infinite;
            }
            @keyframes dash {
              to { stroke-dashoffset: 0; }
            }
            .confetti {
              opacity: 0;
            }
            .confetti:nth-child(1) { animation: fall 3s ease-in infinite; }
            .confetti:nth-child(2) { animation: fall 3s ease-in 0.5s infinite; }
            .confetti:nth-child(3) { animation: fall 3s ease-in 1s infinite; }
            .confetti:nth-child(4) { animation: fall 3s ease-in 1.5s infinite; }
            .confetti:nth-child(5) { animation: fall 3s ease-in 2s infinite; }
            @keyframes fall {
              0% { transform: translateY(-50px) rotate(0deg); opacity: 0; }
              20% { opacity: 1; }
              100% { transform: translateY(200px) rotate(360deg); opacity: 0; }
            }
          `}
                    </style>

                    {/* Background */}
                    <rect width="400" height="300" fill="#f8f9fa" rx="10" />

                    {/* Magnifier with animation */}
                    <g className="magnifier" transform="translate(150, 80)">
                      <circle className="glass" cx="50" cy="50" r="40" fill="none" stroke="#6c757d" strokeWidth="4" strokeDasharray="5,5" />
                      <path d="M90 90 L120 120" stroke="#6c757d" strokeWidth="4" strokeLinecap="round" className="search-line" />
                      <circle cx="50" cy="50" r="30" fill="none" stroke="#6c757d" strokeWidth="2" />
                      <path d="M50 30 A20 20 0 0 1 50 70 A20 20 0 0 1 50 30 Z" fill="#e9ecef" />
                    </g>

                    {/* Confetti animation */}
                    <rect className="confetti" x="50" y="-20" width="15" height="15" fill="#ff6b6b" rx="3" />
                    <rect className="confetti" x="100" y="-20" width="15" height="15" fill="#4ecdc4" rx="3" transform="rotate(45)" />
                    <rect className="confetti" x="200" y="-20" width="15" height="15" fill="#ffe66d" rx="3" />
                    <rect className="confetti" x="250" y="-20" width="15" height="15" fill="#a5d8ff" rx="3" transform="rotate(30)" />
                    <rect className="confetti" x="300" y="-20" width="15" height="15" fill="#b2f2bb" rx="3" transform="rotate(60)" />

                    {/* Text */}
                    <text x="200" y="180" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" textAnchor="middle" fill="#495057">
                      No Results Found
                    </text>

                    {/* Modern decorative elements */}
                    <circle cx="50" cy="50" r="5" fill="#ff6b6b" opacity="0.7">
                      <animate attributeName="r" values="5;8;5" dur="4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="350" cy="250" r="7" fill="#4ecdc4" opacity="0.7">
                      <animate attributeName="r" values="7;10;7" dur="3s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </div>
                <p>Try adjusting your search or time filter</p>
              </div>
            ) : (
             <div className="results-grid">
  {results.map((result) => (
    <div key={result._id} className="result-card">
      <div className="card-header">
        <div className="quiz-meta">
          <span className="quiz-pin">
            <FiChevronDown className="icon-sm" /> PIN: {result.pin}
          </span>
          <span className="quiz-date">
            <FiCalendar className="icon-sm" /> 
            {new Date(result.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
        <button 
          onClick={() => handleDeleteResults(result._id)}
          className="delete-btn"
          aria-label="Delete results"
        >
          <FiTrash2 />
        </button>
      </div>

      <div className="player-leaderboard">
        <div className="leaderboard-header">
          <span>Rank</span>
          <span>Player</span>
          <span>Score</span>
        </div>
        <div className="leaderboard-body">
          {result.players.map((player, idx) => (
            <div 
              key={idx} 
              className={`player-row ${idx < 3 ? 'podium-' + (idx + 1) : ''}`}
            >
              <span className="player-rank">
                {idx === 0 ? <FiAward className="gold" /> : 
                idx === 1 ? <FiAward className="silver" /> : 
                idx === 2 ? <FiAward className="bronze" /> : `#${idx + 1}`}
              </span>
              <span className="player-name">
                <span className="name-text">
                  {player.name}
                  {player.userId && (
                    <span className="player-id">
                      ({player.userId.slice(0, 6)})
                    </span>
                  )}
                </span>
                {idx < 3 && <span className="podium-badge">Top {idx + 1}</span>}
              </span>
              <span className="player-score">
                {player.score} <FiStar className="score-icon" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ))}
</div>
            )}
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === 'Quizzes' && (
          <div className="quizzes-tab">
            <div className="quizzes-header">
              <div className="header-content">
                <h2 className="section-title">
                  <span className="title-icon">🧩</span>
                  Quiz Management
                </h2>
                <p className="section-subtitle">View and manage all created quizzes</p>
              </div>
              
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
            </div>

            {filteredQuizzes.length === 0 ? (
              <div className="empty-state glassmorphism">
                <div className="empty-illustration">
                  <div className="puzzle-piece">🧩</div>
                  <div className="magnifying-glass">🔍</div>
                </div>
                <h3>No quizzes match your search</h3>
                <p>Try different keywords or create a new quiz</p>
                <button 
                  onClick={() => { setQuizSearch(''); setQuizSortBy('date'); }}
                  className="reset-btn neon-hover"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="quiz-cards-container">
                {filteredQuizzes.map(quiz => (
                  <div key={quiz._id} className="quiz-card glassmorphism">
                    <div className="card-header">
                      <div className="quiz-title-wrapper">
                        <h3 className="quiz-title">{quiz.title}</h3>
                      </div>
                      <div className="quiz-id-wrapper">
                        {!isMobile ? <span className="id-label">ID:</span> : ''}
                        <span className="quiz-id" title={quiz._id}>
                          {isMobile ? `${quiz._id}` : quiz._id}
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
                      <button 
                        onClick={() => handleDeleteQuiz(quiz._id)}
                        className="delete-btn slide-hover"
                      >
                        <span className="btn-icon">🗑️</span>
                        {!isMobile && <span className="btn-text">Delete Quiz</span>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'Messages' && (
          <div className="messages-tab">
            <div className="messages-header">
              <h2>
                <span className="header-icon">✉️</span>
                User Messages
              </h2>
              <p>View messages submitted by users through the contact form</p>
            </div>

            {messages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-illustration">
                  <svg viewBox="0 0 200 150">
                    <path d="M40,30 L160,30 L180,50 L180,130 L20,130 L20,50 Z" fill="#f0f4f8" stroke="#4CAF50" strokeWidth="2" />
                    <path d="M40,30 L160,30 L180,50 L40,50 Z" fill="#4CAF50" opacity="0.2" />
                    <path d="M60,70 L140,70 M60,90 L140,90 M60,110 L120,110" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h3>No messages yet</h3>
                <p>Messages submitted through the contact form will appear here</p>
              </div>
            ) : (
              <div className="messages-list">
                {messages.map(message => (
                  <div key={message._id} className="message-card">
                    <div className="message-header">
                      <div className="sender-info">
                        <span className="sender-name">{message.name}</span>
                        <span className="sender-email">{message.email}</span>
                      </div>
                      <div className="message-actions">
                        <span className="message-date">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleDeleteMessage(message._id)}
                          className="delete-btn"
                          title="Delete message"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    <div className="message-content">
                      <p>{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;