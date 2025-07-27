import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../pages/styles/Register.css';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('🎉 Registration successful! Get ready to quiz!');
        navigate('/login');
      } else {
        toast.error(data.message || '❌ Registration failed. Please try again.');
      }
    } catch (error) {
      toast.error('🌐 Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-register-container">
      <motion.div 
        className="quiz-register-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="quiz-register-header">
          <div className="quiz-icon">?</div>
          <h2>Join QuizMaster</h2>
          <p>Create your account to start quizzing</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="quiz-form-group">
            <label htmlFor="name">
              <FaUser className="register-input-icon" />
              <span>Full Name</span>
            </label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Enter your full name" 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="quiz-form-group">
            <label htmlFor="email">
              <FaEnvelope className="register-input-icon" />
              <span>Email Address</span>
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Enter your email" 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="quiz-form-group">
            <label htmlFor="password">
              <FaLock className="register-input-icon" />
              <span>Password</span>
            </label>
            <div className="quiz-register-password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Create a password"
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                className="quiz-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="password-strength">
              <div className={`strength-bar ${form.password.length > 0 ? 'active' : ''} ${form.password.length > 8 ? 'strong' : ''}`}></div>
              <span>{form.password.length > 8 ? 'Strong password' : form.password.length > 0 ? 'Weak password' : ''}</span>
            </div>
          </div>

          <motion.button 
            type="submit" 
            className="quiz-register-btn" 
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <span className="quiz-spinner"></span>
            ) : (
              <>
                <FaSignInAlt /> Sign Up Now
              </>
            )}
          </motion.button>
        </form>

        <div className="quiz-login-redirect">
          <p>Already have an account? <Link to="/login">Log in here</Link></p>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;