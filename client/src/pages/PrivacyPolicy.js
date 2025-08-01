import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/PrivacyPolicy.css';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="privacy-page">
      <div className="privacy-card">
        <button 
          onClick={() => navigate(-1)}
          className="back-button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </button>
        
        <header className="privacy-header">
          <div className="privacy-icon">🔐</div>
          <h1>Privacy Policy</h1>
          <div className="policy-meta">
            <span><strong>Website:</strong> QuizMaster</span>
            <span><strong>Effective Date:</strong> {currentDate}</span>
            <span><strong>Audience:</strong> General Public</span>
          </div>
        </header>

        <div className="privacy-content">
          <section className="intro-section">
            <p>
              Your privacy is important to us. This Privacy Policy explains how QuizMaster collects, uses, 
              and protects your information when you use our platform.
            </p>
          </section>

          <div className="privacy-grid">
            <article className="policy-card">
              <div className="policy-number">1</div>
              <div>
                <h2>Introduction</h2>
                <p>
                  We collect minimal data required for functionality. By using QuizMaster, you agree to 
                  the practices described in this policy.
                </p>
              </div>
            </article>

            <article className="policy-card">
              <div className="policy-number">2</div>
              <div>
                <h2>What We Collect</h2>
                <div className="data-collection">
                  <div className="data-type">
                    <h3>For Participants:</h3>
                    <ul>
                      <li>Nickname (optional)</li>
                      <li>Quiz responses</li>
                      <li>Temporary session data</li>
                    </ul>
                  </div>
                  <div className="data-type">
                    <h3>For Hosts:</h3>
                    <ul>
                      <li>Name, email, password</li>
                      <li>Created quizzes</li>
                      <li>Results data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </article>

            <article className="policy-card">
              <div className="policy-number">3</div>
              <div>
                <h2>How We Use Data</h2>
                <div className="usage-grid">
                  <div className="usage-do">
                    <h4>We Do:</h4>
                    <ul>
                      <li>Facilitate real-time quizzes</li>
                      <li>Manage quiz content</li>
                      <li>Display leaderboards</li>
                    </ul>
                  </div>
                  <div className="usage-dont">
                    <h4>We Don't:</h4>
                    <ul>
                      <li>Sell your data</li>
                      <li>Use for marketing</li>
                      <li>Share with third parties</li>
                    </ul>
                  </div>
                </div>
              </div>
            </article>

            <article className="policy-card">
              <div className="policy-number">4</div>
              <div>
                <h2>Data Security</h2>
                <ul className="security-features">
                  <li>
                    <span className="security-icon">🔒</span>
                    <span>HTTPS encrypted connections</span>
                  </li>
                  <li>
                    <span className="security-icon">🔑</span>
                    <span>Hashed passwords</span>
                  </li>
                  <li>
                    <span className="security-icon">🛡️</span>
                    <span>Secure MongoDB storage</span>
                  </li>
                </ul>
              </div>
            </article>

            <article className="policy-card">
              <div className="policy-number">5</div>
              <div>
                <h2>Cookies & Tracking</h2>
                <p>
                  We do not use cookies or any tracking technologies. No third-party analytics services 
                  are integrated with our platform.
                </p>
              </div>
            </article>

            <article className="policy-card">
              <div className="policy-number">6</div>
              <div>
                <h2>Children's Privacy</h2>
                <p>
                  Suitable for all ages. Users under 13 should play under adult supervision. We do not 
                  knowingly collect personal data from children.
                </p>
              </div>
            </article>
          </div>

          <div className="privacy-footer">
            <article className="rights-section">
              <h2>Your Rights</h2>
              <ul>
                <li>Request access to your data</li>
                <li>Request corrections</li>
                <li>Delete your account (hosts)</li>
              </ul>
            </article>

            <article className="contact-section">
              <h2>Contact Us</h2>
              <p>
                For privacy concerns or requests:
                <a href="mailto:balvaraza2@gmail.com">balvaraza2@gmail.com</a>
              </p>
              <p>
                GitHub: <a href="https://github.com/Balvarazagit">github.com/Balvarazagit</a>
              </p>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;