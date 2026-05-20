import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const LANClient = () => {
  const [step, setStep] = useState('role'); // role, host-setup, player-setup, host-wait, playing, results
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [socket, setSocket] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [answered, setAnswered] = useState(false);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [opponentName, setOpponentName] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [questionNum, setQuestionNum] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const quizData = [
    { id: 1, question: 'Une suite arithmétique a u₀ = 5 et raison r = 2. Calculer u₁, u₂, u₃.', answer: 'u₁ = 7 ; u₂ = 9 ; u₃ = 11' },
    { id: 2, question: 'Une suite géométrique a v₀ = 100 et raison q = 2. Calculer v₁, v₂, v₃.', answer: 'v₁ = 200 ; v₂ = 400 ; v₃ = 800' },
    { id: 3, question: 'Calculer 2¹, 2², 2³, 2⁴.', answer: '2 ; 4 ; 8 ; 16' },
    { id: 4, question: 'Quelle est la probabilité d\'obtenir un 6 sur un dé ?', answer: '1/6' },
    { id: 5, question: 'Que vaut log(1000) ?', answer: '3' },
  ];

  useEffect(() => {
    return () => { if (socket) socket.close(); };
  }, [socket]);

  const connectToServer = (role) => {
    // En développement: localhost:3001, En production: même origin
    const serverUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:3001' 
      : window.location.origin;
    const s = io(serverUrl);
    setSocket(s);

    s.on('connect', () => {
      console.log('Connected');
      if (role === 'host') {
        s.emit('create_room', { player1Name: playerName });
      }
    });

    s.on('room_created', ({ roomId }) => {
      setRoomCode(roomId);
      setStep('host-wait');
    });

    s.on('game_started', (data) => {
      setStep('playing');
      setQuestion(data.question);
      setOpponentName(data.player2Name);
      setQuestionNum(data.questionNumber);
      setTotalQuestions(data.totalQuestions);
    });

    s.on('new_question', (data) => {
      setQuestion(data.question);
      setAnswer('');
      setAnswered(false);
      setCorrectAnswer('');
      setQuestionNum(data.questionNumber);
    });

    s.on('answers_revealed', (data) => {
      setCorrectAnswer(data.correctAnswer);
      setScores({ p1: data.player1Score, p2: data.player2Score });
      setTimeout(() => setStep('results'), 500);
    });

    s.on('game_ended', (data) => {
      setScores({ p1: data.player1Score, p2: data.player2Score });
      setTimeout(() => {
        alert('Partie terminée !');
        setStep('role');
      }, 2000);
    });

    s.on('error', (msg) => { alert('Erreur: ' + msg); });
  };

  const handleHostStart = () => {
    if (!playerName.trim()) { alert('Entre ton nom !'); return; }
    connectToServer('host');
  };

  const handlePlayerJoin = () => {
    if (!playerName.trim()) { alert('Entre ton nom !'); return; }
    if (!roomCode.trim()) { alert('Entre le code de salle !'); return; }
    connectToServer('player');
    setTimeout(() => {
      if (socket) socket.emit('join_room', { roomId: roomCode.toUpperCase(), player2Name: playerName });
    }, 500);
  };

  const submitAnswer = () => {
    if (!answer.trim()) return;
    setAnswered(true);
    socket.emit('submit_answer', { roomId: roomCode, answer });
  };

  const nextQuestion = () => {
    socket.emit('next_question', { roomId: roomCode });
    setStep('playing');
  };


  return (
    <div style={{padding: '2rem', background: 'transparent', maxWidth: '600px', margin: '0 auto'}}>
      {step === 'role' && (
        <div style={{textAlign: 'center'}}>
          <h2 style={{fontSize: '28px', fontWeight: 600, marginBottom: '2rem'}}>🌐 LAN 1V1</h2>
          <p style={{fontSize: '16px', marginBottom: '2rem', color: '#666'}}>Êtes-vous l'hôte ou un joueur ?</p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem'}}>
            <button
              onClick={() => { setStep('host-setup'); }}
              style={{padding: '12px 24px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'}}
            >
              🏠 Je suis l'hôte
            </button>
            <button
              onClick={() => { setStep('player-setup'); }}
              style={{padding: '12px 24px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'}}
            >
              👤 Je suis un joueur
            </button>
          </div>
        </div>
      )}

      {step === 'host-setup' && (
        <div>
          <h3>Configuration du serveur</h3>
          <input
            type="text"
            placeholder="Ton nom (hôte)"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            style={{width: '100%', padding: '10px', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box'}}
          />
          <button
            onClick={handleHostStart}
            style={{width: '100%', padding: '10px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'}}
          >
            Créer une salle
          </button>
          <button
            onClick={() => setStep('role')}
            style={{width: '100%', padding: '10px', marginTop: '0.5rem', background: '#999', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
          >
            Retour
          </button>
        </div>
      )}

      {step === 'player-setup' && (
        <div>
          <h3>Rejoindre une salle</h3>
          <input
            type="text"
            placeholder="Ton nom"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            style={{width: '100%', padding: '10px', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box'}}
          />
          <input
            type="text"
            placeholder="Code de salle"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            style={{width: '100%', padding: '10px', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box', textTransform: 'uppercase'}}
          />
          <button
            onClick={handlePlayerJoin}
            style={{width: '100%', padding: '10px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'}}
          >
            Rejoindre
          </button>
          <button
            onClick={() => setStep('role')}
            style={{width: '100%', padding: '10px', marginTop: '0.5rem', background: '#999', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
          >
            Retour
          </button>
        </div>
      )}

      {step === 'host-wait' && (
        <div style={{textAlign: 'center'}}>
          <h3>Salle créée !</h3>
          <p style={{fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px', background: '#f0f0f0', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', marginBottom: '1rem'}}>
            {roomCode}
          </p>
          <p>Partagez ce code avec votre adversaire...</p>
          <p style={{color: '#999'}}>En attente d'une connexion...</p>
        </div>
      )}

      {step === 'playing' && question && (
        <div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '14px'}}>
            <span>Q{questionNum}/{totalQuestions}</span>
            <span>{playerName}: {scores.p1} | {opponentName}: {scores.p2}</span>
          </div>
          <div style={{background: '#E3F2FD', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #90CAF9'}}>
            <h4 style={{margin: '0 0 1rem 0'}}>QUESTION</h4>
            <p style={{fontSize: '16px', margin: 0}}>{question.question}</p>
          </div>
          <input
            type="text"
            placeholder="Votre réponse..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={answered}
            style={{width: '100%', padding: '10px', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', opacity: answered ? 0.5 : 1, boxSizing: 'border-box'}}
          />
          <button
            onClick={submitAnswer}
            disabled={answered || !answer.trim()}
            style={{width: '100%', padding: '10px', background: answered ? '#ccc' : '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: answered ? 'not-allowed' : 'pointer'}}
          >
            {answered ? '✓ Réponse envoyée' : 'Envoyer'}
          </button>
        </div>
      )}

      {step === 'results' && (
        <div style={{textAlign: 'center'}}>
          <h3>Réponse correcte :</h3>
          <div style={{background: '#C8E6C9', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '16px', fontWeight: 'bold'}}>
            {correctAnswer}
          </div>
          <div style={{fontSize: '18px', marginBottom: '1.5rem'}}>
            <div>{playerName}: {scores.p1}</div>
            <div>{opponentName}: {scores.p2}</div>
          </div>
          <button
            onClick={nextQuestion}
            style={{width: '100%', padding: '10px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'}}
          >
            Question suivante →
          </button>
        </div>
      )}
    </div>
  );
};

export default LANClient;
