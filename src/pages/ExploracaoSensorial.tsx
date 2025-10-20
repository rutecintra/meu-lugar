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
      setFeedback('Você gosta de lugares tranquilos e naturais! 🌿');
    } else if (urbanSounds.length > natureSounds.length) {
      setFeedback('Você prefere lugares movimentados e urbanos! 🏙️');
    } else {
      setFeedback('Você gosta de uma mistura de ambientes! 🌍');
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
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          📖 Como funciona:
        </h3>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎵 Sons Disponíveis
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
                  {isPlaying === sound.id ? '⏹️' : '▶️'}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{sound.name}</div>
                  <div className="text-sm text-gray-600">{sound.description}</div>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    sound.category === 'natureza' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {sound.category === 'natureza' ? '🌿 Natureza' : '🏙️ Urbano'}
                  </span>
                </div>
                
                <div className="text-gray-400 text-sm">↕️ Arraste</div>
              </div>
            ))}
          </div>
        </div>

        {/* Área de seleção */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 Sons Selecionados para o Seu Lugar
          </h3>
          
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
                <span className="text-4xl mb-2">🎵</span>
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
                      {isPlaying === sound.id ? '⏹️' : '▶️'}
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
              className="btn-primary flex-1"
            >
              🎯 Finalizar
            </button>
            
            <button
              onClick={resetActivity}
              className="btn-secondary"
            >
              🔄 Recomeçar
            </button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {showResults && (
        <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎉 Resultado da Sua Exploração!
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
                    <span className="text-primary-600">🎵</span>
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
              <h4 className="font-medium text-blue-900 mb-2">
                💡 Dica para sua próxima saída de campo:
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
              className="btn-primary"
            >
              🔄 Fazer Novamente
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

      {/* Dicas para professores */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h4 className="font-medium text-green-900 mb-2">
          🌱 Atividade Sugerida para Professores:
        </h4>
        <div className="text-green-800 text-sm space-y-2">
          <p>
            <strong>Saída de Campo Sensorial:</strong> Leve os alunos para uma caminhada pelo bairro 
            ou escola e peça para que prestem atenção nos sons. Depois, use esta atividade para 
            refletir sobre as experiências.
          </p>
          <p>
            <strong>Objetivos de Aprendizagem:</strong> Desenvolver a observação sensorial, 
            reconhecer diferentes ambientes através dos sons, e conectar experiências pessoais 
            com conceitos geográficos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExploracaoSensorial;
