const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const Quiz = require("./models/Quiz");
const QuizResult = require("./models/QuizResult"); // ✅ Import QuizResult

app.use(express.json());
app.use(cors(
  {
    origin:'*',
  }
));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/quiz", require("./routes/quiz"));
app.use("/api/results", require("./routes/results"));
app.use("/api/admin", require("./routes/admin"));
app.get("/", (req, res) => {
  res.send("✅ Backend is Live!");
});
app.use('/api/users', require('./routes/users'));

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing! Check Render environment variables.");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    server.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })  
  .catch((err) => { console.error("❌ MongoDB Connection Error:", err)
    process.exit(1)});

const rooms = {};
const answerTracker = {}; 

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("host-quiz", ({ quizId }) => {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();

    rooms[pin] = {
      host: socket.id,
      players: [],
      quizId,
      currentQuestionIndex: 0,
      scores: {},
      streaks: {}
    };

    socket.join(pin);
    socket.emit("quiz-hosted", { pin });
  });

socket.on("join-quiz", ({ pin, name }) => {
  const room = rooms[pin];
  if (!room) {
    socket.emit("error-pin", { message: "Invalid PIN" });
    return;
  }

   if (!name || name.trim().length === 0) {
    socket.emit("error-pin", { message: "Name is required" });
    return;
  }
  // Join socket room
  socket.join(pin);

  // Add player to room
  const player = { id: socket.id, name };
  room.players.push(player);
  room.scores[name] = 0;
  room.streaks[name] = 0;

  // Send updated player list to host
  io.to(pin).emit("player-joined", { players: room.players });

  // If quiz is started, send current question with remaining time
 // ✅ If quiz has started, send current question with accurate remaining time
if (room.quizStarted && room.quiz) {
  const currentQ = room.quiz.questions[room.currentQuestionIndex];
  if (currentQ) {
    const questionStart = room.questionStartTime || Date.now();
    const elapsed = Math.floor((Date.now() - questionStart) / 1000);
    const remaining = Math.max(0, 30 - elapsed); // ⏱️ assuming 30s per question

    io.to(socket.id).emit("receive-question", {
      question: currentQ.question,
      options: currentQ.options,
      correct: currentQ.correct,
      startTime: questionStart,
      timeLeft: remaining
    });

  }
}
});
  
