// client/src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateQuiz from './pages/CreateQuiz';
import HostPage from './pages/HostPage';
import JoinPage from './pages/JoinPage';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import Myquizzes from './pages/Myquizzes';
import Analytics from './pages/Analytics';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import FAQ from './pages/FAQ';
import ViewQuizPage from './pages/ViewQuizPage';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        <Route path="/create-quiz" element={<CreateQuiz />} />
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
        <Route path="/my-quizzes" element={<Myquizzes/>} />
        <Route path="*" element={<NotFound />} />
        <Route path='/analytics' element={<Analytics/>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/view-quiz/:quizId" element={<ViewQuizPage />} />

      </Routes>
    </Router>
    <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}

export default App;
