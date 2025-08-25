const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const auth = require('../middleware/auth');
const User = require('../models/User');
const axios = require("axios");


// ✅ [POST] Create a new quiz
router.post('/create', auth, async (req, res) => {
  try {
    const { title, questions } = req.body;

    const newQuiz = new Quiz({
      title,
      questions,
      creator: req.user.id // ✅ This matches schema requirement
    });

    await newQuiz.save();

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      quizId: newQuiz._id
    });
  } catch (err) {
    console.error('❌ Quiz creation error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ [GET] Fetch all quizzes (minimal info for list)
router.get('/all', async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('title _id');
    res.json(quizzes);
  } catch (err) {
    console.error('❌ Fetch all quizzes error:', err);
    res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
});


// ✅ [OPTIONAL] Get all quizzes created by logged-in user
router.get('/by-user/me', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ creator: req.user.id }).select('title _id createdAt questions');
    res.json(quizzes);
  } catch (err) {
    console.error('❌ Fetch user quizzes error:', err);
    res.status(500).json({ message: 'Failed to fetch user quizzes' });
  }
});

// GET /api/quizzes/admin/all
router.get('/admin/all', async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('creator', 'name email') // Get name & email of creator
      .sort({ createdAt: -1 });

    const formatted = quizzes.map(q => ({
      _id: q._id,
      title: q.title,
      host: q.creator,
      createdAt: q.createdAt
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching quizzes:", err);
    res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
});

// DELETE a quiz by ID
router.delete('/:quizId', async (req, res) => {
  const { quizId } = req.params;
  try {
    await Quiz.findByIdAndDelete(quizId);
    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete quiz' });
  }
});

// ⚠️ Specific first
router.get('/my-analytics', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ creator: req.user.id }) // ✅ FIXED
      .select('title plays');

    const formatted = quizzes.map(q => ({
      title: q.title,
      plays: q.plays || 0
    }));

    res.json(formatted);
  } catch (err) {
    console.error('❌ Analytics error:', err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Then keep dynamic ID route LAST
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (err) {
    console.error('❌ Fetch quiz by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify quiz can be shared
router.get('/:quizId/verify', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).select('_id isPublished');
    console.log('VERIFY ROUTE:', quiz); // Should now include isPublished

    if (!quiz || !quiz.isPublished) {
      return res.json({ valid: false });
    }

    res.json({ valid: true });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ valid: false });
  }
});

// Get quiz for viewing
router.get('/:quizId/view', async (req, res) => {
  try {
    console.log("View request for quiz:", req.params.quizId);

    const quiz = await Quiz.findById(req.params.quizId)
      .select('title questions creator')
      .populate('creator', 'name');

    if (!quiz) {
      console.log("Quiz not found");
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const viewData = {
      title: quiz.title,
      questions: quiz.questions.map(q => ({
        question: q.question,
        options: q.options,
        correct: q.correct,
        mediaType: q.mediaType || "",
        mediaUrl: q.mediaUrl || "",
      })),
      creatorName: quiz.creator?.name || 'Unknown',
    };    

    res.json(viewData);
  } catch (err) {
    console.error("Server error in /view route:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/quiz/:quizId/publish
router.post('/:quizId/publish', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Set creator if missing (for backward compatibility)
    if (!quiz.creator) {
      quiz.creator = req.user.id;
    }

    quiz.isPublished = true;
    await quiz.save();

    res.json({ message: 'Quiz published successfully' });
  } catch (err) {
    console.error("Publish route error:", err);
    res.status(500).json({ message: 'Failed to publish quiz' });
  }
});

// ✅ [POST] AI Question Generator
router.post("/generate-questions", auth, async (req, res) => {
  try {
    const { topic, count, qType } = req.body; // qType = "MCQ" | "TrueFalse" | "Mix"

    if (!topic || !count) {
      return res.status(400).json({ message: "Topic and count required" });
    }

    // Prompt banate waqt type ke hisaab se instruction dena
    let typeInstruction = "";
    if (qType === "MCQ") {
      typeInstruction = `Generate only Multiple Choice Questions (MCQ). 
Each question must have exactly 4 **meaningful answer options** (not just "A","B","C","D").`;
    } else if (qType === "TrueFalse") {
      typeInstruction = `Generate only True/False questions. 
Each question must have options ["True", "False"].`;
    } else {
      typeInstruction = `Generate a mix of MCQ and True/False questions. 
For MCQ: include 4 meaningful options. For True/False: use ["True","False"].`;
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `${typeInstruction}
Generate ${count} questions on topic "${topic}".
Return ONLY valid JSON array in this format:
[
  {
    "type": "MCQ" | "TrueFalse",
    "question": "string",
    "options": ["option1", "option2", "option3", "option4"] OR ["True", "False"],
    "correct": "exact matching option string"
  }
]`
              }
            ]
          }
        ]
      },
      { headers: { "Content-Type": "application/json" } }
    );

    let content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (!content) {
      return res.status(500).json({ success: false, message: "No response from AI" });
    }

    // 🧹 Clean response
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();

    let questions = [];
    try {
      questions = JSON.parse(content);
    } catch (parseErr) {
      console.error("❌ JSON Parse Error:", parseErr.message, "\nRAW:", content);
      return res.status(500).json({ success: false, message: "Invalid JSON from AI", raw: content });
    }

    res.json({ success: true, questions });
  } catch (err) {
    console.error("❌ AI Generation Error:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: "AI generation failed" });
  }
});

module.exports = router;
