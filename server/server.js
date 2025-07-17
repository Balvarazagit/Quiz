const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const Quiz = require("./models/Quiz");
const QuizResult = require("./models/QuizResult"); // ✅ Import QuizResult

app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/quiz", require("./routes/quiz"));
app.use("/api/results", require("./routes/results"));
app.use("/api/admin", require("./routes/admin"));

mongoose
  .connect(process.env.MONGO_URI, { 
    // useNewUrlParser: true, 
    // useUnifiedTopology: true 
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    server.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(err));

const rooms = {};

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
    console.log("🎯 Host started quiz with PIN:", pin, "Quiz ID:", quizId);
  });

socket.on("join-quiz", ({ pin, name }) => {
  const room = rooms[pin];
  if (!room) {
    socket.emit("error-pin", { message: "Invalid PIN" });
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
    const remaining = Math.max(0, 10 - elapsed); // ⏱️ assuming 10s per question

    io.to(socket.id).emit("receive-question", {
      question: currentQ.question,
      options: currentQ.options,
      correct: currentQ.correct,
      startTime: questionStart,
      timeLeft: remaining
    });

    console.log(`✅ Sent live question to ${name} with ${remaining}s left`);
  }
}


  console.log(`🟢 ${name} joined quiz ${pin}`);
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
      startTime: room.questionStartTime
    });

    io.to(pin).emit("quiz-started");
    console.log(`🚀 Quiz started in room ${pin}`);
  } catch (err) {
    console.log("❌ Error in start-quiz:", err.message);
  }
});



  socket.on("next-question", async ({ pin }) => {
  const room = rooms[pin];
  if (!room) return;

  try {
    const quiz = await Quiz.findById(room.quizId);
    if (!quiz) return;

    room.quiz = quiz;
    room.currentQuestionIndex += 1;
    const nextQ = quiz.questions[room.currentQuestionIndex];

    if (!nextQ) {
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

      scoreboard.sort((a, b) => b.score - a.score);
      io.to(pin).emit("quiz-ended", scoreboard);
      return;
    }

    room.questionStartTime = Date.now(); // 🕓 reset for new question

    io.to(pin).emit("receive-question", {
      question: nextQ.question,
      options: nextQ.options,
      correct: nextQ.correct,
      startTime: room.questionStartTime
    });

    setTimeout(() => {
      io.to(room.host).emit("auto-next");
    }, 10000);
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

    console.log(`[ANSWER] ${name} => ${answer} | +${score} pts | Total: ${room.scores[name]} | Streak: ${room.streaks[name]}`);

    // 🔁 Live scoreboard update
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

  console.log(`❌ Player ${playerId} (${player?.name}) was kicked from quiz ${pin}`);
});


  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});
