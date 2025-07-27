import React from 'react';
import { motion } from 'framer-motion';
import './Features.css';

const features = [
  {
    icon: '🚀',
    title: 'AI-Powered',
    description: 'Our smart algorithms analyze responses to create personalized learning paths',
    color: '#4CAF50'
  },
  {
    icon: '📊',
    title: 'Real-Time Analytics',
    description: 'Get instant insights into performance with beautiful dashboards',
    color: '#2196F3'
  },
  {
    icon: '🎨',
    title: 'Custom Branding',
    description: 'White-label quizzes with your logo, colors, and domain',
    color: '#9C27B0'
  },
  {
    icon: '🤝',
    title: 'Collaboration',
    description: 'Work together with your team to create perfect quizzes',
    color: '#FF9800'
  },
  {
    icon: '📱',
    title: 'Mobile Ready',
    description: 'Fully responsive design works perfectly on any device',
    color: '#3F51B5'
  },
  {
    icon: '🔒',
    title: 'Secure',
    description: 'Enterprise-grade security to protect your data',
    color: '#F44336'
  }
];

const Features = () => {
  return (
    <section className="features-section">
      <div className="features-container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">Everything you need to create engaging learning experiences</p>
        </motion.div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div 
                className="feature-icon-container"
                style={{ backgroundColor: `${feature.color}20`, borderColor: feature.color }}
              >
                <span className="feature-icon">{feature.icon}</span>
              </div>
              <h3 className="feature-title" style={{ color: feature.color }}>{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-hover-indicator" style={{ backgroundColor: feature.color }}></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;