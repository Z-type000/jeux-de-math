const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));

const quizData = [
  { id: 1, chapter: 'Suites', question: 'Une suite arithmétique a u₀ = 5 et raison r = 2. Calculer u₁, u₂, u₃.', answer: 'u₁ = 7 ; u₂ = 9 ; u₃ = 11' },
  { id: 2, chapter: 'Suites', question: 'Une suite géométrique a v₀ = 100 et raison q = 2. Calculer v₁, v₂, v₃.', answer: 'v₁ = 200 ; v₂ = 400 ; v₃ = 800' },
  { id: 3, chapter: 'Suites', question: 'Marie reçoit 50 € pour son anniversaire, puis 10 € de plus chaque mois. Combien aura-t-elle au bout de 4 mois ?', answer: '90 €' },
];

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('connected', socket.id);

  socket.on('create_room', ({ player1Name }) => {
    const roomId = Math.random().toString(36).substring(2,9).toUpperCase();
    rooms.set(roomId, {
      id: roomId,
      player1: { id: socket.id, name: player1Name, score: 0, answer: null },
      player2: null,
      currentQuestion: 0
    });
    socket.join(roomId);
    socket.emit('room_created', { roomId });
    console.log('room created', roomId);
  });

  socket.on('join_room', ({ roomId, player2Name }) => {
    const room = rooms.get(roomId);
    if (!room) { socket.emit('error', 'Room not found'); return; }
    if (room.player2) { socket.emit('error', 'Room full'); return; }

    room.player2 = { id: socket.id, name: player2Name, score: 0, answer: null };
    socket.join(roomId);
    io.to(roomId).emit('game_started', {
      player1Name: room.player1.name,
      player2Name: room.player2.name,
      question: quizData[room.currentQuestion],
      questionNumber: room.currentQuestion + 1,
      totalQuestions: quizData.length
    });
    console.log('player joined', roomId);
  });

  socket.on('submit_answer', ({ roomId, answer }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    if (room.player1.id === socket.id) room.player1.answer = answer;
    else if (room.player2 && room.player2.id === socket.id) room.player2.answer = answer;

    if (room.player1.answer && room.player2 && room.player2.answer) {
      const correct = quizData[room.currentQuestion].answer.toLowerCase().trim();
      const check = (a) => a && (a.toLowerCase().trim() === correct || a.toLowerCase().includes(correct.split(';')[0].trim()) || correct.includes(a.toLowerCase().split(';')[0].trim()));
      if (check(room.player1.answer)) room.player1.score++;
      if (check(room.player2.answer)) room.player2.score++;

      io.to(roomId).emit('answers_revealed', {
        player1Answer: room.player1.answer,
        player2Answer: room.player2.answer,
        correctAnswer: quizData[room.currentQuestion].answer,
        player1Score: room.player1.score,
        player2Score: room.player2.score
      });

      room.player1.answer = null;
      room.player2.answer = null;
    }
  });

  socket.on('next_question', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    room.currentQuestion++;
    if (room.currentQuestion >= quizData.length) {
      io.to(roomId).emit('game_ended', { player1Score: room.player1.score, player2Score: room.player2.score, totalQuestions: quizData.length });
      rooms.delete(roomId);
    } else {
      io.to(roomId).emit('new_question', { question: quizData[room.currentQuestion], questionNumber: room.currentQuestion + 1 });
    }
  });

  socket.on('disconnect', () => {
    for (const [id, room] of rooms.entries()) {
      if ((room.player1 && room.player1.id === socket.id) || (room.player2 && room.player2.id === socket.id)) {
        io.to(id).emit('opponent_disconnected');
        rooms.delete(id);
        // If the disconnected socket was the room owner (player1), shut down the server to make everything ephemeral
        if (room.player1 && room.player1.id === socket.id) {
          console.log('Owner disconnected; shutting down server to clear all data.');
          setTimeout(() => {
            process.exit(0);
          }, 500);
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log('Server listening on', PORT));