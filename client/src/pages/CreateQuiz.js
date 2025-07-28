  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import '../pages/styles/CreateQuiz.css';

  function CreateQuiz() {
    const [quizTitle, setQuizTitle] = useState('');
    const [questions, setQuestions] = useState([
      {
        type: 'MCQ',
        question: '',
        options: ['', '', '', ''],
        correct: ''
      }
    ]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAddQuestion = () => {
      setQuestions([
        ...questions,
        {
          type: 'MCQ',
          question: '',
          options: ['', '', '', ''],
          correct: ''
        }
      ]);
    };

    const handleRemoveQuestion = (index) => {
      if (questions.length <= 1) {
        toast.warning('Quiz must have at least one question');
        return;
      }
      setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleChange = (qIndex, field, value) => {
      const updated = [...questions];
      updated[qIndex][field] = value;

      if (field === 'type') {
        updated[qIndex].options =
          value === 'TrueFalse' ? ['True', 'False'] : ['', '', '', ''];
        updated[qIndex].correct = '';
      }

      setQuestions(updated);
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
      const updated = [...questions];
      updated[qIndex].options[optIndex] = value;

      if (updated[qIndex].correct === questions[qIndex].options[optIndex]) {
        updated[qIndex].correct = value;
      }

      setQuestions(updated);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!quizTitle.trim()) {
        toast.error('❗ Quiz title is required');
        return;
      }

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.question.trim() || q.options.some(opt => !opt.trim()) || !q.correct.trim()) {
          toast.error(`❗ Complete all fields in Question ${i + 1}`);
          return;
        }
      }

      const token = localStorage.getItem('token');
      setLoading(true);

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
              type: q.type,
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
      } finally {
        setLoading(false);
      }
    };

    const handleGoBack = () => {
    navigate(-1); // Goes back to previous page
  };

    return (
    <div className="quiz-creator-container">
      <div className="quiz-creator-card">
        <button 
          onClick={handleGoBack}
          className="back-button-createquiz"
          aria-label="Go back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <h1 className="quiz-creator-title">Create New Quiz</h1>
        
        <div className="quiz-title-section">
          <input
            type="text"
            placeholder="Enter Quiz Title"
            value={quizTitle}
            onChange={e => setQuizTitle(e.target.value)}
            className="quiz-title-input"
          />
        </div>

        <div className="questions-container">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="question-card">
              <div className="question-create-header">
                <div className="question-number-create-container">
                  <span className="question-number-create-badge">{qIndex + 1}</span>
                  <h3 className="question-number-create">Question</h3>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleRemoveQuestion(qIndex)}
                  className="remove-question-btn"
                  disabled={questions.length <= 1}
                  aria-label="Remove question"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="question-type-selector">
                <label>Question Type:</label>
                <select
                  value={q.type}
                  onChange={e => handleChange(qIndex, 'type', e.target.value)}
                  className="question-type-select"
                >
                  <option value="MCQ">Multiple Choice</option>
                  <option value="TrueFalse">True / False</option>
                </select>
              </div>

              <div className="question-textarea-container">
                <textarea
                  placeholder="Enter your question here..."
                  value={q.question}
                  onChange={e => handleChange(qIndex, 'question', e.target.value)}
                  className="question-textarea"
                  rows={3}
                />
              </div>

              <div className="options-container">
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} className="option-input-wrapper">
                    <span className="option-bullet"></span>
                    <input
                      type="text"
                      placeholder={q.type === 'TrueFalse' ? '' : `Option ${optIndex + 1}`}
                      value={opt}
                      onChange={e => handleOptionChange(qIndex, optIndex, e.target.value)}
                      className="option-input"
                      disabled={q.type === 'TrueFalse'}
                    />
                  </div>
                ))}
              </div>

              <div className="correct-answer-selector">
                <label>Correct Answer:</label>
                <select
                  value={q.correct}
                  onChange={e => handleChange(qIndex, 'correct', e.target.value)}
                  className="correct-answer-select"
                >
                  <option value="">Select correct option</option>
                  {q.options.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt || (q.type === 'TrueFalse' ? ['True', 'False'][idx] : `Option ${idx + 1}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="action-buttons">
          <button 
            type="button" 
            onClick={handleAddQuestion}
            className="add-question-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Question
          </button>
          <button 
            type="submit" 
            onClick={handleSubmit} 
            className="submit-quiz-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="submit-spinner"></span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Create Quiz
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

  export default CreateQuiz;