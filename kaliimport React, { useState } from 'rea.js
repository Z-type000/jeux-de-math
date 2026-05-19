kaliimport React, { useState } from 'react';

const MathQuizGame = () => {
  const quizData = [
    // Chapitre 1: Suites (5 questions)
    { id: 1, chapter: 'Suites', question: 'Une suite arithmétique a u₀ = 5 et raison r = 2. Calculer u₁, u₂, u₃.', answer: 'u₁ = 7 ; u₂ = 9 ; u₃ = 11', hints: ['Suite arithmétique : on ajoute la raison à chaque fois', 'u₁ = u₀ + r', 'Continuer pareil pour u₂ et u₃'] },
    { id: 2, chapter: 'Suites', question: 'Une suite géométrique a v₀ = 100 et raison q = 2. Calculer v₁, v₂, v₃.', answer: 'v₁ = 200 ; v₂ = 400 ; v₃ = 800', hints: ['Suite géométrique : on multiplie par la raison', 'v₁ = v₀ × q', 'Refaire pareil pour v₂ et v₃'] },
    { id: 3, chapter: 'Suites', question: 'Marie reçoit 50 € pour son anniversaire, puis 10 € de plus chaque mois. Combien aura-t-elle au bout de 4 mois ?', answer: '90 €', hints: ['On ajoute toujours 10 € → suite arithmétique', 'Départ = 50 €, raison = 10', 'Au bout de 4 mois : u₄ = 50 + 4 × 10'] },
    { id: 4, chapter: 'Suites', question: 'Le prix d\'un produit augmente de 10 % par an. Il vaut 200 € aujourd\'hui. Combien vaudra-t-il dans 1 an, puis dans 2 ans ?', answer: '220 € dans 1 an ; 242 € dans 2 ans', hints: ['Augmenter de 10 % = multiplier par 1,10', 'Suite géométrique avec q = 1,10', 'Au bout de 2 ans : multiplier deux fois'] },
    { id: 5, chapter: 'Suites', question: 'Quelle est la nature de la suite : 3 ; 6 ; 9 ; 12 ; 15 ? Donner sa raison.', answer: 'Arithmétique, raison r = 3', hints: ['Regarder ce qu\'on fait pour passer d\'un terme à l\'autre', '6 − 3 = ? et 9 − 6 = ?', 'Si la différence est constante → arithmétique'] },

    // Chapitre 2: Fonction inverse (5 questions)
    { id: 6, chapter: 'Fonction inverse', question: 'Calculer f(x) = 1/x pour x = 1, x = 2, x = 5.', answer: 'f(1) = 1 ; f(2) = 0,5 ; f(5) = 0,2', hints: ['Remplacer x par chaque valeur', '1/1 = ? ; 1/2 = ?', 'Donner le résultat en décimal'] },
    { id: 7, chapter: 'Fonction inverse', question: 'Pourquoi ne peut-on pas calculer f(0) avec f(x) = 1/x ?', answer: '0 est interdit (on ne divise pas par 0)', hints: ['Que ferait 1/0 ?', 'La division par zéro est interdite en maths', 'Donc x = 0 est exclu'] },
    { id: 8, chapter: 'Fonction inverse', question: 'La fonction f(x) = 1/x est-elle croissante ou décroissante sur ]0 ; +∞[ ?', answer: 'Décroissante sur ]0 ; +∞[', hints: ['Calculer f(1), f(2), f(10)', 'Les valeurs augmentent ou diminuent ?', 'Plus x est grand, plus 1/x est…'] },
    { id: 9, chapter: 'Fonction inverse', question: 'Résoudre 1/x = 5.', answer: 'x = 0,2', hints: ['Si 1/x = 5, alors x = ?', 'Inverse de 5 = 1/5', 'Vérifier en remplaçant'] },
    { id: 10, chapter: 'Fonction inverse', question: 'Un magasin partage 60 € entre x clients. Chaque client reçoit 60/x €. Combien reçoit chacun s\'il y a 2, 5, 10 clients ?', answer: '30 € ; 12 € ; 6 €', hints: ['Diviser 60 par le nombre de clients', 'Plus il y a de clients, moins chacun reçoit', 'C\'est lié à la fonction inverse'] },

    // Chapitre 3: Exponentielles (5 questions)
    { id: 11, chapter: 'Exponentielles', question: 'Calculer 2¹, 2², 2³, 2⁴.', answer: '2 ; 4 ; 8 ; 16', hints: ['2ⁿ = 2 multiplié par lui-même n fois', '2² = 2 × 2', '2³ = 2 × 2 × 2'] },
    { id: 12, chapter: 'Exponentielles', question: 'Une vidéo gagne 100 vues le premier jour, puis double chaque jour. Combien de vues au 4ᵉ jour ?', answer: '800 vues', hints: ['Doubler = multiplier par 2', 'Jour 1 : 100 ; Jour 2 : 100 × 2', 'Continuer jusqu\'au jour 4'] },
    { id: 13, chapter: 'Exponentielles', question: 'Un capital de 1 000 € augmente de 10 % chaque année. Quelle valeur après 1 an ? Après 2 ans ?', answer: '1 100 € puis 1 210 €', hints: ['+10 % = multiplier par 1,10', 'Année 1 : 1000 × 1,10', 'Année 2 : multiplier encore par 1,10'] },
    { id: 14, chapter: 'Exponentielles', question: 'La fonction f(x) = 3ˣ est-elle croissante ou décroissante ?', answer: 'Croissante (base 3 > 1)', hints: ['La base est 3 (plus grand que 1)', 'Calculer f(0), f(1), f(2)', 'Les valeurs montent ou descendent ?'] },
    { id: 15, chapter: 'Exponentielles', question: 'Le nombre d\'abonnés d\'une chaîne baisse de 5 % par mois. Il y en a 2 000 aujourd\'hui. Combien dans 1 mois ?', answer: '1 900 abonnés', hints: ['Baisse de 5 % = multiplier par 0,95', '1 − 0,05 = 0,95', '2000 × 0,95'] },

    // Chapitre 4: Logarithme (5 questions)
    { id: 16, chapter: 'Logarithme', question: 'Que vaut log(10), log(100), log(1000) ?', answer: '1 ; 2 ; 3', hints: ['log(10) = 1 (à retenir)', 'log compte le nombre de zéros', '100 = 10² ; 1000 = 10³'] },
    { id: 17, chapter: 'Logarithme', question: 'Que vaut log(1) ?', answer: 'log(1) = 0', hints: ['1 = 10⁰', 'log(10ⁿ) = n', 'Donc log(1) = ?'] },
    { id: 18, chapter: 'Logarithme', question: 'Résoudre log(x) = 3.', answer: 'x = 1 000', hints: ['log(x) = 3 veut dire x = 10³', '10³ = 1000', 'Vérifier avec log(1000)'] },
    { id: 19, chapter: 'Logarithme', question: 'Simplifier log(2) + log(5).', answer: '1', hints: ['Propriété : log(a) + log(b) = log(a × b)', '2 × 5 = ?', 'log(10) = ?'] },
    { id: 20, chapter: 'Logarithme', question: 'Un capital placé à 5 % par an est multiplié par 1,05 chaque année. Au bout de combien d\'années aura-t-il doublé ? (log(2) ≈ 0,30 ; log(1,05) ≈ 0,021)', answer: '15 ans', hints: ['On cherche n tel que 1,05ⁿ = 2', 'n = log(2) / log(1,05)', 'Arrondir à l\'entier supérieur'] },

    // Chapitre 5: Statistiques (5 questions)
    { id: 21, chapter: 'Statistiques', question: 'Calculer la moyenne de : 10 ; 12 ; 14 ; 16 ; 18.', answer: 'Moyenne = 14', hints: ['Additionner toutes les notes', 'Diviser par le nombre de notes (ici 5)', 'Moyenne = somme / effectif'] },
    { id: 22, chapter: 'Statistiques', question: 'Donner la médiane de la série : 5 ; 7 ; 9 ; 12 ; 15.', answer: 'Médiane = 9', hints: ['Vérifier que les valeurs sont rangées', 'Effectif = 5 (impair)', 'Médiane = valeur au milieu'] },
    { id: 23, chapter: 'Statistiques', question: 'Une classe a une moyenne de 12 sur 20. Que signifie ce nombre ?', answer: 'Note représentative de la classe = 12', hints: ['La moyenne représente la valeur centrale', 'Si tous avaient la même note, ce serait 12', 'Penser à la répartition'] },
    { id: 24, chapter: 'Statistiques', question: 'Un magasin vendait 200 produits, il en vend maintenant 250. Calculer le taux d\'évolution.', answer: '+25 %', hints: ['Taux = (V_arrivée − V_départ) / V_départ', '(250 − 200) / 200', 'Multiplier par 100 pour avoir un %'] },
    { id: 25, chapter: 'Statistiques', question: 'Un prix passe de 80 € à 100 €. Quel est le coefficient multiplicateur ?', answer: 'CM = 1,25', hints: ['Coefficient = V_arrivée / V_départ', '100 / 80', 'Simplifier'] },

    // Chapitre 6: Probabilités (5 questions)
    { id: 26, chapter: 'Probabilités', question: 'On lance un dé à 6 faces. Quelle est la probabilité d\'obtenir un 6 ?', answer: 'P = 1/6', hints: ['1 face favorable', '6 faces possibles', 'Probabilité = favorables / total'] },
    { id: 27, chapter: 'Probabilités', question: 'Dans un sac : 3 boules rouges et 7 boules vertes. Quelle est la probabilité de tirer une boule verte ?', answer: 'P = 0,7', hints: ['Compter le total des boules', 'Vertes = 7', 'P = vertes / total'] },
    { id: 28, chapter: 'Probabilités', question: 'On tire une carte d\'un jeu de 52 cartes. Probabilité d\'obtenir un cœur ?', answer: 'P = 1/4 = 0,25', hints: ['Il y a 4 couleurs égales', 'Combien de cœurs ?', '13 cœurs sur 52 cartes'] },
    { id: 29, chapter: 'Probabilités', question: 'La probabilité qu\'il pleuve demain est 0,3. Quelle est la probabilité qu\'il ne pleuve PAS ?', answer: 'P = 0,7 (soit 70 %)', hints: ['Probabilité de l\'événement contraire', 'P(non A) = 1 − P(A)', '1 − 0,3'] },
    { id: 30, chapter: 'Probabilités', question: 'Dans une classe, 60 % aiment les maths, 50 % aiment le sport, 30 % aiment les deux. Probabilité d\'aimer maths OU sport ?', answer: 'P = 0,8', hints: ['Formule : P(A∪B) = P(A) + P(B) − P(A∩B)', 'Remplacer en décimal', '0,6 + 0,5 − 0,3'] },

    // Chapitre 7: Variables aléatoires (5 questions)
    { id: 31, chapter: 'Variables aléatoires', question: 'X peut prendre les valeurs 1, 2, 3 avec : P(X=1) = 0,2 ; P(X=2) = 0,5 ; P(X=3) = 0,3. Est-ce une loi de probabilité ?', answer: 'Oui, c\'est une loi de probabilité', hints: ['Chaque probabilité doit être entre 0 et 1', 'La somme doit faire 1', 'Additionner les trois'] },
    { id: 32, chapter: 'Variables aléatoires', question: 'Avec la loi : X = 1 (p=0,2) ; X = 2 (p=0,5) ; X = 3 (p=0,3), calculer l\'espérance E(X).', answer: 'E(X) = 2,1', hints: ['E(X) = somme de (valeur × probabilité)', '1×0,2 + 2×0,5 + 3×0,3', 'C\'est la moyenne attendue'] },
    { id: 33, chapter: 'Variables aléatoires', question: 'Un jeu : on gagne 10 € avec une probabilité 0,5, sinon on gagne 0 €. Quelle est l\'espérance de gain ?', answer: 'E(G) = 5 €', hints: ['Deux issues possibles : 10 ou 0', 'E = 10 × 0,5 + 0 × 0,5', 'C\'est le gain moyen sur de nombreuses parties'] },
    { id: 34, chapter: 'Variables aléatoires', question: 'On mise 3 € à un jeu. On gagne 10 € avec une probabilité 0,2, sinon on perd la mise. Le jeu est-il avantageux ?', answer: 'E(G) = −1 € : jeu défavorable', hints: ['Gain net = ce qu\'on reçoit − mise', 'Gagne : 10 − 3 = +7 € (proba 0,2)', 'Perd : −3 € (proba 0,8)'] },
    { id: 35, chapter: 'Variables aléatoires', question: 'Compléter la loi : P(X=0)=0,3 ; P(X=1)=0,4 ; P(X=2)= ?', answer: 'P(X=2) = 0,3', hints: ['La somme des probabilités doit faire 1', '0,3 + 0,4 + ? = 1', 'Isoler le nombre manquant'] },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(0);
  const [answered_count, setAnsweredCount] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [flipped, setFlipped] = useState(false);

  const chapters = [...new Set(quizData.map(q => q.chapter))];
  const filteredQuestions = selectedChapter && selectedChapter !== 'All'
    ? quizData.filter(q => q.chapter === selectedChapter)
    : quizData;

  const current = filteredQuestions[currentQuestion];

  const checkAnswer = () => {
    const userLower = userAnswer.toLowerCase().trim();
    const answerLower = current.answer.toLowerCase().trim();
    
    const correct = userLower === answerLower || 
                    userLower.includes(answerLower.split(';')[0].trim()) ||
                    answerLower.includes(userLower.split(';')[0].trim());
    
    if (correct) {
      setScore(score + Math.max(1, 3 - showHint));
    }
    setAnswered(true);
    setAnsweredCount(answered_count + 1);
  };

  const nextQuestion = () => {
    const nextIdx = (currentQuestion + 1) % filteredQuestions.length;
    setCurrentQuestion(nextIdx);
    setUserAnswer('');
    setAnswered(false);
    setShowHint(0);
    setFlipped(false);
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    setUserAnswer('');
    setShowHint(0);
    setAnsweredCount(0);
    setSelectedChapter(null);
    setFlipped(false);
  };

  return (
    <div style={{padding: '1.5rem 0', background: 'transparent'}}>
      <style>{`
        .flip-card { perspective: 1000px; }
        .flip-card.flipped .flip-inner { transform: rotateY(180deg); }
        .flip-inner { transition: transform 0.6s; transform-style: preserve-3d; }
        .flip-front, .flip-back { backface-visibility: hidden; }
        .flip-back { transform: rotateY(180deg); }
        .btn { transition: all 0.2s; cursor: pointer; }
        .btn:active { transform: scale(0.98); }
      `}</style>

      {selectedChapter === null ? (
        <div>
          <h2 style={{fontSize: '24px', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-text-primary)'}}>Révise Math STMG</h2>
          <p style={{fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '1.5rem'}}>Sélectionne un chapitre ou tous les chapitres</p>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px'}}>
            <button
              onClick={() => { setSelectedChapter('All'); setCurrentQuestion(0); }}
              className="btn"
              style={{padding: '12px 16px', background: 'var(--color-background-info)', color: 'var(--color-text-info)', border: '0.5px solid var(--color-border-info)', borderRadius: 'var(--border-radius-md)', fontWeight: 500, fontSize: '14px'}}
            >
              Tous (35 Q)
            </button>
            {chapters.map(ch => {
              const count = quizData.filter(q => q.chapter === ch).length;
              return (
                <button
                  key={ch}
                  onClick={() => { setSelectedChapter(ch); setCurrentQuestion(0); }}
                  className="btn"
                  style={{padding: '12px 16px', background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)', fontWeight: 500, fontSize: '14px'}}
                >
                  {ch} ({count})
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <div>
              <p style={{fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0'}}>Question {currentQuestion + 1}/{filteredQuestions.length}</p>
              <p style={{fontSize: '16px', fontWeight: 500, color: 'var(--color-text-primary)', margin: 0}}>Points: {score}</p>
            </div>
            <button
              onClick={resetGame}
              className="btn"
              style={{padding: '8px 12px', background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)', fontSize: '13px', fontWeight: 500}}
            >
              Recommencer
            </button>
          </div>

          <div className={`flip-card ${flipped ? 'flipped' : ''}`} style={{marginBottom: '1.5rem'}}>
            <div className="flip-inner">
              <div className="flip-front"
                   style={{background: 'var(--color-background-info)', padding: '1.5rem', borderRadius: 'var(--border-radius-lg)', cursor: 'pointer', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', border: '0.5px solid var(--color-border-info)' }}
                   onClick={() => setFlipped(!flipped)}>
                <p style={{fontSize: '12px', color: 'var(--color-text-info)', margin: '0 0 12px 0', fontWeight: 500}}>QUESTION</p>
                <h3 style={{fontSize: '16px', fontWeight: 500, color: 'var(--color-text-info)', margin: '0 0 12px 0', lineHeight: 1.6}}>{current.question}</h3>
                <p style={{fontSize: '12px', color: 'var(--color-text-info)', margin: 0, opacity: 0.7}}>Clic pour voir la réponse →</p>
              </div>
              
              <div className="flip-back"
                   style={{background: 'var(--color-background-success)', padding: '1.5rem', borderRadius: 'var(--border-radius-lg)', cursor: 'pointer', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', border: '0.5px solid var(--color-border-success)'}}
                   onClick={() => setFlipped(!flipped)}>
                <p style={{fontSize: '12px', color: 'var(--color-text-success)', margin: '0 0 12px 0', fontWeight: 500}}>RÉPONSE</p>
                <h3 style={{fontSize: '16px', fontWeight: 500, color: 'var(--color-text-success)', margin: 0}}>{current.answer}</h3>
                <p style={{fontSize: '12px', color: 'var(--color-text-success)', margin: '12px 0 0 0', opacity: 0.7}}>Clic pour voir la question ←</p>
              </div>
            </div>
          </div>

          {!answered ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <input
                type="text"
                placeholder="Ta réponse..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && userAnswer && checkAnswer()}
                style={{padding: '10px 12px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-tertiary)', fontSize: '14px'}}
              />
              
              {showHint < current.hints.length && (
                <button
                  onClick={() => setShowHint(showHint + 1)}
                  className="btn"
                  style={{padding: '10px 12px', background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)', fontSize: '14px', fontWeight: 500, textAlign: 'center'}}
                >
                  💡 Indice ({showHint}/{current.hints.length})
                </button>
              )}
              
              {showHint > 0 && (
                <div style={{background: 'var(--color-background-warning)', border: '0.5px solid var(--color-border-warning)', padding: '12px', borderRadius: 'var(--border-radius-md)', fontSize: '13px', color: 'var(--color-text-warning)', lineHeight: 1.5}}>
                  {current.hints[showHint - 1]}
                </div>
              )}
              
              <button
                onClick={checkAnswer}
                disabled={!userAnswer}
                className="btn"
                style={{padding: '12px', background: userAnswer ? 'var(--color-background-info)' : 'var(--color-background-secondary)', color: userAnswer ? 'var(--color-text-info)' : 'var(--color-text-secondary)', border: '0.5px solid ' + (userAnswer ? 'var(--color-border-info)' : 'var(--color-border-tertiary)'), borderRadius: 'var(--border-radius-md)', fontSize: '14px', fontWeight: 500, cursor: userAnswer ? 'pointer' : 'not-allowed'}}
              >
                Vérifier
              </button>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <div style={{padding: '12px', background: score > (answered_count - 1) * 3 ? 'var(--color-background-success)' : 'var(--color-background-danger)', border: '0.5px solid ' + (score > (answered_count - 1) * 3 ? 'var(--color-border-success)' : 'var(--color-border-danger)'), borderRadius: 'var(--border-radius-md)', textAlign: 'center', fontWeight: 500, fontSize: '14px', color: score > (answered_count - 1) * 3 ? 'var(--color-text-success)' : 'var(--color-text-danger)'}}>
                {score > (answered_count - 1) * 3 ? '✓ Correct !' : '✗ Incorrect'}
              </div>
              
              <button
                onClick={nextQuestion}
                className="btn"
                style={{padding: '12px', background: 'var(--color-background-info)', color: 'var(--color-text-info)', border: '0.5px solid var(--color-border-info)', borderRadius: 'var(--border-radius-md)', fontWeight: 500, fontSize: '14px'}}
              >
                Question suivante →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MathQuizGame;