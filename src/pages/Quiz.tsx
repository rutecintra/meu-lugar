import { useState } from 'react';
import TeacherTips from '../components/TeacherTips';
import { quizQuestions, quizResults } from '../data/mockData';
import type { QuizResult } from '../types';

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const handleAnswerSelect = (answer: string) => {
    const questionId = quizQuestions[currentQuestion].id;
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const finishQuiz = () => {
    const allAnswered = quizQuestions.every(q => answers[q.id]);
    if (!allAnswered) {
      alert('Por favor, responda todas as perguntas antes de finalizar!');
      return;
    }

    // Calcular resultado baseado nas respostas
    const result = calculateResult();
    setQuizResult(result);
    setShowResults(true);
  };

  const calculateResult = (): QuizResult => {
    // Lógica simples para determinar o perfil baseado nas respostas
    let aconchegante = 0;
    let explorador = 0;
    let movimentado = 0;

    // Mapear respostas para perfis
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = quizQuestions.find(q => q.id === questionId);
      if (question) {
        const answerIndex = question.options.indexOf(answer);
        
        // Lógica de pontuação baseada no índice da resposta
        switch (questionId) {
          case '1': // Como você se sente
            if (answerIndex === 0) movimentado += 2; // Muito feliz e animado
            else if (answerIndex === 1) aconchegante += 2; // Calmo e tranquilo
            else explorador += 2; // Curioso para explorar
            break;
          case '2': // O que você gosta de fazer
            if (answerIndex === 0) aconchegante += 2; // Ficar quieto e observar
            else if (answerIndex === 1) movimentado += 2; // Correr e brincar
            else explorador += 2; // Descobrir coisas novas
            break;
          case '3': // Som do lugar
            if (answerIndex === 0) movimentado += 2; // Muito barulhento
            else if (answerIndex === 1) aconchegante += 2; // Silencioso e calmo
            else explorador += 1; // Uma mistura dos dois
            break;
          case '4': // Cheiro do lugar
            if (answerIndex === 0) aconchegante += 2; // Cheiro de natureza
            else if (answerIndex === 1) movimentado += 2; // Cheiro da cidade
            else explorador += 1; // Diferentes cheiros
            break;
          case '5': // Descrição do lugar
            if (answerIndex === 0) aconchegante += 2; // Refúgio tranquilo
            else if (answerIndex === 1) explorador += 2; // Lugar para aventuras
            else movimentado += 2; // Lugar movimentado
            break;
          case '6': // O que mudaria
            if (answerIndex === 0) aconchegante += 2; // Deixar mais tranquilo
            else if (answerIndex === 1) movimentado += 2; // Adicionar atividades
            else explorador += 1; // Manter como está
            break;
        }
      }
    });

    // Determinar o perfil dominante
    if (aconchegante >= explorador && aconchegante >= movimentado) {
      return quizResults[0]; // aconchegante
    } else if (explorador >= movimentado) {
      return quizResults[1]; // explorador
    } else {
      return quizResults[2]; // movimentado
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setQuizResult(null);
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / quizQuestions.length) * 100;
  };

  const getQuestionIcon = (questionId: string) => {
    const icons: { [key: string]: string } = {
      '1': '😊',
      '2': '🎯',
      '3': '🔊',
      '4': '👃',
      '5': '🏠',
      '6': '✨'
    };
    return icons[questionId] || '❓';
  };

  if (showResults && quizResult) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resultado do quiz!
          </h1>
          <p className="text-gray-600">
            Descubra qual é o perfil do seu lugar favorito
          </p>
        </div>

        {/* Resultado */}
        <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">
              {quizResult.type === 'aconchegante' ? '🏠' : 
               quizResult.type === 'explorador' ? '🗺️' : '🏃'}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900">
              Seu lugar é: <span className="text-primary-600 capitalize">{quizResult.type}</span>
            </h2>
            
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              {quizResult.description}
            </p>
          </div>
        </div>

        {/* Sugestões */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💡 Sugestões para sua próxima saída de campo:
          </h3>
          
          <div className="space-y-3">
            {quizResult.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-primary-600 text-lg">✨</span>
                <p className="text-gray-700">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Suas respostas */}
        <div className="card">
            <div className="flex items-center mb-4">
              <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Suas respostas:</h3>
            </div>
          
          <div className="space-y-4">
            {quizQuestions.map((question, index) => (
              <div key={question.id} className="border-l-4 border-primary-200 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getQuestionIcon(question.id)}</span>
                  <h4 className="font-medium text-gray-900">
                    Pergunta {index + 1}: {question.question}
                  </h4>
                </div>
                
                <div className="ml-6">
                  <p className="text-sm text-gray-600 mb-1">Sua resposta:</p>
                  <div className="bg-primary-50 text-primary-700 px-3 py-2 rounded-lg inline-block">
                    {answers[question.id]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={resetQuiz}
            className="btn-secondary"
          >
            🔄 Fazer Quiz Novamente
          </button>
          
          <button
            onClick={() => window.location.href = '/portfolio'}
            className="btn-primary"
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-sm font-medium text-primary-600">Ver Meu Portfólio</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  const currentQ = quizQuestions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Dicas para professores */}
      <TeacherTips moduleId="quiz-perfil" />
      
      {/* Cabeçalho */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quiz - perfil do Meu Lugar
        </h1>
        <p className="text-gray-600 text-lg mb-2">
          Descubra que tipo de lugar você mais gosta! Responda nosso quiz e vamos conhecer melhor seus lugares favoritos!
        </p>
        <p className="text-gray-500 text-sm">
          Responda algumas perguntas para descobrir que tipo de lugar você gosta mais!
        </p>
      </div>

      {/* Barra de progresso */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Pergunta {currentQuestion + 1} de {quizQuestions.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(getProgressPercentage())}% completo
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Pergunta atual */}
      <div className="card">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">{getQuestionIcon(currentQ.id)}</div>
          <h2 className="text-xl font-semibold text-gray-900">
            {currentQ.question}
          </h2>
        </div>

        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                answers[currentQ.id] === option
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  answers[currentQ.id] === option
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                }`}>
                  {answers[currentQ.id] === option && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navegação */}
      <div className="flex justify-between">
        <button
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            currentQuestion === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ← Anterior
        </button>

        {currentQuestion === quizQuestions.length - 1 ? (
          <button
            onClick={finishQuiz}
            disabled={!answers[currentQ.id]}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              !answers[currentQ.id]
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            🎯 Finalizar Quiz
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            disabled={!answers[currentQ.id]}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              !answers[currentQ.id]
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            Próxima →
          </button>
        )}
      </div>

      {/* Dicas */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-medium text-blue-900 mb-2">Dica:</h4>
        <p className="text-blue-800 text-sm">
          Não há respostas certas ou erradas! Responda com base no que você realmente 
          sente e pensa sobre o seu lugar favorito.
        </p>
      </div>

    </div>
  );
};

export default Quiz;
