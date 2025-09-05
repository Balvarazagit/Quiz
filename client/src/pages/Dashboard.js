import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/Dashboard.css';
import logo from "../assests/logo-1.png";

// React Icons imports
import { 
  FiHome, 
  FiFileText, 
  FiPlusCircle, 
  FiBarChart2, 
  FiLogOut,
  FiMenu,
  FiX,
  FiAward,
  FiBook,
  FiPieChart,
  FiSun,
  FiMoon
} from 'react-icons/fi';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Theme state

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  // Check for saved theme preference on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkTheme(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

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
        .then((data) => setQuizzes(data))
        .catch((err) => console.error('Failed to load quizzes', err));
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      {/* Theme Toggle Button */}
      <button 
        className="theme-toggle theme-toggle-dashboard" 
        onClick={toggleTheme} 
        aria-label="Toggle theme"
      >
        {isDarkTheme ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>
      
      {/* Mobile Header */}
      {windowWidth <= 768 && (
        <div className="mobile-header">
          <button 
            className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <FiX size={24} className="hamburger-icon" />
            ) : (
              <FiMenu size={24} className="hamburger-icon" />
            )}
          </button>
          <div className="mobile-logo"><img className='mobile-logo-dashboard' src={logo} alt="logo"/> QuizMaster</div>
          <div className="mobile-user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
         {isMobileMenuOpen ? '' : <div className="logo"><img className='logo-dashboard' src={logo} alt="logo"/> QuizMaster</div>}
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            onClick={() => {
              navigate('/dashboard');
              setIsMobileMenuOpen(false);
            }}
            className="nav-item active"
          >
            <span className="nav-icon"><FiHome size={20} /></span>
            <span className="nav-text">Dashboard</span>
          </button>
          <button 
            onClick={() => {
              navigate('/my-quizzes');
              setIsMobileMenuOpen(false);
            }}
            className="nav-item"
          >
            <span className="nav-icon"><FiFileText size={20} /></span>
            <span className="nav-text">My Quizzes</span>
          </button>
          <button 
            onClick={() => {
              navigate('/create-quiz');
              setIsMobileMenuOpen(false);
            }}
            className="nav-item"
          >
            <span className="nav-icon"><FiPlusCircle size={20} /></span>
            <span className="nav-text">Create Quiz</span>
          </button>
          <button 
            onClick={() => {
              navigate('/analytics');
              setIsMobileMenuOpen(false);
            }}
            className="nav-item"
          >
            <span className="nav-icon"><FiBarChart2 size={20} /></span>
            <span className="nav-text">Analytics</span>
          </button>
        </nav>

        <button onClick={logout} className="logout-btn">
          <span className="logout-icon"><FiLogOut size={20} /></span>
          <span className="logout-text">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome back, {user?.name}</h1>
          <p className="dashboard-subtitle">What would you like to do today?</p>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card primary" onClick={() => navigate('/create-quiz')}>
            <div className="card-icon"><FiPlusCircle size={28} /></div>
            <h3 className="card-title">Create New Quiz</h3>
            <p className="card-description">Design a custom quiz with multiple question types</p>
          </div>

          <div className="dashboard-card secondary" onClick={() => navigate('/my-quizzes')}>
            <div className="card-icon"><FiBook size={28} /></div>
            <h3 className="card-title">Manage Quizzes</h3>
            <p className="card-description">View your existing quizzes</p>
          </div>

          <div className="dashboard-card accent" onClick={() => navigate('/analytics')}>
            <div className="card-icon"><FiPieChart size={28} /></div>
            <h3 className="card-title">View Analytics</h3>
            <p className="card-description">See performance metrics for your quizzes</p>
          </div>
        </div>
      </main>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;