socket.on("start-quiz", async ({ pin }) => {
  const room = rooms[pin];
  if (!room) return;

  try {
    const quiz = await Quiz.findById(room.quizId);
    
    if (!quiz) return;

    room.quiz = quiz;
    room.currentQuestionIndex = 0;
    room.quizStarted = true;
    room.questionStartTime = Date.now(); // ⏰ save start time

    const firstQuestion = quiz.questions[0];

    io.to(pin).emit("receive-question", {
      question: firstQuestion.question,
      options: firstQuestion.options,
      correct: firstQuestion.correct,
      startTime: room.questionStartTime,
      index: room.currentQuestionIndex, 
      total: quiz.questions.length,
    });

    io.to(pin).emit("quiz-started");
    console.log(`🚀 Quiz started in room ${pin}`);
  } catch (err) {
    console.log("❌ Error in start-quiz:", err.message);
  }
});



  socket.on("next-question", async ({ pin }) => {
      console.log("📥 next-question triggered:", pin); // <- Yeh hona hi chahiye

  const room = rooms[pin];
  if (!room) return;

  try {
    const quiz = await Quiz.findById(room.quizId);
     console.log("📚 Loaded quiz:", quiz.title);
    if (!quiz) return;

    room.quiz = quiz;
    room.currentQuestionIndex += 1;
    const nextQ = quiz.questions[room.currentQuestionIndex];
console.log("📌 Reached next-question handler");
console.log("👉 Current index:", room.currentQuestionIndex);
console.log("🧠 Quiz total questions:", quiz.questions.length);
    console.log("🔍 nextQ:", nextQ);

    if (!nextQ) {
        console.log("✅ All questions finished. Saving result & analytics...");
              console.log("✅ All questions complete. Ending quiz.");
      const scoreboard = room.players.map(player => {
        const name = player.name;
        return {
          name,
          score: room.scores?.[name] || 0,
          streak: room.streaks?.[name] || 0,
        };
      });

      await QuizResult.create({
        pin,
        quizId: room.quizId,
        players: scoreboard,
        date: new Date()
      });

      // ✅ Update quiz analytics (plays count and players list)
      try {
        const quiz = await Quiz.findById(room.quizId);

        if (quiz) {
          quiz.plays = (quiz.plays || 0) + 1;
console.log("📊 Final scoreboard before saving:", scoreboard);
console.log("🎯 Updating plays to:", quiz.plays);

          // Append to players array (if defined in your quiz schema)
          scoreboard.forEach(({ name, score }) => {
            quiz.players.push({ name, score }); // your schema should support this
          });

          // Optional: recalculate avgScore
          const totalScores = quiz.players.reduce((sum, p) => sum + p.score, 0);
          quiz.avgScore = totalScores / quiz.players.length;

          await quiz.save();
          console.log("🎯 Quiz updated with players:", quiz.players);
        }
      } catch (err) {
        console.log("❌ Failed to update quiz analytics:", err.message);
      }


      scoreboard.sort((a, b) => b.score - a.score);
      io.to(pin).emit("quiz-ended", scoreboard);
      return;
    }

    room.questionStartTime = Date.now();
    answerTracker[pin] = {};
     // 🕓 reset for new question

    io.to(pin).emit("receive-question", {
      question: nextQ.question,
      options: nextQ.options,
      correct: nextQ.correct,
      startTime: room.questionStartTime,
      index: room.currentQuestionIndex, 
      total: quiz.questions.length,
    });

    setTimeout(() => {
      io.to(room.host).emit("auto-next");
    }, 30000);
  } catch (err) {
    console.log("❌ Error in next-question:", err.message);
  }
});


 socket.on("submit-answer", ({ pin, name, answer, score }) => {
  const room = rooms[pin];
  if (!room || !room.quiz) return;

  const index = room.currentQuestionIndex;
  const question = room.quiz.questions[index];
  if (!question) return;

  const correctAnswer = question.correct;

  if (!room.scores) room.scores = {};
  if (!room.streaks) room.streaks = {};

  if (answer === correctAnswer) {
    room.scores[name] = (room.scores[name] || 0) + (score || 0);
    room.streaks[name] = (room.streaks[name] || 0) + 1;
  } else {
    room.streaks[name] = 0;
  }

  // ✅ TRACK OPTION COUNTS FOR GRAPH
  if (!answerTracker[pin]) answerTracker[pin] = {};
  if (!answerTracker[pin][answer]) answerTracker[pin][answer] = 0;
  answerTracker[pin][answer] += 1;

  // ✅ CALCULATE totalAnswers
  const totalAnswers = Object.values(answerTracker[pin]).reduce((sum, val) => sum + val, 0);
  const stats = {
    totalAnswers,
    ...answerTracker[pin],
  };

  io.to(pin).emit("answer-stats", stats); // 📊 For host chart
  io.to(pin).emit("answer-submitted", { name, answer }); // 🧑‍🎓 For host list

  // ✅ Live scoreboard update
  const scoreboard = room.players.map(p => ({
    name: p.name,
    score: room.scores[p.name] || 0,
    streak: room.streaks[p.name] || 0,
  })).sort((a, b) => b.score - a.score);

  io.to(pin).emit("scoreboard-update", scoreboard);
});


  socket.on("send-question", ({ pin, question }) => {
    io.to(pin).emit("receive-question", question);
  });

 socket.on("kick-player", ({ pin, playerId }) => {
  const room = rooms[pin];
  if (!room) return;

  // ✅ Find the player first
  const player = room.players.find(p => p.id === playerId);

  // ✅ Remove from player list
  room.players = room.players.filter(p => p.id !== playerId);

  // ✅ Remove score and streak safely
  if (player) {
    delete room.scores[player.name];
    delete room.streaks[player.name];
  }

  // ✅ Kick the player
  io.to(playerId).emit("kicked");
  io.sockets.sockets.get(playerId)?.leave(pin);

  // ✅ Update player list on host side
  io.to(pin).emit("player-joined", { players: room.players });

});


  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});
