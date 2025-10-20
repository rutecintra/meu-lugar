import { useState } from 'react';
import TeacherTips from '../components/TeacherTips';
import type { Place } from '../types';
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

export default function Jogos({ places }: JogosProps) {
  const [activeGame, setActiveGame] = useState<'menu' | 'memory' | 'treasure' | 'puzzle' | 'emotions'>('menu');
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Estados para o Jogo da Memória
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  // Estados para a Caça ao Tesouro
  const [currentClue, setCurrentClue] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [clueFeedback, setClueFeedback] = useState('');
  const [treasureFound, setTreasureFound] = useState(false);

  // Estados para o Quiz das Emoções
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [emotionAnswers, setEmotionAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

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
      clue: 'Sou um lugar com muita água onde você pode nadar e se refrescar. O que sou?',
      answer: 'praia',
      difficulty: 'medium'
    },
    {
      id: '5',
      clue: 'Sou um lugar alto com muitas árvores e animais. O que sou?',
      answer: 'montanha',
      difficulty: 'medium'
    }
  ];

  // Objetivo do tesouro
  const treasureObjective = {
    title: '🏆 Tesouro do Explorador Geográfico',
    description: 'Você está em uma missão para encontrar o tesouro perdido do grande explorador!',
    reward: 'Cada pista resolvida te aproxima do tesouro. Complete todas as pistas para descobrir o tesouro!',
    finalReward: '🎉 Parabéns! Você encontrou o tesouro do explorador geográfico! Você é um verdadeiro aventureiro!'
  };

  // Perguntas para o quiz das emoções
  const emotionQuestions = [
    {
      question: 'Como você se sente quando está em casa?',
      options: ['Alegre e confortável', 'Calmo e relaxado', 'Curioso para explorar', 'Ansioso e preocupado']
    },
    {
      question: 'Qual emoção você sente ao visitar um parque?',
      options: ['Muito feliz e animado', 'Tranquilo e em paz', 'Interessado em descobrir', 'Nervoso com o desconhecido']
    },
    {
      question: 'Como você se sente na escola?',
      options: ['Empolgado para aprender', 'Calmo e focado', 'Curioso sobre tudo', 'Preocupado com as provas']
    }
  ];

  // Função para voltar ao menu
  const backToMenu = () => {
    setActiveGame('menu');
    setGameStarted(false);
    setScore(0);
    setMemoryCards([]);
    setFlippedCards([]);
    setMoves(0);
    setCurrentClue(0);
    setUserAnswer('');
    setClueFeedback('');
    setTreasureFound(false);
    setCurrentQuestion(0);
    setEmotionAnswers([]);
    setShowResults(false);
  };


  // Inicializar jogo da memória
  const initializeMemoryGame = () => {
    const gamePlaces = places.slice(0, 6); // Usar apenas 6 lugares para o jogo
    const cards: MemoryCard[] = [];
    
    gamePlaces.forEach((place, index) => {
      // Criar duas cartas para cada lugar (par)
      cards.push({
        id: `card-${index}-1`,
        place: place,
        isFlipped: false,
        isMatched: false
      });
      cards.push({
        id: `card-${index}-2`,
        place: place,
        isFlipped: false,
        isMatched: false
      });
    });
    
    // Embaralhar as cartas
    const shuffledCards = cards.sort(() => Math.random() - 0.5);
    setMemoryCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setGameStarted(true);
  };

  // Função para virar carta
  const flipCard = (index: number) => {
    if (flippedCards.length >= 2 || memoryCards[index].isFlipped || memoryCards[index].isMatched) {
      return;
    }

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstIndex, secondIndex] = newFlippedCards;
      const firstCard = memoryCards[firstIndex];
      const secondCard = memoryCards[secondIndex];

      if (firstCard.place.id === secondCard.place.id) {
        // Par encontrado
        setMemoryCards(prev => 
          prev.map((card, i) => 
            i === firstIndex || i === secondIndex 
              ? { ...card, isMatched: true }
              : card
          )
        );
        setScore(prev => prev + 10);
      } else {
        // Par não encontrado, virar de volta após um tempo
        setTimeout(() => {
          setMemoryCards(prev => 
            prev.map((card, i) => 
              i === firstIndex || i === secondIndex 
                ? { ...card, isFlipped: false }
                : card
            )
          );
        }, 1000);
      }
      
      setFlippedCards([]);
    } else {
      // Virar a primeira carta
      setMemoryCards(prev => 
        prev.map((card, i) => 
          i === index ? { ...card, isFlipped: true } : card
        )
      );
    }
  };

  // Função para verificar resposta da caça ao tesouro
  const checkTreasureAnswer = () => {
    const currentClueData = treasureHuntClues[currentClue];
    if (userAnswer.toLowerCase().trim() === currentClueData.answer.toLowerCase()) {
      setClueFeedback('🎉 Parabéns! Você acertou!');
      setScore(prev => prev + 20);
      setTimeout(() => {
        if (currentClue < treasureHuntClues.length - 1) {
          setCurrentClue(prev => prev + 1);
          setUserAnswer('');
          setClueFeedback('');
        } else {
          // Todas as pistas foram resolvidas - TESOURO ENCONTRADO!
          setTreasureFound(true);
          setClueFeedback('');
        }
      }, 2000);
    } else {
      setClueFeedback('❌ Tente novamente!');
      setTimeout(() => setClueFeedback(''), 2000);
    }
  };

  // Função para iniciar caça ao tesouro
  const startTreasureHunt = () => {
    setCurrentClue(0);
    setUserAnswer('');
    setClueFeedback('');
    setTreasureFound(false);
    setGameStarted(true);
  };

  // Função para verificar resposta do quiz das emoções
  const checkEmotionAnswer = (answer: string) => {
    setEmotionAnswers(prev => [...prev, answer]);
    
    if (currentQuestion < emotionQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  // Função para iniciar quiz das emoções
  const startEmotionQuiz = () => {
    setCurrentQuestion(0);
    setEmotionAnswers([]);
    setShowResults(false);
    setGameStarted(true);
  };

  // Análise de perfil emocional
  const analyzeEmotionProfile = (answers: string[]) => {
    const emotionCounts = {
      alegria: 0,
      calma: 0,
      curiosidade: 0,
      medo: 0
    };

    answers.forEach(answer => {
      if (answer.includes('Alegre') || answer.includes('feliz') || answer.includes('animado')) {
        emotionCounts.alegria++;
      } else if (answer.includes('Calmo') || answer.includes('relaxado') || answer.includes('tranquilo')) {
        emotionCounts.calma++;
      } else if (answer.includes('Curioso') || answer.includes('interessado') || answer.includes('descobrir')) {
        emotionCounts.curiosidade++;
      } else if (answer.includes('Ansioso') || answer.includes('preocupado') || answer.includes('nervoso')) {
        emotionCounts.medo++;
      }
    });

    const dominantEmotion = Object.entries(emotionCounts).reduce((a, b) => 
      emotionCounts[a[0] as keyof typeof emotionCounts] > emotionCounts[b[0] as keyof typeof emotionCounts] ? a : b
    )[0];

    const profiles = {
      alegria: {
        animal: '🐒',
        title: 'Macaco Brincalhão',
        description: 'Você é uma pessoa alegre e energética! Adora brincar e se divertir em qualquer lugar.',
        traits: ['Alegre', 'Energético', 'Brincalhão', 'Sociável'],
        advice: 'Continue espalhando alegria por onde passa!'
      },
      calma: {
        animal: '🐢',
        title: 'Tartaruga Sábia',
        description: 'Você é uma pessoa calma e reflexiva. Prefere ambientes tranquilos e pacíficos.',
        traits: ['Calmo', 'Reflexivo', 'Paciente', 'Sábio'],
        advice: 'Sua tranquilidade é um presente para todos ao seu redor!'
      },
      curiosidade: {
        animal: '🦊',
        title: 'Raposa Curiosa',
        description: 'Você é uma pessoa curiosa e exploradora! Adora descobrir coisas novas.',
        traits: ['Curioso', 'Explorador', 'Inteligente', 'Aventureiro'],
        advice: 'Sua curiosidade vai te levar a lugares incríveis!'
      },
      medo: {
        animal: '🐰',
        title: 'Coelho Cuidadoso',
        description: 'Você é uma pessoa cuidadosa e cautelosa. Sempre pensa antes de agir.',
        traits: ['Cuidadoso', 'Cauteloso', 'Atento', 'Protetor'],
        advice: 'Seu cuidado te ajuda a tomar boas decisões!'
      }
    };

    return profiles[dominantEmotion as keyof typeof profiles];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header com gradiente colorido */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              🎮 Jogos educativos 🎮
            </h1>
            <div className="absolute -top-2 -right-2 text-2xl animate-bounce">✨</div>
            <div className="absolute -bottom-2 -left-2 text-2xl animate-bounce delay-100">🌟</div>
          </div>
          <p className="text-lg text-gray-600 font-medium">
            Aprenda geografia de forma divertida através de jogos!
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <span className="text-2xl animate-pulse">🎯</span>
            <span className="text-2xl animate-pulse delay-75">🧩</span>
            <span className="text-2xl animate-pulse delay-150">🎨</span>
            <span className="text-2xl animate-pulse delay-200">🏆</span>
          </div>
        </div>

        <TeacherTips moduleId="jogos-educativos" />

        {activeGame === 'menu' && (
          <div className="grid grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Jogo da Memória */}
            <div 
              className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              onClick={() => setActiveGame('memory')}
            >
              <div className="bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden h-64">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -ml-8 -mb-8"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="text-5xl mb-3 group-hover:animate-bounce">🧠</div>
                    <h3 className="text-xl font-bold mb-2">Jogo da memória</h3>
                    <p className="text-white text-opacity-90 text-sm leading-relaxed">
                      Encontre os pares de lugares e emoções!
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-semibold">
                    <span className="mr-2">🎯</span>
                    <span>Desafie sua memória</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Caça ao Tesouro */}
            <div 
              className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              onClick={() => setActiveGame('treasure')}
            >
              <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden h-64">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -ml-8 -mb-8"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="text-5xl mb-3 group-hover:animate-bounce">🗺️</div>
                    <h3 className="text-xl font-bold mb-2">Caça ao tesouro</h3>
                    <p className="text-white text-opacity-90 text-sm leading-relaxed">
                      Resolva pistas e descubra lugares!
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-semibold">
                    <span className="mr-2">🔍</span>
                    <span>Aventure-se</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz das Emoções */}
            <div 
              className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              onClick={() => setActiveGame('emotions')}
            >
              <div className="bg-gradient-to-br from-green-400 via-teal-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden h-64">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -ml-8 -mb-8"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="text-5xl mb-3 group-hover:animate-bounce">🎭</div>
                    <h3 className="text-xl font-bold mb-2">Quiz das emoções</h3>
                    <p className="text-white text-opacity-90 text-sm leading-relaxed">
                      Descubra como você se sente em diferentes lugares!
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-semibold">
                    <span className="mr-2">💝</span>
                    <span>Conheça-se melhor</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quebra-Cabeça do Brasil */}
            <div className="group transform transition-all duration-300">
              <div className="bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden opacity-60 h-64">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -ml-8 -mb-8"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="text-5xl mb-3">🧩</div>
                    <h3 className="text-xl font-bold mb-2">Quebra-cabeça do Brasil</h3>
                    <p className="text-white text-opacity-90 text-sm leading-relaxed">
                      Em breve...
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-semibold">
                    <span className="mr-2">⏳</span>
                    <span>Em desenvolvimento</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jogo da Memória */}
        {activeGame === 'memory' && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl p-6 text-white mb-6">
              <div className="flex items-center justify-between">
                <button 
                  onClick={backToMenu} 
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-4 py-2 flex items-center transition-all duration-200"
                >
                  <span className="mr-2">←</span>
                  Voltar ao menu
                </button>
                <div className="text-center">
                  <h2 className="text-2xl font-bold">🧠 Jogo da memória</h2>
                  <div className="flex items-center justify-center space-x-4 mt-2">
                    <span className="text-sm">🏆 Pontos: {score}</span>
                    <span className="text-sm">🎯 Movimentos: {moves}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {!gameStarted ? (
              <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
                <div className="text-6xl mb-4 animate-bounce">🧠</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Jogo da memória</h3>
                <p className="text-gray-600 mb-6">Encontre os pares de lugares e emoções!</p>
                <button 
                  onClick={initializeMemoryGame}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all duration-200"
                >
                  🎮 Começar jogo
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
                  {memoryCards.map((card, index) => (
                    <div
                      key={card.id}
                      onClick={() => flipCard(index)}
                      className={`aspect-square rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        card.isFlipped || card.isMatched
                          ? 'bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-purple-300'
                          : 'bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400'
                      } ${card.isMatched ? 'opacity-50' : ''}`}
                    >
                      <div className="h-full flex flex-col items-center justify-center p-2">
                        {card.isFlipped || card.isMatched ? (
                          <>
                            <div 
                              className="w-8 h-8 rounded-full mb-2"
                              style={{ backgroundColor: emotionColors[card.place.emotion] }}
                            ></div>
                            <p className="text-xs font-bold text-gray-800 text-center">
                              {card.place.title}
                            </p>
                            <p className="text-xs text-gray-600">
                              {emotionLabels[card.place.emotion]}
                            </p>
                          </>
                        ) : (
                          <div className="text-2xl">❓</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {memoryCards.length > 0 && memoryCards.every(card => card.isMatched) && (
                  <div className="mt-6 text-center">
                    <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6">
                      <div className="text-4xl mb-2">🎉</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Parabéns!</h3>
                      <p className="text-gray-600 mb-4">Você completou o jogo da memória!</p>
                      <div className="flex justify-center space-x-4 text-sm text-gray-600">
                        <span>🏆 Pontos: {score}</span>
                        <span>🎯 Movimentos: {moves}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Caça ao Tesouro */}
        {activeGame === 'treasure' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-2xl p-6 text-white mb-6">
              <div className="flex items-center justify-between">
                <button 
                  onClick={backToMenu} 
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-4 py-2 flex items-center transition-all duration-200"
                >
                  <span className="mr-2">←</span>
                  Voltar ao menu
                </button>
                <div className="text-center">
                  <h2 className="text-2xl font-bold">🗺️ Caça ao tesouro</h2>
                  <div className="flex items-center justify-center space-x-4 mt-2">
                    <span className="text-sm">🏆 Pontos: {score}</span>
                    <span className="text-sm">🔍 Pista: {currentClue + 1}/{treasureHuntClues.length}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {!gameStarted ? (
              <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
                <div className="text-6xl mb-4 animate-bounce">🗺️</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{treasureObjective.title}</h3>
                <p className="text-gray-600 mb-4">{treasureObjective.description}</p>
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 mb-6">
                  <p className="text-gray-700 font-medium">🎯 {treasureObjective.reward}</p>
                </div>
                <button 
                  onClick={startTreasureHunt}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all duration-200"
                >
                  🎮 Começar aventura
                </button>
              </div>
            ) : treasureFound ? (
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="text-center">
                  <div className="text-8xl mb-6 animate-bounce">🏆</div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">TESOURO ENCONTRADO!</h3>
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 mb-6">
                    <p className="text-lg text-gray-700 font-medium mb-4">{treasureObjective.finalReward}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white bg-opacity-50 rounded-lg p-3">
                        <span className="font-bold">🏆 Pontos:</span> {score}
                      </div>
                      <div className="bg-white bg-opacity-50 rounded-lg p-3">
                        <span className="font-bold">🎯 Pistas:</span> {treasureHuntClues.length}/{treasureHuntClues.length}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 mb-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-3">🎉 Você é um verdadeiro explorador!</h4>
                    <p className="text-gray-700 mb-4">
                      Você demonstrou conhecimento geográfico e habilidades de resolução de problemas!
                    </p>
                    <div className="flex justify-center space-x-2">
                      <span className="text-2xl">🗺️</span>
                      <span className="text-2xl">🧭</span>
                      <span className="text-2xl">⭐</span>
                      <span className="text-2xl">🎖️</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={backToMenu}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all duration-200"
                  >
                    🏠 Voltar ao menu
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                {currentClue < treasureHuntClues.length ? (
                  <>
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 mb-6">
                      <div className="text-center">
                        <div className="text-4xl mb-4">📜</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Pista {currentClue + 1}</h3>
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                          {treasureHuntClues[currentClue].clue}
                        </p>
                        
                        {/* Barra de progresso para o tesouro */}
                        <div className="bg-gray-200 rounded-full h-3 mb-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${((currentClue + 1) / treasureHuntClues.length) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {currentClue + 1} de {treasureHuntClues.length} pistas resolvidas
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          🏆 {treasureHuntClues.length - currentClue - 1} pistas restantes para encontrar o tesouro!
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sua resposta:
                        </label>
                        <input
                          type="text"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && checkTreasureAnswer()}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="Digite sua resposta aqui..."
                        />
                      </div>
                      
                      <button
                        onClick={checkTreasureAnswer}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition-all duration-200"
                      >
                        🔍 Verificar resposta
                      </button>
                      
                      {clueFeedback && (
                        <div className={`text-center p-4 rounded-xl ${
                          clueFeedback.includes('🎉') 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {clueFeedback}
                        </div>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </div>
        )}

        {/* Quiz das Emoções */}
        {activeGame === 'emotions' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 rounded-2xl p-6 text-white mb-6">
              <div className="flex items-center justify-between">
                <button 
                  onClick={backToMenu} 
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-4 py-2 flex items-center transition-all duration-200"
                >
                  <span className="mr-2">←</span>
                  Voltar ao menu
                </button>
                <div className="text-center">
                  <h2 className="text-2xl font-bold">🎭 Quiz das emoções</h2>
                  <div className="flex items-center justify-center space-x-4 mt-2">
                    <span className="text-sm">📊 Pergunta: {currentQuestion + 1}/{emotionQuestions.length}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {!gameStarted ? (
              <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
                <div className="text-6xl mb-4 animate-bounce">🎭</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Quiz das emoções</h3>
                <p className="text-gray-600 mb-6">Descubra como você se sente em diferentes lugares!</p>
                <button 
                  onClick={startEmotionQuiz}
                  className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all duration-200"
                >
                  🎮 Começar quiz
                </button>
              </div>
            ) : !showResults ? (
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      {emotionQuestions[currentQuestion].question}
                    </h3>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {emotionQuestions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => checkEmotionAnswer(option)}
                      className="w-full p-4 text-left bg-gradient-to-r from-gray-50 to-gray-100 hover:from-green-100 hover:to-teal-100 rounded-xl border border-gray-200 hover:border-green-300 transition-all duration-200 hover:scale-105"
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">
                          {index === 0 ? '😊' : index === 1 ? '😌' : index === 2 ? '🤔' : '😰'}
                        </span>
                        <span className="text-gray-700 font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-6">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / emotionQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {currentQuestion + 1} de {emotionQuestions.length} perguntas
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz concluído!</h3>
                  <p className="text-gray-600">Aqui está seu perfil emocional:</p>
                </div>
                
                {(() => {
                  const profile = analyzeEmotionProfile(emotionAnswers);
                  return (
                    <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-xl p-6">
                      <div className="text-center">
                        <div className="text-6xl mb-4">{profile.animal}</div>
                        <h4 className="text-2xl font-bold text-gray-800 mb-2">{profile.title}</h4>
                        <p className="text-gray-700 mb-4">{profile.description}</p>
                        
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {profile.traits.map((trait, index) => (
                            <div key={index} className="bg-white bg-opacity-50 rounded-lg p-2 text-sm font-medium text-gray-700">
                              {trait}
                            </div>
                          ))}
                        </div>
                        
                        <div className="bg-white bg-opacity-50 rounded-lg p-4">
                          <p className="text-gray-700 font-medium">💡 {profile.advice}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                
                <div className="mt-6 text-center">
                  <button
                    onClick={backToMenu}
                    className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all duration-200"
                  >
                    🏠 Voltar ao menu
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};