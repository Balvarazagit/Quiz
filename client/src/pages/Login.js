// client/src/pages/Login.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../pages/styles/auth.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Login successful');
      navigate('/dashboard');
    } else {
      toast.error(data.message || 'Login failed');
    }
  };

  return (
    <form className="auth-wrapper" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
          <div className="password-field">
              <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
              />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
          </div>
      <button type="submit">Login</button>
      <p>Don't have an account? <Link to="/">Register here</Link></p>   
    </form>
  );
}

export default Login;
