const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correct: String,
  thought: String,
  mediaType: { type: String, enum: ["image", "audio", "gif", "video", ""], default: "" },
  mediaUrl: { type: String, default: "" }
});

// Track individual players and their scores
const playerSchema = new mongoose.Schema({
  name: String,
  score: Number,
  timeTaken: Number, // optional
  joinedAt: { type: Date, default: Date.now }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [questionSchema],
  isPublished: {
    type: Boolean,
    default: false
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Make sure this matches your user model name
    required: true,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },

  // 🎯 NEW FIELDS
  plays: { type: Number, default: 0 }, // number of players who attempted
  players: [playerSchema], // details of each player
  avgScore: { type: Number, default: 0 } // optional for analytics
});

module.exports = mongoose.model('Quiz', quizSchema);
