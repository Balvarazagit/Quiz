import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiHome, FiArrowLeft } from 'react-icons/fi';

import {
  Quiz404Container,
  QuizContent,
  QuizVisual,
  QuizBubble,
  QuizPencil,
  QuizDoodle,
  QuizText,
  QuizOptions,
  QuizOption,
  QuizHint,
} from '../pages/styles/NotFound.styles'; // 🔄 styles moved here

const QuizNotFound = () => {
  const navigate = useNavigate();

  return (
    <Quiz404Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <QuizContent>
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

        <QuizText>
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
            <QuizOption correct onClick={() => navigate('/')}>
              <FiHome /> Return to Home
            </QuizOption>
            <QuizOption onClick={() => window.history.back()}>
              <FiArrowLeft /> Previous Question
            </QuizOption>
          </QuizOptions>

          <QuizHint>
            <small>Pro Tip: Check your quiz URL or browse our quiz categories</small>
          </QuizHint>
        </QuizText>
      </QuizContent>
    </Quiz404Container>
  );
};

export default QuizNotFound;
