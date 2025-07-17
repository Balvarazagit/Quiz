// client/src/pages/Register.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../pages/styles/auth.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success('Registration successful');
      navigate('/login');
    } else {
      toast.error(data.message || 'Registration failed');
    }
  };

  return (
    <form className="auth-wrapper" onSubmit={handleSubmit}>
      <h2>Create Account</h2>
      <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
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
      <button type="submit">Register</button>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </form>
  );
}

export default Register;
