const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema({
  pin: String,
  date: { type: Date, default: Date.now },
  hostName: String,
  hostEmail: String,
  players: [
    {
      name: String,
      score: Number,
      streak: Number
    }
  ],
});

module.exports = mongoose.model("QuizResult", quizResultSchema);
