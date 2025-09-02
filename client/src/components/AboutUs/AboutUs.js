import React from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import { 
  FaLaptopCode, FaCode, FaPalette, FaChalkboardTeacher, 
  FaChartLine, FaHandshake, FaUsers, FaClipboardList, 
  FaStar, FaTools, FaLinkedin, FaEnvelope, FaComment
} from 'react-icons/fa';
import Navbar from '../Layout/Navbar/Navbar';
import '../AboutUs/AboutUs.css';

const AboutPage = () => {
  const teamMembers = [
    { name: 'Balva Aliraza RoshanAli', role: 'Founder & CEO', icon: <FaLaptopCode />, color: '#6c5ce7' },
    { name: 'Balva Aliraza RoshanAli', role: 'Lead Developer', icon: <FaCode />, color: '#fd79a8' },
    { name: 'Balva Aliraza RoshanAli', role: 'UX Designer', icon: <FaPalette />, color: '#00cec9' },
    { name: 'Balva Aliraza RoshanAli', role: 'Education Expert', icon: <FaChalkboardTeacher />, color: '#a29bfe' },
    { name: 'Balva Aliraza RoshanAli', role: 'Marketing Director', icon: <FaChartLine />, color: '#ffeaa7' },
    { name: 'Balva Aliraza RoshanAli', role: 'Customer Success', icon: <FaHandshake />, color: '#fab1a0' }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users', icon: <FaUsers /> },
    { number: '500+', label: 'Quizzes Created', icon: <FaClipboardList /> },
    { number: '95%', label: 'Satisfaction', icon: <FaStar /> },
    { number: '24/7', label: 'Support', icon: <FaTools /> }
  ];

  return (
    <>
      <Navbar />
      <main className="about-page">
        {/* Animated Hero Section */}
        <section className="hero-section-about">
          <div className="hero-bg-about"></div>
          <motion.div 
            className="hero-content-about"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>
              <span className="gradient-text-about">Redefining Learning</span>
              <br />
              Through Interactive Quizzes
            </h1>
            <p className="subtitle-about">Where knowledge meets engagement in every question</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cta-button"
            >
              Explore Our Story
            </motion.button>
          </motion.div>
          <div className="floating-shapes-about">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={`shape shape-${i % 4}`}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 10, 0]
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </section>

        {/* Interactive Mission Section */}
        <section className="mission-section">
          <div className="mission-container">
            <motion.div 
              className="mission-content"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="section-tag">Our Purpose</div>
              <h2>More Than Just Quizzes</h2>
              <p className="mission-statement">
                At QuizMaster, we're building the future of interactive learning. Our platform transforms 
                traditional assessments into engaging experiences that users love.
              </p>
              <div className="mission-points">
                {[
                  "AI-powered question generation",
                  "Real-time performance analytics",
                  "Customizable learning paths",
                  "Collaborative quiz creation"
                ].map((point, i) => (
                  <motion.div 
                    key={i}
                    className="point-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="point-icon">✓</div>
                    <span>{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="mission-visual"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="visual-container">
                <div className="main-visual">
                  <img 
                    src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
                    alt="Interactive learning platform" 
                  />
                </div>
                <div className="floating-dots">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="dot"
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{
                        duration: 3 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Dynamic Team Section */}
        <section className="team-section">
          <div className="section-header">
            <div className="section-tag">The Minds Behind</div>
            <h2>Meet Our Creative Team</h2>
            <p>Passionate professionals driving the QuizMaster revolution</p>
          </div>
          
          <div className="team-scroller">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                className="team-member"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -15 }}
                style={{ '--member-color': member.color }}
              >
                <div className="member-avatar" style={{ backgroundColor: member.color }}>
                  {member.icon}
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                <div className="member-links">
                  <a href="https://www.linkedin.com/in/aliraza-balva-10b872229/" target="_blank" rel="noopener noreferrer"><span><FaLinkedin /></span></a>
                  <a href="mailto:balvaraza2@gmail.com"><span><FaEnvelope /></span></a>
                  <Link to="/contact"><span><FaComment /></span></Link>
                </div>
                <div className="member-bg" style={{ backgroundColor: member.color }}></div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Animated Stats Section */}
        <section className="stats-section">
          <div className="stats-container">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="stat-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="stat-icon">{stat.icon}</div>
                <motion.h3 
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                >
                  {stat.number}
                </motion.h3>
                <p>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Vision Section */}
        <section className="vision-section">
          <motion.div 
            className="vision-content"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Our Vision for the Future</h2>
            <p>
              We envision a world where learning is personalized, engaging, and accessible to all. 
              QuizMaster is just the beginning of this educational transformation.
            </p>
            <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cta-button"
            >
              Join Our Journey
            </motion.button>
            </Link>
          </motion.div>
          <div className="vision-graphic">
            <div className="graphic-circle">
              <img 
                src="https://images.unsplash.com/photo-1535223289827-42f1e9919769?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                alt="Future of education" 
              />
            </div>
            <div className="graphic-particles">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="particle"
                  animate={{
                    x: [0, 20, 0],
                    y: [0, -20, 0]
                  }}
                  transition={{
                    duration: 4 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default AboutPage;