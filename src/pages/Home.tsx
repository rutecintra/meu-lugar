import { Link } from 'react-router-dom';
import TeacherTips from '../components/TeacherTips';
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
      title: 'Meu lugar favorito',
      description: 'Crie e salve seu lugar especial com fotos, áudios e emoções',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      href: '/meu-lugar',
      color: 'bg-yellow-100 border-yellow-300'
    },
    {
      title: 'Mapa das emoções',
      description: 'Veja todos os seus lugares em um mapa colorido por emoção',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      href: '/mapa',
      color: 'bg-blue-100 border-blue-300'
    },
    {
      title: 'Exploração sensorial',
      description: 'Explore sons e descubra qual combina com seu lugar',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      ),
      href: '/exploracao',
      color: 'bg-green-100 border-green-300'
    },
    {
      title: 'Compare lugares',
      description: 'Compare seu lugar com diferentes lugares do Brasil',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      href: '/compare',
      color: 'bg-purple-100 border-purple-300'
    },
    {
      title: 'Quiz - perfil do meu lugar',
      description: 'Descubra que tipo de lugar você gosta mais',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: '/quiz',
      color: 'bg-pink-100 border-pink-300'
    },
    {
      title: 'Jogos educativos',
      description: 'Aprenda geografia de forma divertida através de jogos!',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: '/jogos',
      color: 'bg-orange-100 border-orange-300'
    },
    {
      title: 'Portfólio da turma',
      description: 'Veja todos os seus lugares organizados em um portfólio',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      href: '/portfolio',
      color: 'bg-indigo-100 border-indigo-300'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Dicas para professores */}
      <TeacherTips />

      {/* Hero Section */}
      <div className="text-center space-y-4 px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
          Bem-vindo ao <span className="text-primary-600">Meu lugar</span>!
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
          Vamos explorar juntos e aprender geografia de forma divertida. 
        </p>
        
        {totalPlaces > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Seus lugares
            </h3>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {totalPlaces}
            </div>
            <p className="text-sm text-gray-600">
              {totalPlaces === 1 ? 'lugar criado' : 'lugares criados'}
            </p>
            
            {Object.keys(placesByEmotion).length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">emoções mais comuns:</p>
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
                ➕ Adicionar novo lugar
              </Link>
            </div>
          </div>
        )}
        
        {/* Botão de ação rápida para adicionar primeiro lugar */}
        {totalPlaces === 0 && (
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl shadow-sm border border-primary-200 p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-primary-900 mb-3">
              Comece sua jornada!
            </h3>
            <p className="text-primary-700 text-sm mb-4">
              Crie seu primeiro lugar favorito e comece a explorar a geografia de forma divertida!
            </p>
            <Link
              to="/meu-lugar"
              className="btn-primary w-full text-center"
            >
              Criar meu primeiro lugar
            </Link>
          </div>
        )}
      </div>

      {/* Módulos */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          O que você pode fazer?
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {modules.map((module) => (
            <Link
              key={module.title}
              to={module.href}
              className={`block p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${module.color}`}
            >
              <div className="text-4xl mb-4 text-gray-600">{module.icon}</div>
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


      {/* Como usar */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          Como usar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div className="text-center">
            <div className="text-2xl mb-2 font-bold text-primary-600">1</div>
            <p>Comece criando seu lugar favorito com fotos e áudios</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2 font-bold text-primary-600">2</div>
            <p>Explore o mapa e descubra como você se sente em cada lugar</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2 font-bold text-primary-600">3</div>
            <p>Compare e aprenda sobre diferentes lugares do Brasil</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
