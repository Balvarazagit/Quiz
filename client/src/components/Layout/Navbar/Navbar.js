import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🧩</span>
          <span className="logo-text">QuizMaster</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <NavLink to="/" currentPath={location.pathname}>Home</NavLink>
          <NavLink to="/about" currentPath={location.pathname}>About</NavLink>
          <NavLink to="/contact" currentPath={location.pathname}>Contact</NavLink>
          <Link to="/login" className="navbar-cta pulse-effect">
            Start Quizzing
          </Link>
        </div>  

        <button 
          className={`hamburger ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

const NavLink = ({ to, currentPath, children }) => (
  <Link 
    to={to} 
    className={`navbar-link ${currentPath === to ? 'active' : ''}`}
    aria-current={currentPath === to ? 'page' : undefined}
  >
    {children}
    <span className="link-underline"></span>
  </Link>
);

export default Navbar;