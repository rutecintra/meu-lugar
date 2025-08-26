import { Link } from 'react-router-dom';
import type { Place } from '../types';

interface HomeProps {
  places: Place[];
}

const Home: React.FC<HomeProps> = ({ places }) => {
  const totalPlaces = places.length;
  const placesByEmotion = places.reduce((acc, place) => {
    acc[place.emotion] = (acc[place.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const modules = [
    {
      title: 'Meu Lugar Favorito',
      description: 'Crie e salve seu lugar especial com fotos, áudios e emoções',
      icon: '⭐',
      href: '/meu-lugar',
      color: 'bg-yellow-100 border-yellow-300'
    },
    {
      title: 'Mapa das Emoções',
      description: 'Veja todos os seus lugares em um mapa colorido por emoção',
      icon: '🗺️',
      href: '/mapa',
      color: 'bg-blue-100 border-blue-300'
    },
    {
      title: 'Exploração Sensorial',
      description: 'Explore sons e descubra qual combina com seu lugar',
      icon: '🔊',
      href: '/exploracao',
      color: 'bg-green-100 border-green-300'
    },
    {
      title: 'Compare Lugares',
      description: 'Compare seu lugar com diferentes lugares do Brasil',
      icon: '🔍',
      href: '/compare',
      color: 'bg-purple-100 border-purple-300'
    },
    {
      title: 'Quiz - Perfil do Meu Lugar',
      description: 'Descubra que tipo de lugar você gosta mais',
      icon: '❓',
      href: '/quiz',
      color: 'bg-pink-100 border-pink-300'
    },
    {
      title: 'Portfólio da Turma',
      description: 'Veja todos os seus lugares organizados em um portfólio',
      icon: '📚',
      href: '/portfolio',
      color: 'bg-indigo-100 border-indigo-300'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Bem-vindo ao <span className="text-primary-600">Meu Lugar</span>! 🏠
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Aprenda Geografia de forma divertida explorando seu lugar favorito. 
          Descubra como é especial e compare com outros lugares do Brasil!
        </p>
        
        {totalPlaces > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Seus Lugares 📍
            </h3>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {totalPlaces}
            </div>
            <p className="text-sm text-gray-600">
              {totalPlaces === 1 ? 'lugar criado' : 'lugares criados'}
            </p>
            
            {Object.keys(placesByEmotion).length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Emoções mais comuns:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {Object.entries(placesByEmotion).map(([emotion, count]) => (
                    <span
                      key={emotion}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {emotion}: {count}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                to="/meu-lugar"
                className="btn-primary w-full text-center"
              >
                ➕ Adicionar Novo Lugar
              </Link>
            </div>
          </div>
        )}
        
        {/* Botão de ação rápida para adicionar primeiro lugar */}
        {totalPlaces === 0 && (
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl shadow-sm border border-primary-200 p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-primary-900 mb-3">
              🚀 Comece sua jornada!
            </h3>
            <p className="text-primary-700 text-sm mb-4">
              Crie seu primeiro lugar favorito e comece a explorar a geografia de forma divertida!
            </p>
            <Link
              to="/meu-lugar"
              className="btn-primary w-full text-center"
            >
              ⭐ Criar Meu Primeiro Lugar
            </Link>
          </div>
        )}
      </div>

      {/* Módulos */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          O que você pode fazer? 🚀
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link
              key={module.title}
              to={module.href}
              className={`block p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${module.color}`}
            >
              <div className="text-4xl mb-4">{module.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {module.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {module.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Dicas para professores */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
          💡 Dicas para Professores
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">📚 Alinhamento BNCC:</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>EF02GE01 - Identificar e comparar diferentes tipos de lugar</li>
              <li>EF02GE02 - Observar e descrever paisagens</li>
              <li>EF02GE03 - Reconhecer símbolos cartográficos básicos</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">🎯 Atividades Sugeridas:</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Saída de campo para observação</li>
              <li>Construção coletiva de mapas</li>
              <li>Comparação de diferentes territórios</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Como usar */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          📖 Como Usar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div className="text-center">
            <div className="text-2xl mb-2">1️⃣</div>
            <p>Comece criando seu lugar favorito com fotos e áudios</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">2️⃣</div>
            <p>Explore o mapa e descubra como você se sente em cada lugar</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">3️⃣</div>
            <p>Compare e aprenda sobre diferentes lugares do Brasil</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
