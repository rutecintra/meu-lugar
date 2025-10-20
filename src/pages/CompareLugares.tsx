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
          <div className="flex items-center mb-3">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-lg font-semibold text-blue-900">Como funciona:</h3>
          </div>
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
            Escolha um Lugar de Maceió para comparar
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
                className="btn-secondary flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Escolher Outro Lugar
              </button>
              
              <button
                onClick={handleSubmitAnswers}
                className="btn-primary flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium">Ver Minhas Respostas</span>
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
                <div className="flex items-center mb-3">
                  <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h4 className="font-medium text-gray-700">Sobre {selectedPlace.name}</h4>
                </div>
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
                <div className="flex items-center mb-3">
                  <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h4 className="font-medium text-gray-700">Sugestões para sua próxima observação:</h4>
                </div>
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
                className="btn-secondary flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Comparar Outro Lugar
              </button>
              
              <button
                onClick={() => setShowResults(false)}
                className="btn-primary flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Respostas
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CompareLugares;
