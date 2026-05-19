import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const DEFAULT_SERVER = 'http://localhost:3000';

const LANClient = () => {
  const [serverUrl, setServerUrl] = useState(DEFAULT_SERVER);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [status, setStatus] = useState('menu'); // menu, waiting, playing, revealed, ended
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [opponent, setOpponent] = useState('');
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [correctAnswer, setCorrectAnswer] = useState(null);

  useEffect(() => {
    return () => { if (socket) socket.close(); };
  }, [socket]);

  const connectSocket = (url) => {
    const s = io(url);
    setSocket(s);
    s.on('connect', () => { setConnected(true); });
    s.on('room_created', ({ roomId }) => { setRoomId(roomId); setStatus('waiting'); });
    s.on('game_started', (data) => { setStatus('playing'); setQuestion(data.question); setOpponent(data.player1Name === playerName ? data.player2Name : data.player1Name); });
    s.on('new_question', (data) => { setQuestion(data.question); setStatus('playing'); setCorrectAnswer(null); });
    s.on('answers_revealed', (data) => { setCorrectAnswer(data.correctAnswer); setScores({ p1: data.player1Score, p2: data.player2Score }); setStatus('revealed'); });
    s.on('game_ended', (data) => { setScores({ p1: data.player1Score, p2: data.player2Score }); setStatus('ended'); });
    s.on('opponent_disconnected', () => { setStatus('ended'); alert('Opponent disconnected'); });
    s.on('error', (msg) => alert(msg));
  };

  const handleCreate = () => {
    if (!socket) connectSocket(serverUrl);
    setTimeout(() => { socket.emit('create_room', { player1Name: playerName }); setStatus('waiting'); }, 200);
  };

  const handleJoin = () => {
    if (!socket) connectSocket(serverUrl);
    setTimeout(() => { socket.emit('join_room', { roomId, player2Name: playerName }); }, 200);
  };

  const submitAnswer = () => {
    if (!socket) return;
    socket.emit('submit_answer', { roomId, answer });
    setAnswer('');
  };

  const nextQuestion = () => { if (socket) socket.emit('next_question', { roomId }); };

  return (
    <div style={{padding: 20}}>
      {status === 'menu' && (
        <div>
          <h3>LAN 1v1</h3>
          <input value={serverUrl} onChange={e=>setServerUrl(e.target.value)} style={{width: '100%', marginBottom: 8}} />
          <input placeholder="Ton nom" value={playerName} onChange={e=>setPlayerName(e.target.value)} style={{width: '100%', marginBottom: 8}} />
          <div style={{display:'flex', gap:8}}>
            <button onClick={handleCreate} disabled={!playerName}>Créer une salle</button>
            <input placeholder="Code salle" value={roomId} onChange={e=>setRoomId(e.target.value)} />
            <button onClick={handleJoin} disabled={!playerName || !roomId}>Rejoindre</button>
          </div>
        </div>
      )}

      {status === 'waiting' && <div>En attente d'un adversaire... Code: {roomId}</div>}

      {status === 'playing' && (
        <div>
          <h4>Question:</h4>
          <p>{question.question}</p>
          <input value={answer} onChange={e=>setAnswer(e.target.value)} />
          <button onClick={submitAnswer} disabled={!answer}>Envoyer</button>
          <div>Scores: {scores.p1} - {scores.p2}</div>
        </div>
      )}

      {status === 'revealed' && (
        <div>
          <h4>Réponse correcte: {correctAnswer}</h4>
          <div>Scores: {scores.p1} - {scores.p2}</div>
          <button onClick={nextQuestion}>Question suivante</button>
        </div>
      )}

      {status === 'ended' && (
        <div>
          <h3>Partie terminée</h3>
          <div>Scores: {scores.p1} - {scores.p2}</div>
        </div>
      )}
    </div>
  );
};

export default LANClient;
