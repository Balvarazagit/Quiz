import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiHome, FiArrowLeft, FiSun, FiMoon } from 'react-icons/fi';
import styled from 'styled-components';

// Fixed styled components with proper theme handling
export const Quiz404Container = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : '#f5f9f5'};
  font-family: 'Inter', sans-serif;
  transition: background 0.3s ease;
`;

export const QuizContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  width: 100%;
  gap: 3rem;
  background: ${props => props.theme === 'dark' ? '#2d3748' : 'white'};
  padding: 3rem;
  border-radius: 16px;
  box-shadow: ${props => props.theme === 'dark' 
    ? '0 10px 25px rgba(0, 0, 0, 0.3)' 
    : '0 10px 25px rgba(76, 175, 80, 0.1)'};
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    flex-direction: row;
    padding: 4rem;
  }
`;

export const QuizVisual = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    width: 250px;
    height: 250px;
  }
`;

export const QuizBubble = styled(motion.div)`
  width: 150px;
  height: 150px;
  background: #4CAF50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 20px rgba(76, 175, 80, 0.2);

  @media (min-width: 768px) {
    width: 180px;
    height: 180px;
  }
`;

export const QuizPencil = styled(motion.div)`
  position: absolute;
  width: 80px;
  height: 10px;
  background: #8BC34A;
  border-radius: 4px;
  top: 20%;
  right: 10%;
  transform: rotate(45deg);
  &::after {
    content: '';
    position: absolute;
    width: 15px;
    height: 10px;
    background: #CDDC39;
    right: -15px;
    border-radius: 0 4px 4px 0;
  }
`;

export const QuizDoodle = styled(motion.div)`
  position: absolute;
  width: 60px;
  height: 60px;
  border: 3px dashed #81C784;
  border-radius: 50%;
  bottom: 10%;
  left: 10%;
  opacity: 0.6;
`;

export const QuizText = styled.div`
  max-width: 400px;
  text-align: center;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: ${props => props.theme === 'dark' ? '#a5d6a7' : '#2E7D32'};
    margin-bottom: 1.5rem;
    transition: color 0.3s ease;
  }

  p {
    font-size: 1.1rem;
    color: ${props => props.theme === 'dark' ? '#c8e6c9' : '#689F38'};
    margin-bottom: 2rem;
    line-height: 1.6;
    transition: color 0.3s ease;
  }

  @media (min-width: 768px) {
    text-align: left;
    h1 {
      font-size: 2.5rem;
    }
  }
`;

export const QuizOptions = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  @media (min-width: 480px) {
    flex-direction: row;
  }
`;

export const QuizOption = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: ${props => props.correct ? 'none' : `1px solid ${props.theme === 'dark' ? 'rgba(200, 230, 201, 0.3)' : '#C8E6C9'}`};
  background: ${props => {
    if (props.correct) return '#4CAF50';
    return props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'white';
  }};
  color: ${props => {
    if (props.correct) return 'white';
    return props.theme === 'dark' ? '#c8e6c9' : '#2E7D32';
  }};
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(76, 175, 80, 0.15);
    background: ${props => {
      if (props.correct) return '#388E3C';
      return props.theme === 'dark' ? 'rgba(200, 230, 201, 0.2)' : '#E8F5E9';
    }};
  }
`;

export const QuizHint = styled.div`
  margin-top: 2rem;
  color: ${props => props.theme === 'dark' ? '#a5d6a7' : '#81C784'};
  font-style: italic;
  transition: color 0.3s ease;
`;

export const ThemeToggleQuiz = styled(motion.button)`
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 1000;
  background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'white'};
  border: none;
  color: ${props => props.theme === 'dark' ? '#a5d6a7' : '#2E7D32'};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme === 'dark' 
    ? '0 4px 15px rgba(255, 255, 255, 0.1)' 
    : '0 4px 15px rgba(0, 0, 0, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
    box-shadow: ${props => props.theme === 'dark' 
      ? '0 6px 20px rgba(255, 255, 255, 0.15)' 
      : '0 6px 20px rgba(0, 0, 0, 0.15)'};
    background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : '#f0f0f0'};
  }

  @media (max-width: 768px) {
    top: 90px;
    right: 15px;
    padding: 0.6rem;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    top: 80px;
    right: 10px;
    padding: 0.5rem;
  }
`;

const QuizNotFound = () => {
  const navigate = useNavigate();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Check for saved theme preference on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkTheme(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setIsDarkTheme(false);
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const theme = isDarkTheme ? 'dark' : 'light';

  return (
    <Quiz404Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      theme={theme}
    >

      <QuizContent theme={theme}>
        <QuizVisual>
          <QuizBubble
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <FiAlertTriangle size={60} />
          </QuizBubble>
          <QuizPencil
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <QuizDoodle
            animate={{ x: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
        </QuizVisual>

        <QuizText theme={theme}>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Quiz Question Not Found!
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Looks like you've stumbled upon a tricky question that doesn't exist.
            Maybe it was removed or you took a wrong turn in the quiz.
          </motion.p>

          <QuizOptions
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <QuizOption 
              correct 
              onClick={() => navigate('/')}
              theme={theme}
            >
              <FiHome /> Return to Home
            </QuizOption>
            <QuizOption 
              onClick={() => window.history.back()}
              theme={theme}
            >
              <FiArrowLeft /> Previous Question
            </QuizOption>
          </QuizOptions>

          <QuizHint theme={theme}>
            <small>Pro Tip: Check your quiz URL or browse our quiz categories</small>
          </QuizHint>
        </QuizText>
      </QuizContent>
    </Quiz404Container>
  );
};

export default QuizNotFound;