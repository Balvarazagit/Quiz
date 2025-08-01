import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Navbar from '../Layout/Navbar/Navbar';
import Footer from '../Layout/Footer/Footer';
import '../Contact/Contact.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } else {
      console.error('Failed to send message');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <>
      <Navbar />
      <main className="contact-page">
        {/* Hero Section */}
        <section className="contact-hero">
          <motion.div 
            className="hero-content-contact"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Get in <span>Touch</span></h1>
            <p>Have questions or feedback? We'd love to hear from you!</p>
          </motion.div>
          <div className="hero-dots"></div>
        </section>

        {/* Contact Content */}
        <section className="contact-content">
          <div className="contact-container">
            {/* Contact Form */}
            <motion.div 
              className="contact-form-container"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2>Send us a message</h2>
              
              {submitSuccess && (
                <motion.div 
                  className="success-message"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <FiCheckCircle className="success-icon" />
                  <p>Thank you! Your message has been sent successfully.</p>
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <div className="input-wrapper">
                    <svg className="input-icon-contact" viewBox="0 0 24 24">
                      <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                    </svg>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <svg className="input-icon-contact" viewBox="0 0 24 24">
                      <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6M20 6L12 11L4 6H20M20 18H4V8L12 13L20 8V18Z" />
                    </svg>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <div className="input-wrapper">
                    <svg className="input-icon-contact textarea-icon" viewBox="0 0 24 24">
                      <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                    </svg>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Type your message here..."
                    ></textarea>
                  </div>
                </div>
                
                <motion.button 
                  type="submit" 
                  className="submit-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="button-icon" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
            
            {/* Contact Info */}
            <motion.div 
              className="contact-info"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2>Contact Information</h2>
              
              <div className="info-item">
                <div className="info-icon">
                  <FiMapPin />
                </div>
                <div>
                  <h3>Our Location</h3>
                  <p>Anjumane Hussainiya Sardariya Hostel And PG, Javed Park, Society, opp. Prachina Society Road, Royal Nawab Society, Juhapura, Ahmedabad, Gujarat 380055</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <FiMail />
                </div>
                <div>
                  <h3>Email Us</h3>
                  <p>balvaraza2@gmail.com</p>
                  <p>support@QuizMaster.com</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <FiPhone />
                </div>
                <div>
                  <h3>Call Us</h3>
                  <p>+91 7698528935</p>
                  <p>Mon-Fri: 9am-6pm</p>
                </div>
              </div>
              
              <div className="social-section">
                <h3>Follow Us</h3>
                <div className="social-links">
                  <a href="#" aria-label="Twitter"><FaTwitter /></a>
                  <a href="#" aria-label="Facebook"><FaFacebook /></a>
                  <a href="#" aria-label="Instagram"><FaInstagram /></a>
                  <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Map Section */}
        <section className="map-section">
          <div className="map-container">
            <div className="map-overlay"></div>
            <iframe 
              title="Our Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.974090638804!2d72.5228846109511!3d22.98798021753135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e85585082cb95%3A0x94581940d6ae51d1!2sAnjumane%20Hussainiya%20Sardariya%20Hostel%20And%20PG!5e0!3m2!1sen!2sin!4v1753696064378!5m2!1sen!2sin" 
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;