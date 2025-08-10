import React from 'react';
import { Link } from 'react-router-dom';
import { FaBrain, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';
import logo from '../../../assests/logo-1.png'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-about">
          <div className="footer-logo">
            {/* <FaBrain className="logo-icon" /> */}
            <img className='logo-footer' src={logo} />
            <span>QuizMaster</span>
          </div>
          <p className="footer-description">
            Making learning fun and interactive through engaging quizzes and assessments for all age groups.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook" className="social-icon"><FaFacebook /></a>
            <a href="#" aria-label="Twitter" className="social-icon"><FaTwitter /></a>
            <a href="#" aria-label="Instagram" className="social-icon"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn" className="social-icon"><FaLinkedin /></a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">Home</Link></li>
            <li><Link to="/about" className="footer-link">About Us</Link></li>
            <li><Link to="/contact" className="footer-link">Contact</Link></li>
            <li><Link to="/" className="footer-link">Features</Link></li>
            <li><Link to="/host" className="footer-link">Take a Quiz</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Support</h4>
          <ul className="footer-links">
            <li><Link to="/contact" className="footer-link">Help Center</Link></li>
            <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
            <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
            <li><Link to="/faq" className="footer-link">FAQ</Link></li>
            <li><Link to="/contact" className="footer-link">Feedback</Link></li>
          </ul>
        </div>

        <div className="footer-section footer-contact-section">
          <h4 className="footer-title">Contact Us</h4>
          <ul className="footer-contact">
            <li>
              <FaEnvelope className="contact-icon" />
              <span>balvaraza2@gmail.com</span>
            </li>
            <li>
              <FaPhone className="contact-icon" />
              <span>+91 7698528935</span>
            </li>
            <li>
              <FaMapMarkerAlt className="contact-icon" />
              <span>701, Islampuravaas, Meta-Basu Rd, Basu, Meta, Gujarat 385520</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>© {currentYear} QuizMaster. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/terms">Terms</Link>
            <span className="divider">|</span>
            <Link to="/privacy">Privacy</Link>
            <span className="divider">|</span>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;