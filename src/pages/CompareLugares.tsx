import { useState } from 'react';
import TeacherTips from '../components/TeacherTips';
import { brazilianPlaces } from '../data/mockData';
import type { BrazilianPlace } from '../types';

const CompareLugares: React.FC = () => {
  const [selectedPlace, setSelectedPlace] = useState<BrazilianPlace | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 'similar',
      question: 'O que é parecido com o seu bairro ou lugar favorito?',
      placeholder: 'Ex: tem árvores, é movimentado, tem muitas pessoas...'
    },
    {
      id: 'different',
      question: 'O que é diferente do seu bairro ou lugar favorito?',
      placeholder: 'Ex: é mais quente, tem mais água, é mais silencioso...'
    },
    {
      id: 'learn',
      question: 'O que você gostaria de aprender sobre este lugar?',
      placeholder: 'Ex: como as pessoas vivem, que comidas comem, como é o clima...'
    }
  ];

  const handlePlaceSelect = (place: BrazilianPlace) => {
    setSelectedPlace(place);
    setShowQuestions(true);
    setShowResults(false);
    setAnswers({});
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitAnswers = () => {
    const allAnswered = questions.every(q => answers[q.id]?.trim());
    if (!allAnswered) {
      alert('Por favor, responda todas as perguntas!');
      return;
    }
    setShowResults(true);
  };

  const resetComparison = () => {
    setSelectedPlace(null);
    setShowQuestions(false);
    setShowResults(false);
    setAnswers({});
  };

  const getPlaceImage = (place: BrazilianPlace) => {
    // Usar a imagem específica de cada lugar ou fallback baseado no tipo
    if (place.imageUrl) {
      return place.imageUrl;
    }
    
    // Fallback para tipos específicos usando imagens locais
    const imageMap: { [key: string]: string } = {
      'praia': '/src/assets/praiapajucara.jpg',
      'sertao': '/src/assets/sertaoalagoas.jpg',
      'floresta': '/src/assets/mataatlantica.jpg',
      'lagoa': '/src/assets/lagoamundau.jpg',
      'cidade': '/src/assets/centrohistorico.jpg',
      'pontal': '/src/assets/pontaldabarra.jpg',
      'serra': '/src/assets/serradabarriga.jpg'
    };
    
    return imageMap[place.type.toLowerCase()] || imageMap['cidade'];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Dicas para professores */}
      <TeacherTips moduleId="compare-lugares" />
      
      {/* Cabeçalho */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Compare Lugares de Maceió
        </h1>
        <p className="text-gray-600">
          Conheça diferentes lugares de Maceió e Alagoas e compare com o seu lugar especial!
        </p>
      </div>

      {/* Instruções */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          📖 Como funciona:
        </h3>
        <ol className="text-blue-800 space-y-2 list-decimal list-inside">
          <li>Escolha um lugar de Maceió ou Alagoas que te interessa</li>
          <li>Responda as perguntas sobre semelhanças e diferenças</li>
          <li>Reflita sobre o que você pode aprender sobre sua cidade</li>
          <li>Compare com outros lugares da região depois!</li>
        </ol>
      </div>

      {/* Seleção de lugar */}
      {!selectedPlace && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🗺️ Escolha um Lugar de Maceió para Comparar
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brazilianPlaces.map((place) => (
              <div
                key={place.id}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handlePlaceSelect(place)}
              >
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={getPlaceImage(place)}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {place.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3">
                  {place.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                    {place.type}
                  </span>
                  <span className="text-gray-500">{place.region}</span>
                </div>
                
                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-1">Características:</div>
                  <div className="flex flex-wrap gap-1">
                    {place.characteristics.slice(0, 3).map((char, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {char}
                      </span>
                    ))}
                    {place.characteristics.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{place.characteristics.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Perguntas de comparação */}
      {selectedPlace && showQuestions && !showResults && (
        <div className="card">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Comparando com: {selectedPlace.name}
            </h2>
            <p className="text-gray-600">
              Agora responda as perguntas para refletir sobre as diferenças e semelhanças
            </p>
          </div>

          <div className="space-y-6">
            {questions.map((question) => (
              <div key={question.id}>
                <label className="block text-lg font-medium text-gray-900 mb-3">
                  {question.question}
                </label>
                <textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="input-field"
                  rows={4}
                  placeholder={question.placeholder}
                  required
                />
              </div>
            ))}

            <div className="flex gap-3 justify-end">
              <button
                onClick={resetComparison}
                className="btn-secondary"
              >
                🔄 Escolher Outro Lugar
              </button>
              
              <button
                onClick={handleSubmitAnswers}
                className="btn-primary"
              >
                📝 Ver Minhas Respostas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resultados da comparação */}
      {selectedPlace && showResults && (
        <div className="card bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🎉 Sua Comparação com {selectedPlace.name}
            </h2>
            <p className="text-gray-600">
              Aqui estão suas reflexões sobre as semelhanças e diferenças
            </p>
          </div>

          <div className="space-y-6">
            {/* Resumo do lugar */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">
                📍 Sobre {selectedPlace.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Tipo:</strong> {selectedPlace.type}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Região:</strong> {selectedPlace.region}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Descrição:</strong> {selectedPlace.description}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Características:</strong>
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedPlace.characteristics.map((char, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Suas respostas */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">
                💭 Suas Reflexões
              </h3>
              <div className="space-y-4">
                {questions.map((question) => (
                  <div key={question.id}>
                    <h4 className="font-medium text-gray-700 mb-2">
                      {question.question}
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-3 text-gray-800">
                      {answers[question.id]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sugestões de observação */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                🔍 Sugestões para sua próxima observação:
              </h4>
              <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
                <li>Observe as cores e formas do seu lugar</li>
                <li>Preste atenção nos sons e cheiros</li>
                <li>Note como as pessoas usam o espaço</li>
                <li>Compare com outros lugares que você conhece</li>
              </ul>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={resetComparison}
                className="btn-secondary"
              >
                🔄 Comparar Outro Lugar
              </button>
              
              <button
                onClick={() => setShowResults(false)}
                className="btn-primary"
              >
                ✏️ Editar Respostas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dicas para professores */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h4 className="font-medium text-green-900 mb-2">
          🌱 Atividade Sugerida para Professores:
        </h4>
        <div className="text-green-800 text-sm space-y-2">
          <p>
            <strong>Comparação de Territórios:</strong> Use esta atividade para introduzir 
            conceitos de diversidade territorial brasileira. Peça aos alunos para 
            compartilharem suas comparações em grupo.
          </p>
          <p>
            <strong>Objetivos de Aprendizagem:</strong> Reconhecer diferenças e semelhanças 
            entre lugares, valorizar a diversidade cultural e territorial, e desenvolver 
            habilidades de observação e comparação.
          </p>
          <p>
            <strong>Extensão:</strong> Organize uma "feira de lugares" onde cada aluno 
            apresenta um lugar diferente do Brasil para a turma.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompareLugares;
