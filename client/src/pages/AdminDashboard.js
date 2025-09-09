import React, { useEffect, useState } from 'react';
import AdminLogin from './AdminLogin';
import DashboardHeader from '../components/AdminDashboard/DashboardHeader/DashboardHeader';
import TabNavigation from '../components/AdminDashboard/TabNavigation/TabNavigation';
import UsersTab from '../components/AdminDashboard/UsersTab/UsersTab';
import QuizResultsTab from '../components/AdminDashboard/QuizResultsTab/QuizResultsTab';
import QuizzesTab from '../components/AdminDashboard/QuizzesTab/QuizzesTab';
import MessagesTab from '../components/AdminDashboard/MessagesTab/MessagesTab';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/AdminDashboard.css';

function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('Users');
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchPIN, setSearchPIN] = useState('');
  const [filter, setFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

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

  const handleDeleteQuiz = async (quizId) => {
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

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-glass">
        <DashboardHeader isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} isDarkTheme={isDarkTheme} />
        
        {activeTab === 'Users' && (
          <UsersTab 
            users={users} 
            onDeleteUser={handleDeleteUser}
            isMobile={isMobile}
            isDarkTheme={isDarkTheme}
          />
        )}
        
        {activeTab === 'Quiz Results' && (
          <QuizResultsTab
            results={results}
            onDeleteResults={handleDeleteResults}
            isMobile={isMobile}
            searchPIN={searchPIN}
            setSearchPIN={setSearchPIN}
            filter={filter}
            setFilter={setFilter}
            isDarkTheme={isDarkTheme}
          />
        )}
        
        {activeTab === 'Quizzes' && (
          <QuizzesTab
            quizzes={quizzes}
            onDeleteQuiz={handleDeleteQuiz}
            isMobile={isMobile}
            isDarkTheme={isDarkTheme}
          />
        )}
        
        {activeTab === 'Messages' && (
          <MessagesTab
            messages={messages}
            onDeleteMessage={handleDeleteMessage}
            isDarkTheme={isDarkTheme}
          />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;