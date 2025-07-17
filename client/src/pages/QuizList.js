import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/quiz/all`)
      .then(res => res.json())
      .then(data => setQuizzes(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>Available Quizzes</h2>
      {quizzes.map(quiz => (
        <div key={quiz._id} style={{
          background: '#f5f5f5', padding: '1rem',
          margin: '1rem 0', borderRadius: '10px'
        }}>
          <h3>{quiz.title}</h3>
          <button onClick={() => navigate(`/start/${quiz._id}`)}>Start Quiz</button>
        </div>
      ))}
    </div>
  );
}

export default QuizList;
