const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const auth = require('../middleware/auth');
const User = require('../models/User');


// ✅ [POST] Create a new quiz
router.post('/create', auth, async (req, res) => {
  const { title, questions } = req.body;

  try {
    const newQuiz = new Quiz({
      title,
      questions,
      createdBy: req.user.id
    });

    await newQuiz.save();

    // ✅ Return quiz ID immediately after creation
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

// ✅ [GET] Fetch quiz by ID (used when starting/joining)
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

// ✅ [OPTIONAL] Get all quizzes created by logged-in user
router.get('/by-user/me', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.id }).select('title _id createdAt questions');
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
      .populate('createdBy', 'name email') // Get name & email of creator
      .sort({ createdAt: -1 });

    const formatted = quizzes.map(q => ({
      _id: q._id,
      title: q.title,
      host: q.createdBy,
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


module.exports = router;
