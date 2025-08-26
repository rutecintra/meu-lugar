import { useState, useEffect } from 'react';
import type { Place, Emotion } from '../types';
import { emotionLabels, emotionColors } from '../data/mockData';

interface JogosProps {
  places: Place[];
}

interface MemoryCard {
  id: string;
  place: Place;
  isFlipped: boolean;
  isMatched: boolean;
}

interface TreasureHuntClue {
  id: string;
  clue: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const Jogos: React.FC<JogosProps> = ({ places }) => {
  const [activeGame, setActiveGame] = useState<'menu' | 'memory' | 'treasure' | 'puzzle' | 'emotions'>('menu');
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Estados para o Jogo da Memória
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  // Estados para a Caça ao Tesouro
  const [currentClue, setCurrentClue] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [clueFeedback, setClueFeedback] = useState('');

  // Estados para o Quiz das Emoções
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [emotionScore, setEmotionScore] = useState(0);

  // Pistas para a caça ao tesouro
  const treasureHuntClues: TreasureHuntClue[] = [
    {
      id: '1',
      clue: 'Sou um lugar onde você pode brincar, correr e se divertir ao ar livre. O que sou?',
      answer: 'parque',
      difficulty: 'easy'
    },
    {
      id: '2',
      clue: 'Sou um lugar onde você mora com sua família. O que sou?',
      answer: 'casa',
      difficulty: 'easy'
    },
    {
      id: '3',
      clue: 'Sou um lugar onde você aprende coisas novas todos os dias. O que sou?',
      answer: 'escola',
      difficulty: 'easy'
    },
    {
      id: '4',
      clue: 'Sou um lugar onde você pode ver filmes e comer pipoca. O que sou?',
      answer: 'cinema',
      difficulty: 'medium'
    },
    {
      id: '5',
      clue: 'Sou um lugar onde você pode nadar e se refrescar no verão. O que sou?',
      answer: 'praia',
      difficulty: 'medium'
    }
  ];

  // Perguntas para o quiz das emoções
  const emotionQuestions = [
    {
      question: 'Como você se sente quando está em um parque?',
      options: ['Alegria', 'Calma', 'Curiosidade', 'Medo'],
      correct: 'Alegria'
    },
    {
      question: 'Como você se sente quando está em casa?',
      options: ['Calma', 'Saudade', 'Curiosidade', 'Medo'],
      correct: 'Calma'
    },
    {
      question: 'Como você se sente quando está na escola?',
      options: ['Curiosidade', 'Alegria', 'Medo', 'Saudade'],
      correct: 'Curiosidade'
    }
  ];

  // Inicializar jogo da memória
  const initializeMemoryGame = () => {
    if (places.length < 4) {
      alert('Você precisa ter pelo menos 4 lugares para jogar!');
      return;
    }

    const selectedPlaces = places.slice(0, 6); // Máximo 6 lugares para não ficar muito difícil
    const cards: MemoryCard[] = [];
    
    selectedPlaces.forEach((place, index) => {
      // Adicionar duas cartas para cada lugar (para formar pares)
      cards.push(
        { id: `card-${index}-1`, place, isFlipped: false, isMatched: false },
        { id: `card-${index}-2`, place, isFlipped: false, isMatched: false }
      );
    });

    // Embaralhar as cartas
    const shuffledCards = cards.sort(() => Math.random() - 0.5);
    setMemoryCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setScore(0);
    setGameStarted(true);
  };

  // Virar carta no jogo da memória
  const flipCard = (cardId: string) => {
    if (flippedCards.length >= 2) return; // Máximo 2 cartas viradas por vez
    
    setMemoryCards(prev => 
      prev.map(card => 
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );
    
    setFlippedCards(prev => [...prev, cardId]);
  };

  // Verificar se há um par
  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [card1Id, card2Id] = flippedCards;
      const card1 = memoryCards.find(c => c.id === card1Id);
      const card2 = memoryCards.find(c => c.id === card2Id);
      
      if (card1 && card2 && card1.place.id === card2.place.id) {
        // Par encontrado!
        setMemoryCards(prev => 
          prev.map(card => 
            card.id === card1Id || card.id === card2Id 
              ? { ...card, isMatched: true } 
              : card
          )
        );
        setScore(prev => prev + 10);
        setFlippedCards([]);
      } else {
        // Par não encontrado, virar de volta após 1 segundo
        setTimeout(() => {
          setMemoryCards(prev => 
            prev.map(card => 
              card.id === card1Id || card.id === card2Id 
                ? { ...card, isFlipped: false } 
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, memoryCards]);

  // Verificar se o jogo da memória terminou
  useEffect(() => {
    if (memoryCards.length > 0 && memoryCards.every(card => card.isMatched)) {
      setTimeout(() => {
        alert(`🎉 Parabéns! Você completou o jogo em ${moves} jogadas com ${score} pontos!`);
        setGameStarted(false);
      }, 500);
    }
  }, [memoryCards, moves, score]);

  // Iniciar caça ao tesouro
  const startTreasureHunt = () => {
    setCurrentClue(0);
    setUserAnswer('');
    setClueFeedback('');
    setScore(0);
    setGameStarted(true);
  };

  // Verificar resposta da caça ao tesouro
  const checkTreasureHuntAnswer = () => {
    const currentClueData = treasureHuntClues[currentClue];
    const isCorrect = userAnswer.toLowerCase().includes(currentClueData.answer.toLowerCase());
    
    if (isCorrect) {
      setScore(prev => prev + (currentClueData.difficulty === 'easy' ? 5 : 10));
      setClueFeedback('🎉 Correto! Parabéns!');
      
      setTimeout(() => {
        if (currentClue < treasureHuntClues.length - 1) {
          setCurrentClue(prev => prev + 1);
          setUserAnswer('');
          setClueFeedback('');
        } else {
          alert(`🎊 Parabéns! Você completou a caça ao tesouro com ${score} pontos!`);
          setGameStarted(false);
        }
      }, 1500);
    } else {
      setClueFeedback('❌ Tente novamente! Dica: pense no lugar onde você pode fazer essas atividades.');
    }
  };

  // Iniciar quiz das emoções
  const startEmotionQuiz = () => {
    setCurrentQuestion(0);
    setEmotionScore(0);
    setScore(0);
    setGameStarted(true);
  };

  // Verificar resposta do quiz
  const checkEmotionAnswer = (selectedAnswer: string) => {
    const currentQuestionData = emotionQuestions[currentQuestion];
    const isCorrect = selectedAnswer === currentQuestionData.correct;
    
    if (isCorrect) {
      setEmotionScore(prev => prev + 1);
      setScore(prev => prev + 10);
    }
    
    setTimeout(() => {
      if (currentQuestion < emotionQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        const percentage = Math.round((emotionScore / emotionQuestions.length) * 100);
        alert(`🎯 Quiz completo! Sua pontuação: ${emotionScore}/${emotionQuestions.length} (${percentage}%)`);
        setGameStarted(false);
      }
    }, 1000);
  };

  // Voltar ao menu
  const backToMenu = () => {
    setActiveGame('menu');
    setGameStarted(false);
    setScore(0);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎮 Jogos Educativos
        </h1>
        <p className="text-gray-600">
          Aprenda geografia de forma divertida através de jogos!
        </p>
      </div>

      {/* Menu de jogos */}
      {activeGame === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={() => setActiveGame('memory')}
            className="card hover:shadow-lg transition-all duration-200 hover:scale-105 text-center p-6"
          >
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Jogo da Memória
            </h3>
            <p className="text-gray-600 text-sm">
              Encontre pares de lugares e teste sua memória!
            </p>
            <div className="mt-4 text-xs text-gray-500">
              💡 Dica: Você precisa ter pelo menos 4 lugares criados
            </div>
          </button>

          <button
            onClick={() => setActiveGame('treasure')}
            className="card hover:shadow-lg transition-all duration-200 hover:scale-105 text-center p-6"
          >
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Caça ao Tesouro
            </h3>
            <p className="text-gray-600 text-sm">
              Resolva pistas para descobrir lugares!
            </p>
            <div className="mt-4 text-xs text-gray-500">
              🎯 5 pistas para resolver
            </div>
          </button>

          <button
            onClick={() => setActiveGame('puzzle')}
            className="card hover:shadow-lg transition-all duration-200 hover:scale-105 text-center p-6"
          >
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Quebra-Cabeça do Brasil
            </h3>
            <p className="text-gray-600 text-sm">
              Monte o mapa do Brasil arrastando os estados!
            </p>
            <div className="mt-4 text-xs text-gray-500">
              🧩 Em breve!
            </div>
          </button>

          <button
            onClick={() => setActiveGame('emotions')}
            className="card hover:shadow-lg transition-all duration-200 hover:scale-105 text-center p-6"
          >
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Quiz das Emoções
            </h3>
            <p className="text-gray-600 text-sm">
              Relacione lugares com sentimentos!
            </p>
            <div className="mt-4 text-xs text-gray-500">
              ❓ 3 perguntas para responder
            </div>
          </button>
        </div>
      )}

      {/* Jogo da Memória */}
      {activeGame === 'memory' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button onClick={backToMenu} className="btn-secondary">
              ← Voltar ao Menu
            </button>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{score}</div>
              <div className="text-sm text-gray-600">Pontos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{moves}</div>
              <div className="text-sm text-gray-600">Jogadas</div>
            </div>
          </div>

          {!gameStarted ? (
            <div className="text-center">
              <button onClick={initializeMemoryGame} className="btn-primary text-lg px-8 py-4">
                🎮 Iniciar Jogo da Memória
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {memoryCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => !card.isMatched && !card.isFlipped && flipCard(card.id)}
                  disabled={card.isMatched || card.isFlipped}
                  className={`aspect-square rounded-lg border-2 transition-all duration-300 ${
                    card.isMatched
                      ? 'bg-green-100 border-green-300 cursor-default'
                      : card.isFlipped
                      ? 'bg-white border-primary-300 cursor-default'
                      : 'bg-primary-100 border-primary-200 hover:bg-primary-200 cursor-pointer'
                  }`}
                >
                  {card.isFlipped || card.isMatched ? (
                    <div className="h-full flex flex-col items-center justify-center p-2">
                      <div className="text-lg font-semibold text-gray-900 mb-1">
                        {card.place.title}
                      </div>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: emotionColors[card.place.emotion] }}
                      />
                      <div className="text-xs text-gray-600 mt-1">
                        {emotionLabels[card.place.emotion]}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-2xl text-primary-600">
                      ❓
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Caça ao Tesouro */}
      {activeGame === 'treasure' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button onClick={backToMenu} className="btn-secondary">
              ← Voltar ao Menu
            </button>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{score}</div>
              <div className="text-sm text-gray-600">Pontos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {currentClue + 1}/{treasureHuntClues.length}
              </div>
              <div className="text-sm text-gray-600">Pista</div>
            </div>
          </div>

          {!gameStarted ? (
            <div className="text-center">
              <button onClick={startTreasureHunt} className="btn-primary text-lg px-8 py-4">
                🗺️ Iniciar Caça ao Tesouro
              </button>
            </div>
          ) : (
            <div className="card text-center max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                🕵️ Pista #{currentClue + 1}
              </h3>
              
              <div className="mb-6">
                <p className="text-lg text-gray-700 mb-4">
                  {treasureHuntClues[currentClue].clue}
                </p>
                
                <div className="text-sm text-gray-500 mb-4">
                  Dificuldade: 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    treasureHuntClues[currentClue].difficulty === 'easy' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {treasureHuntClues[currentClue].difficulty === 'easy' ? 'Fácil' : 'Médio'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Digite sua resposta..."
                  className="input-field text-center text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && checkTreasureHuntAnswer()}
                />
                
                <button
                  onClick={checkTreasureHuntAnswer}
                  className="btn-primary w-full"
                >
                  🔍 Verificar Resposta
                </button>
              </div>

              {clueFeedback && (
                <div className={`mt-4 p-3 rounded-lg ${
                  clueFeedback.includes('Correto') 
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {clueFeedback}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quiz das Emoções */}
      {activeGame === 'emotions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button onClick={backToMenu} className="btn-secondary">
              ← Voltar ao Menu
            </button>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{score}</div>
              <div className="text-sm text-gray-600">Pontos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {currentQuestion + 1}/{emotionQuestions.length}
              </div>
              <div className="text-sm text-gray-600">Pergunta</div>
            </div>
          </div>

          {!gameStarted ? (
            <div className="text-center">
              <button onClick={startEmotionQuiz} className="btn-primary text-lg px-8 py-4">
                ⭐ Iniciar Quiz das Emoções
              </button>
            </div>
          ) : (
            <div className="card text-center max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                ❓ Pergunta #{currentQuestion + 1}
              </h3>
              
              <p className="text-lg text-gray-700 mb-8">
                {emotionQuestions[currentQuestion].question}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emotionQuestions[currentQuestion].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => checkEmotionAnswer(option)}
                    className="btn-secondary text-lg py-4 hover:bg-primary-50 hover:border-primary-300 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quebra-Cabeça do Brasil (em breve) */}
      {activeGame === 'puzzle' && (
        <div className="text-center space-y-6">
          <button onClick={backToMenu} className="btn-secondary">
            ← Voltar ao Menu
          </button>
          
          <div className="card max-w-md mx-auto">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Em Construção
            </h3>
            <p className="text-gray-600">
              Este jogo estará disponível em breve! 
              Será um quebra-cabeça interativo para montar o mapa do Brasil.
            </p>
          </div>
        </div>
      )}

      {/* Dicas para professores */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-medium text-blue-900 mb-3 flex items-center">
          💡 Dicas para Professores
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h5 className="font-medium mb-2">🎯 Objetivos Educativos:</h5>
            <ul className="space-y-1 list-disc list-inside">
              <li>Desenvolver memória visual e espacial</li>
              <li>Ampliar vocabulário geográfico</li>
              <li>Relacionar lugares com emoções</li>
              <li>Estimular pensamento lógico</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">🎮 Como Usar:</h5>
            <ul className="space-y-1 list-disc list-inside">
              <li>Use como atividade de aquecimento</li>
              <li>Competição entre grupos</li>
              <li>Revisão de conceitos</li>
              <li>Atividade de encerramento</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jogos;
