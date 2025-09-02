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
    // if (!window.confirm('Delete this quiz result?')) return;

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
    // const confirm = window.confirm("Are you sure you want to delete this quiz?");
    // if (!confirm) return;

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
    // const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    // if (!confirmDelete) return;

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
    // const confirmDelete = window.confirm("Are you sure you want to delete this message?");
    // if (!confirmDelete) return;

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

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-glass">
        <DashboardHeader />
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 'Users' && (
          <UsersTab 
            users={users} 
            onDeleteUser={handleDeleteUser}
            isMobile={isMobile}
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
          />
        )}
        
        {activeTab === 'Quizzes' && (
          <QuizzesTab
            quizzes={quizzes}
            onDeleteQuiz={handleDeleteQuiz}
            isMobile={isMobile}
          />
        )}
        
        {activeTab === 'Messages' && (
          <MessagesTab
            messages={messages}
            onDeleteMessage={handleDeleteMessage}
          />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;