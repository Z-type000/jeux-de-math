import React, { useState } from 'react';

const Multiplayer1v1 = () => {
  const quizData = [
    { id: 1, chapter: 'Suites', question: 'Une suite arithmétique a u₀ = 5 et raison r = 2. Calculer u₁, u₂, u₃.', answer: 'u₁ = 7 ; u₂ = 9 ; u₃ = 11', hints: ['Suite arithmétique : on ajoute la raison à chaque fois', 'u₁ = u₀ + r', 'Continuer pareil pour u₂ et u₃'] },
    { id: 2, chapter: 'Suites', question: 'Une suite géométrique a v₀ = 100 et raison q = 2. Calculer v₁, v₂, v₃.', answer: 'v₁ = 200 ; v₂ = 400 ; v₃ = 800', hints: ['Suite géométrique : on multiplie par la raison', 'v₁ = v₀ × q', 'Refaire pareil pour v₂ et v₃'] },
    { id: 3, chapter: 'Suites', question: 'Marie reçoit 50 € pour son anniversaire, puis 10 € de plus chaque mois. Combien aura-t-elle au bout de 4 mois ?', answer: '90 €', hints: ['On ajoute toujours 10 € → suite arithmétique', 'Départ = 50 €, raison = 10', 'Au bout de 4 mois : u₄ = 50 + 4 × 10'] },
    { id: 4, chapter: 'Suites', question: 'Le prix d\'un produit augmente de 10 % par an. Il vaut 200 € aujourd\'hui. Combien vaudra-t-il dans 1 an, puis dans 2 ans ?', answer: '220 € dans 1 an ; 242 € dans 2 ans', hints: ['Augmenter de 10 % = multiplier par 1,10', 'Suite géométrique avec q = 1,10', 'Au bout de 2 ans : multiplier deux fois'] },
    { id: 5, chapter: 'Suites', question: 'Quelle est la nature de la suite : 3 ; 6 ; 9 ; 12 ; 15 ? Donner sa raison.', answer: 'Arithmétique, raison r = 3', hints: ['Regarder ce qu\'on fait pour passer d\'un terme à l\'autre', '6 − 3 = ? et 9 − 6 = ?', 'Si la différence est constante → arithmétique'] },
    { id: 6, chapter: 'Fonction inverse', question: 'Calculer f(x) = 1/x pour x = 1, x = 2, x = 5.', answer: 'f(1) = 1 ; f(2) = 0,5 ; f(5) = 0,2', hints: ['Remplacer x par chaque valeur', '1/1 = ? ; 1/2 = ?', 'Donner le résultat en décimal'] },
    { id: 7, chapter: 'Fonction inverse', question: 'Pourquoi ne peut-on pas calculer f(0) avec f(x) = 1/x ?', answer: '0 est interdit (on ne divise pas par 0)', hints: ['Que ferait 1/0 ?', 'La division par zéro est interdite en maths', 'Donc x = 0 est exclu'] },
    { id: 8, chapter: 'Fonction inverse', question: 'La fonction f(x) = 1/x est-elle croissante ou décroissante sur ]0 ; +∞[ ?', answer: 'Décroissante sur ]0 ; +∞[', hints: ['Calculer f(1), f(2), f(10)', 'Les valeurs augmentent ou diminuent ?', 'Plus x est grand, plus 1/x est…'] },
    { id: 9, chapter: 'Fonction inverse', question: 'Résoudre 1/x = 5.', answer: 'x = 0,2', hints: ['Si 1/x = 5, alors x = ?', 'Inverse de 5 = 1/5', 'Vérifier en remplaçant'] },
    { id: 10, chapter: 'Fonction inverse', question: 'Un magasin partage 60 € entre x clients. Chaque client reçoit 60/x €. Combien reçoit chacun s\'il y a 2, 5, 10 clients ?', answer: '30 € ; 12 € ; 6 €', hints: ['Diviser 60 par le nombre de clients', 'Plus il y a de clients, moins chacun reçoit', 'C\'est lié à la fonction inverse'] },
  ];

  const [gameState, setGameState] = useState('menu'); // menu, setup, playing, results
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [player1Answer, setPlayer1Answer] = useState('');
  const [player2Answer, setPlayer2Answer] = useState('');
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [answered1, setAnswered1] = useState(false);
  const [answered2, setAnswered2] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState('All');

  const chapters = [...new Set(quizData.map(q => q.chapter))];
  const filteredQuestions = selectedChapter && selectedChapter !== 'All'
    ? quizData.filter(q => q.chapter === selectedChapter)
    : quizData;

  const current = filteredQuestions[currentQuestion];

  const checkAnswer = (answer) => {
    const userLower = answer.toLowerCase().trim();
    const answerLower = current.answer.toLowerCase().trim();
    
    return userLower === answerLower || 
           userLower.includes(answerLower.split(';')[0].trim()) ||
           answerLower.includes(userLower.split(';')[0].trim());
  };

  const submitAnswers = () => {
    if (checkAnswer(player1Answer)) {
      setPlayer1Score(player1Score + 1);
    }
    if (checkAnswer(player2Answer)) {
      setPlayer2Score(player2Score + 1);
    }

    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setPlayer1Answer('');
      setPlayer2Answer('');
      setAnswered1(false);
      setAnswered2(false);
    } else {
      setGameState('results');
    }
  };

  const startGame = () => {
    if (player1Name.trim() && player2Name.trim()) {
      setGameState('playing');
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setPlayer1Name('');
    setPlayer2Name('');
    setCurrentQuestion(0);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setPlayer1Answer('');
    setPlayer2Answer('');
    setAnswered1(false);
    setAnswered2(false);
  };

  return (
    <div style={{padding: '1.5rem', background: 'transparent'}}>
      <style>{`
        .player-container { 
          display: flex; 
          gap: 2rem; 
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .player-box {
          flex: 1;
          min-width: 300px;
          padding: 1.5rem;
          border: 2px solid var(--color-border-tertiary);
          border-radius: var(--border-radius-lg);
          background: var(--color-background-secondary);
        }
        .btn { transition: all 0.2s; cursor: pointer; }
        .btn:active { transform: scale(0.98); }
      `}</style>

      {gameState === 'menu' && (
        <div style={{textAlign: 'center'}}>
          <h2 style={{fontSize: '28px', fontWeight: 600, marginBottom: '2rem', color: 'var(--color-text-primary)'}}>Mode 1V1</h2>
          <p style={{fontSize: '16px', color: 'var(--color-text-secondary)', marginBottom: '2rem'}}>Jouez à deux et gagnez qui répond au plus de questions correctement!</p>
          
          <div style={{maxWidth: '500px', margin: '0 auto'}}>
            <input
              type="text"
              placeholder="Nom du Joueur 1"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              style={{width: '100%', padding: '12px', marginBottom: '1rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--color-border-tertiary)', fontSize: '14px'}}
            />
            <input
              type="text"
              placeholder="Nom du Joueur 2"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              style={{width: '100%', padding: '12px', marginBottom: '1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--color-border-tertiary)', fontSize: '14px'}}
            />
            
            <div style={{marginBottom: '1.5rem'}}>
              <p style={{fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '0.5rem'}}>Chapitre:</p>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                style={{width: '100%', padding: '10px', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--color-border-tertiary)', fontSize: '14px'}}
              >
                <option value="All">Tous les chapitres</option>
                {chapters.map(ch => <option key={ch} value={ch}>{ch}</option>)}
              </select>
            </div>

            <button
              onClick={startGame}
              disabled={!player1Name.trim() || !player2Name.trim()}
              className="btn"
              style={{width: '100%', padding: '12px', background: (player1Name && player2Name) ? 'var(--color-background-info)' : 'var(--color-background-secondary)', color: (player1Name && player2Name) ? 'var(--color-text-info)' : 'var(--color-text-secondary)', border: '1px solid var(--color-border-info)', borderRadius: 'var(--border-radius-md)', fontSize: '16px', fontWeight: 600, cursor: (player1Name && player2Name) ? 'pointer' : 'not-allowed'}}
            >
              Commencer la partie
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
            <button
              onClick={resetGame}
              className="btn"
              style={{padding: '8px 12px', background: 'var(--color-background-secondary)', border: '1px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)', fontSize: '13px', fontWeight: 500}}
            >
              Quitter
            </button>
            <p style={{fontSize: '14px', color: 'var(--color-text-secondary)'}}>Question {currentQuestion + 1}/{filteredQuestions.length}</p>
          </div>

          <div style={{background: 'var(--color-background-info)', padding: '2rem', borderRadius: 'var(--border-radius-lg)', marginBottom: '2rem', border: '1px solid var(--color-border-info)'}}>
            <p style={{fontSize: '13px', color: 'var(--color-text-info)', margin: '0 0 1rem 0', fontWeight: 500}}>QUESTION</p>
            <h3 style={{fontSize: '18px', fontWeight: 500, color: 'var(--color-text-info)', margin: 0, lineHeight: 1.6}}>{current.question}</h3>
          </div>

          <div className="player-container">
            <div className="player-box">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h3 style={{margin: 0, color: 'var(--color-text-primary)'}}>🎮 {player1Name}</h3>
                <span style={{fontSize: '18px', fontWeight: 600, color: '#4CAF50'}}>Points: {player1Score}</span>
              </div>
              <input
                type="text"
                placeholder="Votre réponse..."
                value={player1Answer}
                onChange={(e) => setPlayer1Answer(e.target.value)}
                disabled={answered1}
                style={{width: '100%', padding: '10px 12px', marginBottom: '1rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--color-border-tertiary)', fontSize: '14px', background: answered1 ? 'var(--color-background-secondary)' : 'white', opacity: answered1 ? 0.6 : 1}}
              />
              <button
                onClick={() => setAnswered1(true)}
                disabled={answered1 || !player1Answer}
                className="btn"
                style={{width: '100%', padding: '10px', background: answered1 ? 'var(--color-background-secondary)' : 'var(--color-background-info)', color: answered1 ? 'var(--color-text-secondary)' : 'var(--color-text-info)', border: '1px solid var(--color-border-info)', borderRadius: 'var(--border-radius-md)', fontSize: '14px', fontWeight: 500, cursor: answered1 ? 'not-allowed' : 'pointer'}}
              >
                {answered1 ? '✓ Réponse envoyée' : 'Envoyer'}
              </button>
            </div>

            <div className="player-box">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h3 style={{margin: 0, color: 'var(--color-text-primary)'}}>🎮 {player2Name}</h3>
                <span style={{fontSize: '18px', fontWeight: 600, color: '#FF9800'}}>Points: {player2Score}</span>
              </div>
              <input
                type="text"
                placeholder="Votre réponse..."
                value={player2Answer}
                onChange={(e) => setPlayer2Answer(e.target.value)}
                disabled={answered2}
                style={{width: '100%', padding: '10px 12px', marginBottom: '1rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--color-border-tertiary)', fontSize: '14px', background: answered2 ? 'var(--color-background-secondary)' : 'white', opacity: answered2 ? 0.6 : 1}}
              />
              <button
                onClick={() => setAnswered2(true)}
                disabled={answered2 || !player2Answer}
                className="btn"
                style={{width: '100%', padding: '10px', background: answered2 ? 'var(--color-background-secondary)' : 'var(--color-background-info)', color: answered2 ? 'var(--color-text-secondary)' : 'var(--color-text-info)', border: '1px solid var(--color-border-info)', borderRadius: 'var(--border-radius-md)', fontSize: '14px', fontWeight: 500, cursor: answered2 ? 'not-allowed' : 'pointer'}}
              >
                {answered2 ? '✓ Réponse envoyée' : 'Envoyer'}
              </button>
            </div>
          </div>

          {answered1 && answered2 && (
            <div style={{marginTop: '2rem', textAlign: 'center'}}>
              <button
                onClick={submitAnswers}
                className="btn"
                style={{padding: '12px 24px', background: 'var(--color-background-success)', color: 'var(--color-text-success)', border: '1px solid var(--color-border-success)', borderRadius: 'var(--border-radius-md)', fontSize: '16px', fontWeight: 600, cursor: 'pointer'}}
              >
                Question suivante →
              </button>
            </div>
          )}
        </div>
      )}

      {gameState === 'results' && (
        <div style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto'}}>
          <h2 style={{fontSize: '28px', fontWeight: 600, marginBottom: '2rem', color: 'var(--color-text-primary)'}}>Résultats</h2>
          
          <div className="player-container">
            <div style={{flex: 1, padding: '2rem', background: player1Score > player2Score ? 'var(--color-background-success)' : 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-lg)', border: player1Score > player2Score ? '2px solid var(--color-border-success)' : '1px solid var(--color-border-tertiary)'}}>
              <h3 style={{fontSize: '20px', margin: '0 0 0.5rem 0', color: 'var(--color-text-primary)'}}>🎮 {player1Name}</h3>
              <p style={{fontSize: '32px', fontWeight: 700, margin: '0', color: player1Score > player2Score ? 'var(--color-text-success)' : 'var(--color-text-secondary)'}}>
                {player1Score}/{filteredQuestions.length}
              </p>
              {player1Score > player2Score && <p style={{fontSize: '14px', margin: '0.5rem 0 0 0', color: 'var(--color-text-success)', fontWeight: 600}}>🏆 VAINQUEUR!</p>}
            </div>

            <div style={{flex: 1, padding: '2rem', background: player2Score > player1Score ? 'var(--color-background-success)' : 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-lg)', border: player2Score > player1Score ? '2px solid var(--color-border-success)' : '1px solid var(--color-border-tertiary)'}}>
              <h3 style={{fontSize: '20px', margin: '0 0 0.5rem 0', color: 'var(--color-text-primary)'}}>🎮 {player2Name}</h3>
              <p style={{fontSize: '32px', fontWeight: 700, margin: '0', color: player2Score > player1Score ? 'var(--color-text-success)' : 'var(--color-text-secondary)'}}>
                {player2Score}/{filteredQuestions.length}
              </p>
              {player2Score > player1Score && <p style={{fontSize: '14px', margin: '0.5rem 0 0 0', color: 'var(--color-text-success)', fontWeight: 600}}>🏆 VAINQUEUR!</p>}
            </div>
          </div>

          {player1Score === player2Score && (
            <div style={{marginTop: '2rem', padding: '1rem', background: 'var(--color-background-warning)', border: '1px solid var(--color-border-warning)', borderRadius: 'var(--border-radius-md)', color: 'var(--color-text-warning)', fontSize: '16px', fontWeight: 600}}>
              ⚖️ C'est une égalité!
            </div>
          )}

          <button
            onClick={resetGame}
            className="btn"
            style={{marginTop: '2rem', padding: '12px 24px', background: 'var(--color-background-info)', color: 'var(--color-text-info)', border: '1px solid var(--color-border-info)', borderRadius: 'var(--border-radius-md)', fontSize: '16px', fontWeight: 600, cursor: 'pointer'}}
          >
            Rejouer
          </button>
        </div>
      )}
    </div>
  );
};

export default Multiplayer1v1;
