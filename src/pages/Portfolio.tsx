import { useState } from 'react';
import TeacherTips from '../components/TeacherTips';
import type { Place, Emotion } from '../types';

import { emotionColors, emotionLabels } from '../data/mockData';

interface PortfolioProps {
  places: Place[];
}

const Portfolio: React.FC<PortfolioProps> = ({ places }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | 'todos'>('todos');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'emotion'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  // Obter todas as tags únicas
  const allTags = Array.from(new Set(places.flatMap(place => place.tags)));

  // Filtrar e ordenar lugares
  const filteredAndSortedPlaces = places
    .filter(place => {
      const emotionMatch = selectedEmotion === 'todos' || place.emotion === selectedEmotion;
      const tagMatch = selectedTags.length === 0 || 
        selectedTags.some(tag => place.tags.includes(tag));
      const searchMatch = place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return emotionMatch && tagMatch && searchMatch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'emotion':
          comparison = a.emotion.localeCompare(b.emotion);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const resetFilters = () => {
    setSelectedEmotion('todos');
    setSelectedTags([]);
    setSearchTerm('');
    setSortBy('date');
    setSortOrder('desc');
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const exportPortfolio = () => {
    const portfolio = {
      places: filteredAndSortedPlaces,
      exportDate: new Date().toISOString(),
      filters: {
        emotion: selectedEmotion,
        tags: selectedTags,
        sortBy,
        sortOrder
      }
    };

    const dataStr = JSON.stringify(portfolio, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-meu-lugar-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPlaceImage = (place: Place) => {
    if (place.photoRef) {
      // Em produção, carregar a imagem do IndexedDB
      return '/placeholder-image.jpg'; // Placeholder
    }
    return '/placeholder-image.jpg';
  };

  const getEmotionIcon = (emotion: Emotion) => {
    const icons: { [key in Emotion]: string } = {
      alegria: '😊',
      calma: '😌',
      curiosidade: '🤔',
      medo: '😰',
      saudade: '🥺'
    };
    return icons[emotion];
  };

  if (places.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="text-6xl mb-4 font-bold text-gray-300">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Seu Portfólio está Vazio
        </h1>
        <p className="text-gray-600 text-lg">
          Você ainda não criou nenhum lugar especial. Comece criando seu primeiro lugar!
        </p>
        <button
          onClick={() => window.location.href = '/meu-lugar'}
          className="btn-primary text-lg px-8 py-3"
        >
          🏠 Criar Meu Primeiro Lugar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Dicas para professores */}
      <TeacherTips moduleId="portfolio-turma" />
      
      {/* Cabeçalho */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Portfólio da Turma
        </h1>
        <p className="text-gray-600">
          Veja todos os seus lugares especiais organizados em um portfólio completo!
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {places.length}
          </div>
          <div className="text-sm text-gray-600">Total de Lugares</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {new Set(places.map(p => p.emotion)).size}
          </div>
          <div className="text-sm text-gray-600">Emoções Diferentes</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {new Set(places.flatMap(p => p.tags)).size}
          </div>
          <div className="text-sm text-gray-600">Palavras-chave</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {places.filter(p => p.photoRef || p.audioRef).length}
          </div>
          <div className="text-sm text-gray-600">Com Mídia</div>
        </div>
      </div>

      {/* Filtros e controles */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Busca */}
          <div className="flex-1 min-w-0">
            <input
              type="text"
              placeholder="Buscar lugares..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3">
            {/* Filtro por emoção */}
            <select
              value={selectedEmotion}
              onChange={(e) => setSelectedEmotion(e.target.value as Emotion | 'todos')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="todos">Todas as emoções</option>
              {Object.entries(emotionLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            {/* Filtro por tags */}
            {allTags.length > 0 && (
              <select
                value=""
                onChange={(e) => e.target.value && toggleTag(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Adicionar tag</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            )}

            {/* Ordenação */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy as 'date' | 'title' | 'emotion');
                setSortOrder(newSortOrder as 'asc' | 'desc');
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="date-desc">Mais recentes</option>
              <option value="date-asc">Mais antigos</option>
              <option value="title-asc">A-Z</option>
              <option value="title-desc">Z-A</option>
              <option value="emotion-asc">Emoção A-Z</option>
              <option value="emotion-desc">Emoção Z-A</option>
            </select>

            {/* Modo de visualização */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Tags selecionadas */}
        {selectedTags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Filtros ativos:</span>
              {selectedTags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="text-primary-500 hover:text-primary-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Botões de ação */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex gap-3 justify-between">
          <button
            onClick={resetFilters}
            className="btn-secondary text-sm"
          >
            🔄 Limpar Filtros
          </button>
          
          <button
            onClick={exportPortfolio}
            className="btn-primary text-sm"
          >
            Exportar Portfólio
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div className="text-center mb-4">
        <p className="text-gray-600">
          {filteredAndSortedPlaces.length} de {places.length} lugares encontrados
        </p>
      </div>

      {/* Lista de lugares */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPlaces.map((place) => (
            <div key={place.id} className="card hover:shadow-lg transition-shadow">
              {/* Imagem */}
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <img
                  src={getPlaceImage(place)}
                  alt={place.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Conteúdo */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {place.title}
                  </h3>
                  <span className="text-2xl">{getEmotionIcon(place.emotion)}</span>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-3">
                  {place.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: emotionColors[place.emotion] }}
                  >
                    {emotionLabels[place.emotion]}
                  </span>
                  
                  <span className="text-xs text-gray-500">
                    {new Date(place.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                
                {place.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {place.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {place.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{place.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Indicadores de mídia */}
                <div className="flex gap-2 text-sm text-gray-500">
                  {place.photoRef && <span>📷</span>}
                  {place.audioRef && <span>🎤</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedPlaces.map((place) => (
            <div key={place.id} className="card">
              <div className="flex gap-4">
                {/* Imagem */}
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={getPlaceImage(place)}
                    alt={place.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {place.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getEmotionIcon(place.emotion)}</span>
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: emotionColors[place.emotion] }}
                      >
                        {emotionLabels[place.emotion]}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">
                    {place.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {place.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {place.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {place.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              +{place.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex gap-2 text-sm text-gray-500">
                        {place.photoRef && <span>📷</span>}
                        {place.audioRef && <span>🎤</span>}
                      </div>
                    </div>
                    
                    <span className="text-xs text-gray-500">
                      {new Date(place.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensagem quando não há resultados */}
      {filteredAndSortedPlaces.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum lugar encontrado
          </h3>
          <p className="text-gray-600 mb-4">
            Tente ajustar os filtros ou a busca para encontrar mais lugares.
          </p>
          <button
            onClick={resetFilters}
            className="btn-primary"
          >
            🔄 Limpar Filtros
          </button>
        </div>
      )}

      {/* Dicas para professores */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h4 className="font-medium text-green-900 mb-2">
          🌱 Atividade Sugerida para Professores:
        </h4>
        <div className="text-green-800 text-sm space-y-2">
          <p>
            <strong>Apresentação Coletiva:</strong> Use o modo de exportação para criar 
            um portfólio da turma. Projete os lugares em sala de aula e peça aos alunos 
            para apresentarem seus lugares favoritos.
          </p>
          <p>
            <strong>Análise de Padrões:</strong> Analise com a turma quais emoções e 
            características são mais comuns nos lugares escolhidos. Discuta por que 
            certos tipos de lugar são mais populares.
          </p>
          <p>
            <strong>Extensão:</strong> Crie um "mapa emocional" da escola ou bairro 
            baseado nos lugares criados pelos alunos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
