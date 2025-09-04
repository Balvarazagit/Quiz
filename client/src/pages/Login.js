import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../pages/styles/Login.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1 = email+password, 2 = OTP
  const [otp, setOtp] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Step 1 → Email + Password
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.otpSent) {
        toast.info('📩 OTP sent to your email');
        setTempEmail(form.email);
        setStep(2); // switch to OTP form
      } else {
        toast.error(`❗ ${data.message || 'Login failed. Try again!'}`);
      }
    } catch (err) {
      toast.error('⚠️ Network error. Please check your connection');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 → OTP Verify
  const handleOtpVerify = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: tempEmail, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('🎉 Login successful!');
        navigate('/dashboard');
      } else {
        toast.error(`❗ ${data.message || 'Invalid OTP!'}`);
      }
    } catch (err) {
      toast.error('⚠️ Network error. Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-login-container">
      <motion.div
        className="quiz-login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="quiz-login-header">
          <div className="quiz-login-icon">?</div>
          <h2>Welcome to QuizMaster</h2>
          <p>Sign in to continue your quiz journey</p>
        </div>

        <form
          className="quiz-login-form"
          onSubmit={step === 1 ? handleSubmit : handleOtpVerify}
        >
          {step === 1 ? (
            <>
              <div className="quiz-form-group">
                <label htmlFor="email">
                  <FaUser className="login-input-icon" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  required
                  className="quiz-input"
                />
              </div>

              <div className="quiz-form-group">
                <label htmlFor="password">
                  <FaLock className="login-input-icon" />
                  <span>Password</span>
                </label>
                <div className="quiz-password-field">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    required
                    className="quiz-input"
                  />
                  <button
                    type="button"
                    className="quiz-eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="quiz-form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="6-digit code"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                className="quiz-input"
              />
            </div>
          )}

          <div className="quiz-login-options">
            <Link to="/forgot-password" className="quiz-forgot-password">
              Forgot Password?
            </Link>
          </div>

          <motion.button
            type="submit"
            className="quiz-login-button"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <span className="quiz-spinner"></span>
            ) : step === 1 ? (
              'Send OTP'
            ) : (
              'Verify OTP'
            )}
          </motion.button>

          <div className="quiz-login-footer">
            <p>
              New to QuizMaster?{' '}
              <Link to="/register" className="quiz-auth-link">
                Create account
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
