// client/src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateQuiz from './pages/CreateQuiz';
import QuizList from './pages/QuizList';
import StartQuiz from './pages/StartQuiz';
import HostPage from './pages/HostPage';
import JoinPage from './pages/JoinPage';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/quiz-list" element={<QuizList />} />
        <Route path="/start/:id" element={<StartQuiz />} />
        <Route
          path="/host"
          element={ 
            <ProtectedRoute>
              <HostPage />
            </ProtectedRoute>
          }
        />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/admindashboard" element={<AdminDashboard/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
    <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}

export default App;
