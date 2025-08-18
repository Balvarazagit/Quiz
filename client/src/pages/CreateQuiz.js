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
      correct: '',
      thought: '',
      mediaType: "",
      mediaUrl: ""
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
        correct: '',
        thought: '',
        mediaType: "",
        mediaUrl: ""
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

      if (!q.question.trim()) {
        toast.error(`❗ Question text required in Q${i + 1}`);
        return;
      }

      if (q.type === "MCQ") {
        if (q.options.some(opt => !opt.trim()) || !q.correct.trim()) {
          toast.error(`❗ MCQ needs all options & correct answer in Q${i + 1}`);
          return;
        }
      }

      if (q.type === "TrueFalse" && !q.correct.trim()) {
        toast.error(`❗ True/False needs correct answer in Q${i + 1}`);
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
            correct: q.correct,
            thought: q.thought,
            mediaType: q.mediaType,
            mediaUrl: q.mediaUrl
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
    navigate(-1);
  };

  const handleFileUpload = async (e, qIndex, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "quiz_upload");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/Protfolio/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        const updated = [...questions];
        updated[qIndex][field] = data.secure_url;
        setQuestions(updated);
        toast.success("✅ Media uploaded!");
      } else {
        toast.error("Upload failed, try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Error while uploading file!");
    }
  };

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
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
        
        <div className="quiz-header">
          <h1 className="quiz-creator-title">Create New Quiz</h1>
          <p className="quiz-subtitle">Design an engaging quiz with multiple question types</p>
        </div>
        
        <div className="quiz-title-section">
          <label className="input-label">Quiz Title</label>
          <input
            type="text"
            placeholder="Enter a catchy quiz title..."
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

              <div className="question-content">
                <div className="question-type-selector">
                  <label className="input-label">Question Type</label>
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
                  <label className="input-label">Question Text</label>
                  <textarea
                    placeholder="Enter your question here..."
                    value={q.question}
                    onChange={e => handleChange(qIndex, 'question', e.target.value)}
                    className="question-textarea"
                    rows={3}
                  />
                </div>

                <div className="media-section">
                  <label className="input-label">Add Media (Optional)</label>
                  <div className="media-controls">
                    <select
                      value={q.mediaType}
                      onChange={(e) => handleChange(qIndex, "mediaType", e.target.value)}
                      className="media-type-select"
                    >
                      <option value="">No Media</option>
                      <option value="image">Image</option>
                      <option value="audio">Audio</option>
                      <option value="gif">GIF</option>
                      <option value="video">YouTube Video</option>
                    </select>

                    {q.mediaType === "image" && (
                      <div className="media-upload">
                        <label className="file-upload-btn">
                          Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, qIndex, "mediaUrl")}
                            hidden
                          />
                        </label>
                        {q.mediaUrl && <img src={q.mediaUrl} alt="preview" className="media-preview" />}
                      </div>
                    )}

                    {q.mediaType === "audio" && (
                      <div className="media-upload">
                        <label className="file-upload-btn">
                          Upload Audio
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => handleFileUpload(e, qIndex, "mediaUrl")}
                            hidden
                          />
                        </label>
                        {q.mediaUrl && (
                          <audio controls className="media-audio">
                            <source src={q.mediaUrl} type="audio/mpeg" />
                          </audio>
                        )}
                      </div>
                    )}

                    {q.mediaType === "gif" && (
                      <div className="media-upload">
                        <label className="file-upload-btn">
                          Upload GIF
                          <input
                            type="file"
                            accept="image/gif"
                            onChange={(e) => handleFileUpload(e, qIndex, "mediaUrl")}
                            hidden
                          />
                        </label>
                        {q.mediaUrl && <img src={q.mediaUrl} alt="gif" className="media-preview" />}
                      </div>
                    )}

                    {q.mediaType === "video" && (
                      <div className="media-upload">
                        <input
                          type="text"
                          placeholder="Paste YouTube video URL"
                          value={q.mediaUrl}
                          onChange={(e) => handleChange(qIndex, "mediaUrl", e.target.value)}
                          className="youtube-url-input"
                        />
                        {q.mediaUrl && (
                          <iframe
                            className="media-video"
                            src={`https://www.youtube.com/embed/${extractYouTubeId(q.mediaUrl)}`}
                            title="YouTube video"
                            frameBorder="0"
                            allowFullScreen
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="options-section">
                  <label className="input-label">{q.type === 'TrueFalse' ? 'True/False Options' : 'Answer Options'}</label>
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
                </div>

                <div className="correct-answer-selector">
                  <label className="input-label">Correct Answer</label>
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

                <div className="thought-input-container">
                  <label className="input-label">Host's Thought (Optional)</label>
                  <textarea
                    placeholder="Add a motivational or guiding thought for participants..."
                    value={q.thought}
                    onChange={e => handleChange(qIndex, 'thought', e.target.value)}
                    className="thought-textarea"
                    rows={2}
                  />
                </div>
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