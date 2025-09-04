import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/FAQ.css';
import Footer from '../components/Layout/Footer/Footer';
import Navbar from '../components/Layout/Navbar/Navbar';

const FAQ = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Check for saved theme preference on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkTheme(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const faqs = [
    {
      question: "What is this website for?",
      answer: "This is a real-time quiz platform where anyone can participate in quizzes and hosts can create and manage their own quizzes.",
      category: "general"
    },
    {
      question: "Do I need to register to play a quiz?",
      answer: "No. Players can join a quiz using a Game PIN without any registration.",
      category: "player"
    },
    {
      question: "Who needs to register?",
      answer: "Only quiz hosts who want to create and run quizzes need to sign up for an account.",
      category: "host"
    },
    {
      question: "How do I join a quiz?",
      answer: "Just click on 'Join Quiz', enter your name and the 6-digit Game PIN shared by the host.",
      category: "player"
    },
    {
      question: "Can I create a quiz without registering?",
      answer: "No. Only registered users (hosts) can create and manage quizzes.",
      category: "host"
    },
    {
      question: "How do I get the Quiz ID when I create a quiz?",
      answer: "As soon as you create a quiz, you'll get a Quiz ID via a toast notification. If you miss it, you can find it in the 'Manage Quizzes' or 'My Quizzes' section.",
      category: "host"
    },
    {
      question: "How long does each question stay visible?",
      answer: "Each question appears for a fixed time (e.g. 30 seconds), after which it automatically moves to the next one.",
      category: "player"
    },
    {
      question: "What is 'Host Thought'?",
      answer: "'Host Thought' is a motivational or guiding message added by the host. It appears 5 seconds after the question is shown.",
      category: "host"
    },
    {
      question: "Are quiz results saved?",
      answer: "Yes. Quiz results are stored so that hosts can view player performance and quiz analytics later.",
      category: "host"
    },
    {
      question: "Can I kick a player as a host?",
      answer: "Yes. Hosts can remove any participant before or during the quiz using the kick option.",
      category: "host"
    },
    {
      question: "Is my data safe?",
      answer: "Yes. Your data is secure. We only store the necessary information, and passwords are encrypted. We never sell or share your personal data.",
      category: "technical"
    },
    {
      question: "Can I edit a quiz after creating it?",
      answer: "Currently, you cannot edit a quiz once it's created. Please double-check your questions before submitting.",
      category: "host"
    },
    {
      question: "How many players can join a quiz at the same time?",
      answer: "You can have up to 100 players per quiz session.",
      category: "technical"
    },
    {
      question: "What happens if I close the browser during a quiz?",
      answer: "If the host closes the browser, the quiz ends for everyone. Players will be disconnected.",
      category: "technical"
    },
    {
      question: "Can I host the same quiz again later?",
      answer: "Yes. Just go to the 'Manage Quizzes' or 'My Quizzes' section, enter the Quiz ID, and start hosting again.",
      category: "host"
    },
    {
      question: "Do players need to log in again for each quiz?",
      answer: "No. Players just need the Game PIN to join. No login required.",
      category: "player"
    },
    {
      question: "Can I reuse questions in another quiz?",
      answer: "Yes. You can reuse questions by selecting an existing quiz from the 'Manage Quizzes' section using its Quiz ID, and then host it again or duplicate it.",
      category: "host"
    },
    {
      question: "Can I see which answer each player selected?",
      answer: "Hosts can see the number of users who selected each option, but not individual answers (to protect player privacy).",
      category: "host"
    },
    {
      question: "Is this platform free to use?",
      answer: "Yes, it's completely free to use for both hosts and players.",
      category: "general"
    },
    {
      question: "Can I report an issue or bug?",
      answer: `Yes. Use the "Contact Us" or "Report Issue" form on the website to notify the developers.`,
      category: "general"
    },
    {
      question: "Can I generate quiz questions automatically?",
      answer: "Yes. Hosts can use the AI Question Generator to create multiple-choice or true/false questions instantly based on a topic.",
      category: "host"
    },
    {
      question: "What happens when the timer ends for a question?",
      answer: "When the timer ends, players have to wait until the host moves to the next question. At that time, the correct answer is also revealed.",
      category: "player"
    },
    {
      question: "Can players see the correct answer after each question?",
      answer: "Yes. Once the timer ends, the correct answer is revealed to all players.",
      category: "player"
    },
    {
      question: "How does scoring work?",
      answer: "Scores are calculated based on correct answers and response speed. Faster correct answers earn more points.",
      category: "player"
    },
    {
      question: "What is the Live Scoreboard?",
      answer: "The Live Scoreboard shows real-time rankings after each question so players and hosts can track performance instantly.",
      category: "player"
    },
    {
      question: "Can I reset my password if I forget it?",
      answer: "Yes. Use the 'Forgot Password' option on the login page to reset your password via email verification.",
      category: "technical"
    },
    {
      question: "Can multiple players join with the same name?",
      answer: "Yes, but each player is assigned a unique ID to avoid confusion on the scoreboard.",
      category: "technical"
    },
    {
      question: "What happens at the end of a quiz?",
      answer: "At the end of a quiz, players are shown the final scoreboard with the top 3 winners highlighted with animations.",
      category: "player"
    },
    {
      question: "Can I share the quiz link with others?",
      answer: "Yes. Hosts can share a direct join link or QR code with players for quick access.",
      category: "host"
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
    <Navbar />
    <div className="faq-page">
      <div className="faq-container">
        <header className="faq-header">
          <div className="faq-icon">❓</div>
          <h1>Frequently Asked Questions</h1>
          <p className="faq-subtitle">Find answers to common questions about QuizMaster</p>
        </header>

        <div className="search-container-faq">
          <input 
            type="text" 
            placeholder="Search FAQs..." 
            className="search-input-faq"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="#4CAF50">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>

        <div className="faq-categories">
          <button 
            className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Questions
          </button>
          <button 
            className={`category-btn ${activeCategory === 'player' ? 'active' : ''}`}
            onClick={() => setActiveCategory('player')}
          >
            For Players
          </button>
          <button 
            className={`category-btn ${activeCategory === 'host' ? 'active' : ''}`}
            onClick={() => setActiveCategory('host')}
          >
            For Hosts
          </button>
          <button 
            className={`category-btn ${activeCategory === 'technical' ? 'active' : ''}`}
            onClick={() => setActiveCategory('technical')}
          >
            Technical
          </button>
        </div>

        <div className="faq-list">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question">
                  <h3>{faq.question}</h3>
                  <svg 
                    className={`chevron ${activeIndex === index ? 'active' : ''}`} 
                    width="20" height="20" viewBox="0 0 24 24" fill="none"
                  >
                    <path d="M6 9L12 15L18 9" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No FAQs found matching your search.</p>
            </div>
          )}
        </div>

        <div className="contact-prompt">
          <p>Didn't find what you were looking for?</p>
          <button 
            className="contact-btn"
            onClick={() => navigate('/contact')}
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default FAQ;