import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function StartQuiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/quiz/${id}`)
      .then(res => res.json())
      .then(data => setQuiz(data));
  }, [id]);

  const handleNext = () => {
    if (quiz.questions[current].correctAnswer === selected) {
      setScore(score + 1);
    }

    if (current + 1 < quiz.questions.length) {
      setCurrent(current + 1);
      setSelected('');
    } else {
      setShowResult(true);
    }
  };

  if (!quiz) return <p>Loading...</p>;
  if (showResult) return <h2>Final Score: {score} / {quiz.questions.length}</h2>;

  const q = quiz.questions[current];

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>{quiz.title}</h2>
      <h3>Q{current + 1}: {q.question}</h3>
      {q.options.map((opt, i) => (
        <div key={i}>
          <label>
            <input
              type="radio"
              name="option"
              value={opt}
              checked={selected === opt}
              onChange={() => setSelected(opt)}
            />
            {opt}
          </label>
        </div>
      ))}
      <button onClick={handleNext} disabled={!selected}>Next</button>
    </div>
  );
}

export default StartQuiz;
