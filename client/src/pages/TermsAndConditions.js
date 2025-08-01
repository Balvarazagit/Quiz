import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/TermsAndConditions.css';

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="terms-page">
      <div className="terms-card">
        <button 
          onClick={() => navigate(-1)}
          className="back-button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </button>
        
        <header className="terms-header">
          <div className="terms-icon">📜</div>
          <h1>Terms and Conditions</h1>
          <p className="effective-date">Last updated: {currentDate}</p>
        </header>

        <div className="terms-content">
          <section className="intro-section">
            <p>
              Welcome to <strong>QuizMaster</strong>. By accessing or using our platform, 
              you agree to these Terms and Conditions. Please read them carefully.
            </p>
          </section>

          <div className="terms-grid">
            <article className="term-card">
              <div className="term-number">1</div>
              <div>
                <h2>Purpose</h2>
                <p>
                  QuizMaster is a free online quiz platform for fun and learning. 
                  Join quizzes without signing up. Create quizzes with a free account.
                </p>
              </div>
            </article>

            <article className="term-card">
              <div className="term-number">2</div>
              <div>
                <h2>User Conduct</h2>
                <ul>
                  <li>No cheating or spamming</li>
                  <li>Respectful behavior required</li>
                  <li>No hacking attempts</li>
                </ul>
              </div>
            </article>

            <article className="term-card">
              <div className="term-number">3</div>
              <div>
                <h2>Host Responsibilities</h2>
                <ul>
                  <li>Keep credentials secure</li>
                  <li>Quizzes may not be stored permanently</li>
                </ul>
              </div>
            </article>

            <article className="term-card">
              <div className="term-number">4</div>
              <div>
                <h2>Data Usage</h2>
                <ul>
                  <li>Minimal data collection</li>
                  <li>We never sell your data</li>
                  <li>Used only for platform functionality</li>
                </ul>
              </div>
            </article>

            <article className="term-card">
              <div className="term-number">5</div>
              <div>
                <h2>Intellectual Property</h2>
                <ul>
                  <li>All rights reserved</li>
                  <li>No unauthorized copying</li>
                </ul>
              </div>
            </article>

            <article className="term-card">
              <div className="term-number">6</div>
              <div>
                <h2>Availability</h2>
                <p>
                  We aim for 24/7 availability but cannot guarantee uninterrupted service.
                </p>
              </div>
            </article>
          </div>

          <div className="terms-footer">
            <article className="update-policy">
              <h2>Changes to Terms</h2>
              <p>
                We may update these Terms occasionally. Continued use means you accept the updates.
              </p>
            </article>

            <article className="contact-info-terms">
              <h2>Contact Us</h2>
              <p>
                Questions? Reach out at <a href="mailto:balvaraza2@gmail.com">balvaraza2@gmail.com</a> 
                or visit our <a href="https://github.com/Balvarazagit">GitHub</a>.
              </p>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;