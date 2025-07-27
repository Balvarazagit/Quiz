import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Quiz404Container = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: #f5f9f5; /* Light green background */
  font-family: 'Inter', sans-serif;
`;

export const QuizContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  width: 100%;
  gap: 3rem;
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(76, 175, 80, 0.1); /* Green tinted shadow */

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
  background: #4CAF50; /* Primary green */
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
  background: #8BC34A; /* Light green */
  border-radius: 4px;
  top: 20%;
  right: 10%;
  transform: rotate(45deg);
  &::after {
    content: '';
    position: absolute;
    width: 15px;
    height: 10px;
    background: #CDDC39; /* Lime accent */
    right: -15px;
    border-radius: 0 4px 4px 0;
  }
`;

export const QuizDoodle = styled(motion.div)`
  position: absolute;
  width: 60px;
  height: 60px;
  border: 3px dashed #81C784; /* Light green border */
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
    color: #2E7D32; /* Dark green */
    margin-bottom: 1.5rem;
  }

  p {
    font-size: 1.1rem;
    color: #689F38; /* Medium green */
    margin-bottom: 2rem;
    line-height: 1.6;
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
  border: ${props => props.correct ? 'none' : '1px solid #C8E6C9'}; /* Light green border */
  background: ${props => props.correct ? '#4CAF50' : 'white'};
  color: ${props => props.correct ? 'white' : '#2E7D32'};
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(76, 175, 80, 0.15);
    background: ${props => props.correct ? '#388E3C' : '#E8F5E9'}; /* Darker green on hover */
  }
`;

export const QuizHint = styled.div`
  margin-top: 2rem;
  color: #81C784; /* Light green text */
  font-style: italic;
`;