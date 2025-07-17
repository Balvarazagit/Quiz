const express = require('express');
const router = express.Router();
const QuizResult = require('../models/QuizResult');

router.get('/all', async (req, res) => {
  try {
    const { pin, filter } = req.query;
    const query = {};

    // 📌 Filter by PIN if provided
    if (pin) {
      query.pin = pin;
    }

    // 📆 Apply date filters
    if (filter === 'today') {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    } else if (filter === 'last7') {
      const from = new Date();
      from.setDate(from.getDate() - 7);
      query.date = { $gte: from };
    } else if (filter === 'month') {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      query.date = { $gte: firstDay, $lte: lastDay };
    }

    const results = await QuizResult.find(query).sort({ date: -1 });
    res.json(results);
  } catch (err) {
    console.error('❌ Error fetching quiz results:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
