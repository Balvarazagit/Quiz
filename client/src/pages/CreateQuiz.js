import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/CreateQuiz.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correct: '' }
  ]);
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correct: '' }]);
  };

  const handleChange = (qIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;

    // If correct answer is edited, auto-update it
    if (updated[qIndex].correct === questions[qIndex].options[optIndex]) {
      updated[qIndex].correct = value;
    }

    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (!quizTitle.trim()) {
      toast.error('❗ Quiz title is required');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim() || q.options.some(opt => !opt.trim()) || !q.correct.trim()) {
        toast.error(`❗ Please complete all fields in Question ${i + 1}`);
        return;
      }
    }

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/quiz/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: quizTitle,
          questions: questions.map(q => ({
            question: q.question,
            options: q.options,
            correct: q.correct
          }))
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`🎉 Quiz Created! ID: ${data.quizId}`);
        setTimeout(() => navigate(`/host?quizId=${data.quizId}`), 1500);
      } else {
        toast.error(data.message || 'Failed to create quiz');
      }
    } catch (err) {
      toast.error('⚠️ Something went wrong!');
    }
  };

  return (
    <div className="quiz-form-wrapper">
      <h2>Create a New Quiz</h2>

      <input
        type="text"
        placeholder="Enter Quiz Title"
        value={quizTitle}
        onChange={e => setQuizTitle(e.target.value)}
        className="quiz-input"
      />

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="question-box">
          <h4>Question {qIndex + 1}</h4>

          <input
            type="text"
            placeholder="Type your question"
            value={q.question}
            onChange={e => handleChange(qIndex, 'question', e.target.value)}
          />

          {q.options.map((opt, optIndex) => (
            <input
              key={optIndex}
              type="text"
              placeholder={`Option ${optIndex + 1}`}
              value={opt}
              onChange={e => handleOptionChange(qIndex, optIndex, e.target.value)}
            />
          ))}

          <select
            value={q.correct}
            onChange={e => handleChange(qIndex, 'correct', e.target.value)}
          >
            <option value="">Select Correct Answer</option>
            {q.options.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt || `Option ${idx + 1}`}
              </option>
            ))}
          </select>
        </div>
      ))}

      <div className="button-group">
        <button type="button" onClick={handleAddQuestion} className="add-btn">
          + Add Another Question
        </button>
        <button type="submit" onClick={handleSubmit} className="submit-btn">
          ✅ Submit Quiz
        </button>
      </div>
    </div>
  );
}

export default CreateQuiz;
