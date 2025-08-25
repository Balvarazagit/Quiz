import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../pages/styles/CreateQuiz.css';
import QuizHeader from '../components/Create-quiz/QuizHeader/QuizHeader';
import QuestionCard from '../components/Create-quiz/QuestionCard/QuestionCard';
import ActionButtons from '../components/Create-quiz/ActionButtons/ActionButtons';

function Createquiz() {
  const [quizTitle, setQuizTitle] = useState('');
  const [qType, setQType] = useState("MCQ");
  const [tempOrders, setTempOrders] = useState({});
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
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);

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

    if (field === "type") {
      if (value === "TrueFalse") {
        updated[qIndex].options = ["True", "False"];
        updated[qIndex].correct = "";
      } else if (value === "MCQ") {
        updated[qIndex].options = ["", "", "", ""];
        updated[qIndex].correct = "";
      } else if (value === "Poll") {
        updated[qIndex].pollMode = "MCQ";
        updated[qIndex].options = ["", "", "", ""];
        updated[qIndex].correct = "";
      } else if (value === "Puzzle") {
        updated[qIndex].options = ["", "", "", ""];
        updated[qIndex].correct = [];
      }
    }

    if (field === "pollMode") {
      updated[qIndex].pollMode = value;
      updated[qIndex].options =
        value === "TrueFalse" ? ["True", "False"] : ["", "", "", ""];
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
        if (q.options.some(opt => !opt.trim())) {
          toast.error(`❗ MCQ needs all options in Q${i + 1}`);
          return;
        }
        if (!q.correct.trim()) {
          toast.error(`❗ MCQ needs a correct answer in Q${i + 1}`);
          return;
        }
      }

      if (q.type === "TrueFalse" && !q.correct.trim()) {
        toast.error(`❗ True/False needs correct answer in Q${i + 1}`);
        return;
      }

      if (q.type === "Poll") {
        if (q.options.some(opt => !opt.trim())) {
          toast.error(`❗ Poll needs all options in Q${i + 1}`);
          return;
        }
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
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const generateAIQuestions = async () => {
    const token = localStorage.getItem("token");

    if (!topic.trim()) {
      toast.error("❗ Please enter a topic");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/quiz/generate-questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // ✅ yaha qType bhi bhejna hoga
          body: JSON.stringify({ topic, count, qType }),
        }
      );

      const data = await res.json();

      if (res.ok && data.questions) {
        setQuestions(data.questions);
        toast.success(`✅ ${data.questions.length} questions generated!`);
      } else {
        toast.error(data.message || "AI failed to generate questions");
      }
    } catch (err) {
      toast.error("⚠️ Error generating questions");
    } finally {
      setLoading(false);
    }
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
        
        <QuizHeader />

        <div className="quiz-title-section">
          <label className="input-label">Topic for AI Quiz</label>
          <input
            type="text"
            placeholder="Enter topic (e.g. JavaScript, History)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="quiz-title-input"
          />

          <label className="input-label">Number of Questions</label>
          <input
            type="number"
            min="1"
            max="20"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="quiz-title-input"
          />

          {/* ✅ Ye dropdown AI type select karne ke liye */}
          <label className="input-label">Question Type</label>
          <select
            value={qType}
            onChange={(e) => setQType(e.target.value)}
            className="quiz-title-input"
          >
            <option value="MCQ">Multiple Choice</option>
            <option value="TrueFalse">True / False</option>
            <option value="Mix">Mix (MCQ + True/False)</option>
          </select>

          <button
            onClick={generateAIQuestions}
            disabled={loading}
            className="ai-generate-btn"
          >
            {loading ? "Generating..." : "✨ Generate with AI"}
          </button>
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
            <QuestionCard
              key={qIndex}
              qIndex={qIndex}
              question={q}
              questions={questions}
              tempOrders={tempOrders}
              setTempOrders={setTempOrders}
              handleChange={handleChange}
              handleOptionChange={handleOptionChange}
              handleRemoveQuestion={handleRemoveQuestion}
              handleFileUpload={handleFileUpload}
              extractYouTubeId={extractYouTubeId}
              setQuestions={setQuestions}
            />
          ))}
        </div>

        <ActionButtons 
          handleAddQuestion={handleAddQuestion}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default Createquiz;