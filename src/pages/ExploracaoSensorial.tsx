import { useState, useRef, useEffect } from 'react';
import TeacherTips from '../components/TeacherTips';
import { sounds } from '../data/mockData';
import type { Sound } from '../types';

const ExploracaoSensorial: React.FC = () => {
  const [selectedSounds, setSelectedSounds] = useState<Sound[]>([]);
  const [draggedSound, setDraggedSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState('');
  
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const handleDragStart = (e: React.DragEvent, sound: Sound) => {
    setDraggedSound(sound);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedSound && !selectedSounds.find(s => s.id === draggedSound.id)) {
      setSelectedSounds(prev => [...prev, draggedSound]);
    }
    setDraggedSound(null);
  };

  const removeSound = (soundId: string) => {
    setSelectedSounds(prev => prev.filter(s => s.id !== soundId));
  };

  const playSound = (sound: Sound) => {
    const audio = audioRefs.current[sound.id];
    if (audio) {
      if (isPlaying === sound.id) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(null);
      } else {
        // Parar todos os outros áudios
        Object.values(audioRefs.current).forEach(a => {
          a.pause();
          a.currentTime = 0;
        });
        
        audio.play();
        setIsPlaying(sound.id);
      }
    }
  };

  const handleFinish = () => {
    if (selectedSounds.length === 0) {
      setFeedback('Selecione pelo menos um som para continuar!');
      return;
    }
    
    setShowResults(true);
    setFeedback('');
    
    // Gerar feedback baseado nos sons selecionados
    const natureSounds = selectedSounds.filter(s => s.category === 'natureza');
    const urbanSounds = selectedSounds.filter(s => s.category === 'urbano');
    
    if (natureSounds.length > urbanSounds.length) {
      setFeedback('Você gosta de lugares tranquilos e naturais!');
    } else if (urbanSounds.length > natureSounds.length) {
      setFeedback('Você prefere lugares movimentados e urbanos!');
    } else {
      setFeedback('Você gosta de uma mistura de ambientes!');
    }
  };

  const resetActivity = () => {
    setSelectedSounds([]);
    setShowResults(false);
    setFeedback('');
    setIsPlaying(null);
  };

  useEffect(() => {
    // Limpar áudios quando componente desmontar
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Dicas para professores */}
      <TeacherTips moduleId="exploracao-sensorial" />
      
      {/* Cabeçalho */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Exploração Sensorial
        </h1>
        <p className="text-gray-600">
          Explore diferentes sons e descubra qual combina com o seu lugar especial!
        </p>
      </div>

      {/* Instruções */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center mb-3">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-lg font-semibold text-blue-900">Como funciona:</h3>
        </div>
        <ol className="text-blue-800 space-y-2 list-decimal list-inside">
          <li>Clique nos sons para ouvi-los</li>
          <li>Arraste os sons que combinam com seu lugar para a área de seleção</li>
          <li>Pode selecionar quantos quiser!</li>
          <li>Clique em "Finalizar" para ver o resultado</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sons disponíveis */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            Sons Disponíveis
          </h3>
          
          <div className="space-y-3">
            {sounds.map((sound) => (
              <div
                key={sound.id}
                draggable
                onDragStart={(e) => handleDragStart(e, sound)}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
              >
                <button
                  onClick={() => playSound(sound)}
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isPlaying === sound.id
                      ? 'bg-red-500 text-white'
                      : 'bg-primary-500 text-white hover:bg-primary-600'
                  }`}
                >
                  {isPlaying === sound.id ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{sound.name}</div>
                  <div className="text-sm text-gray-600">{sound.description}</div>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    sound.category === 'natureza' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    <div className="flex items-center">
                      {sound.category === 'natureza' ? (
                        <svg className="w-3 h-3 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      )}
                      <span className="text-xs text-gray-600">
                        {sound.category === 'natureza' ? 'Natureza' : 'Urbano'}
                      </span>
                    </div>
                  </span>
                </div>
                
                <div className="flex items-center text-gray-400 text-sm">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  Arraste
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Área de seleção */}
        <div className="card">
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">Sons Selecionados para o Seu Lugar</h3>
          </div>
          
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`min-h-64 border-2 border-dashed rounded-lg p-4 transition-colors ${
              selectedSounds.length === 0
                ? 'border-gray-300 bg-gray-50'
                : 'border-primary-300 bg-primary-50'
            }`}
          >
            {selectedSounds.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <svg className="w-12 h-12 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <p className="text-center">
                  Arraste os sons que combinam<br />
                  com o seu lugar para cá
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedSounds.map((sound) => (
                  <div
                    key={sound.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <button
                      onClick={() => playSound(sound)}
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                        isPlaying === sound.id
                          ? 'bg-red-500 text-white'
                          : 'bg-primary-500 text-white hover:bg-primary-600'
                      }`}
                    >
                      {isPlaying === sound.id ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm">{sound.name}</div>
                      <div className="text-xs text-gray-600">{sound.description}</div>
                    </div>
                    
                    <button
                      onClick={() => removeSound(sound.id)}
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleFinish}
              disabled={selectedSounds.length === 0}
              className="btn-primary flex-1 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Finalizar
            </button>
            
            <button
              onClick={resetActivity}
              className="btn-secondary flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Recomeçar
            </button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {showResults && (
        <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resultado da Sua Exploração!
          </h3>
          
          <div className="text-center space-y-4">
            <div className="text-2xl">{feedback}</div>
            
            <div className="bg-white rounded-lg p-4 max-w-md mx-auto">
              <h4 className="font-medium text-gray-900 mb-2">
                Sons que você escolheu:
              </h4>
              <div className="space-y-2">
                {selectedSounds.map((sound) => (
                  <div key={sound.id} className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <span>{sound.name}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      sound.category === 'natureza' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {sound.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Dica para sua próxima saída de campo:
              </h4>
              <p className="text-blue-800 text-sm">
                {selectedSounds.some(s => s.category === 'natureza') && selectedSounds.some(s => s.category === 'urbano')
                  ? 'Observe como os sons mudam quando você vai de um lugar natural para um urbano. Que diferenças você nota?'
                  : selectedSounds.some(s => s.category === 'natureza')
                  ? 'Preste atenção nos sons da natureza ao seu redor. Que animais você consegue identificar?'
                  : 'Observe os diferentes sons da cidade. Como eles mudam ao longo do dia?'
                }
              </p>
            </div>
            
            <button
              onClick={resetActivity}
              className="btn-primary flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Fazer Novamente
            </button>
          </div>
        </div>
      )}

      {/* Elementos de áudio ocultos */}
      {sounds.map((sound) => (
        <audio
          key={sound.id}
          ref={(el) => {
            if (el) audioRefs.current[sound.id] = el;
          }}
          src={sound.audioUrl}
          onEnded={() => setIsPlaying(null)}
          onPause={() => setIsPlaying(null)}
          className="hidden"
        />
      ))}

      {/* Mensagem de feedback */}
      {feedback && !showResults && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700 text-center">
          {feedback}
        </div>
      )}

    </div>
  );
};

export default ExploracaoSensorial;
