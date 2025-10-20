import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import TeacherTips from '../components/TeacherTips';
import type { Place, Emotion } from '../types';

import { emotionColors, emotionLabels } from '../data/mockData';
import 'leaflet/dist/leaflet.css';

interface MapaEmocoesProps {
  places: Place[];
  onPlaceDeleted: (placeId: string) => void;
}

// Componente para ajustar o mapa quando places mudam
const MapUpdater: React.FC<{ places: Place[] }> = ({ places }) => {
  const map = useMap();
  
  useEffect(() => {
    if (places.length > 0) {
      const bounds = new LatLngBounds(
        places.map(place => [place.lat, place.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      // Se não há lugares, centralizar em Maceió
      map.setView([-9.6498, -35.7089], 8);
    }
  }, [places, map]);
  
  return null;
};

// Ícone personalizado para marcadores - Versão Ultra Simplificada
const createCustomIcon = (emotion: Emotion) => {
  // Verificar se a emoção é válida
  const validEmotions = ['alegria', 'calma', 'curiosidade', 'medo', 'saudade'];
  const safeEmotion = validEmotions.includes(emotion) ? emotion : 'alegria';
  
  // Verificar se a cor da emoção existe
  const emotionColor = emotionColors[safeEmotion] || '#FFD700';
  
  console.log('Criando ícone para emoção:', safeEmotion, 'cor:', emotionColor);
  
  // Criar um SVG ultra simples - apenas círculo colorido
  const svgContent = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="12" fill="${emotionColor}" stroke="white" stroke-width="3"/>
  </svg>`;
  
  try {
    return new Icon({
      iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  } catch (error) {
    console.error('Erro ao criar ícone personalizado:', error);
    // Fallback para ícone padrão do Leaflet
    return new Icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });
  }
};

const MapaEmocoes: React.FC<MapaEmocoesProps> = ({ 
  places, 
  onPlaceDeleted 
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | 'todos'>('todos');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [showFilters, setShowFilters] = useState(false);
  
  const mapRef = useRef<any>(null);

  // Obter todas as tags únicas
  const allTags = Array.from(new Set(places.flatMap(place => place.tags)));

  // Filtrar lugares baseado nos filtros
  const filteredPlaces = places.filter(place => {
    const emotionMatch = selectedEmotion === 'todos' || place.emotion === selectedEmotion;
    const tagMatch = selectedTags.length === 0 || 
      selectedTags.some(tag => place.tags.includes(tag));
    
    return emotionMatch && tagMatch;
  });

  // Debug: Log dos lugares filtrados
  useEffect(() => {
    console.log('Lugares filtrados:', filteredPlaces);
    console.log('Total de lugares:', places.length);
  }, [filteredPlaces, places]);

  const handleEditPlace = (place: Place) => {
    // Aqui você pode implementar a navegação para a página de edição
    // ou abrir um modal de edição
    console.log('Editar lugar:', place);
  };

  const handleDeletePlace = (placeId: string) => {
    if (confirm('Tem certeza que deseja apagar este lugar?')) {
      onPlaceDeleted(placeId);
    }
  };

  const resetFilters = () => {
    setSelectedEmotion('todos');
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6">
      {/* Dicas para professores */}
      <TeacherTips moduleId="mapa-emocoes" />
      
      {/* Cabeçalho */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mapa das emoções
        </h1>
        <p className="text-gray-600">
          Veja todos os seus lugares especiais em um mapa colorido por emoção!
        </p>
        <div className="mt-2 text-sm text-primary-600 bg-primary-50 px-4 py-2 rounded-lg inline-block">
          Mapa centralizado em Maceió, Alagoas
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary text-sm"
          >
            {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
          </button>
        </div>

        {showFilters && (
          <div className="space-y-4">
            {/* Filtro por emoção */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emoção:
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedEmotion('todos')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedEmotion === 'todos'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Todas
                </button>
                {Object.entries(emotionLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedEmotion(key as Emotion)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedEmotion === key
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por tags */}
            {allTags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Palavras-chave:
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Botão reset */}
            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="btn-secondary text-sm"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {filteredPlaces.length}
          </div>
          <div className="text-sm text-gray-600">
            {filteredPlaces.length === 1 ? 'Lugar' : 'Lugares'} encontrado{filteredPlaces.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {new Set(filteredPlaces.map(p => p.emotion)).size}
          </div>
          <div className="text-sm text-gray-600">
            Emoções diferentes
          </div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {new Set(filteredPlaces.flatMap(p => p.tags)).size}
          </div>
          <div className="text-sm text-gray-600">
            Palavras-chave únicas
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="card p-0 overflow-hidden">
        <div className="h-[500px] w-full relative">
          {/* Botão para centralizar em Maceió */}
          <button
            onClick={() => {
              if (mapRef.current) {
                mapRef.current.setView([-9.6498, -35.7089], 8);
              }
            }}
            className="absolute top-4 right-4 z-[1000] bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg shadow-lg border border-gray-200 text-sm font-medium transition-colors"
            title="Centralizar em Maceió"
          >
            🏖️ Maceió
          </button>
          
          <MapContainer
            ref={mapRef}
            center={[-9.6498, -35.7089]} // Maceió
            zoom={8}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            
            <MapUpdater places={filteredPlaces} />
            
            {filteredPlaces.map((place) => {
              // Validar dados do lugar antes de renderizar
              if (!place || !place.id || typeof place.lat !== 'number' || typeof place.lng !== 'number') {
                console.warn('Lugar com dados inválidos ignorado:', place);
                return null;
              }
              
              // Verificar se as coordenadas são válidas
              if (isNaN(place.lat) || isNaN(place.lng) || place.lat < -90 || place.lat > 90 || place.lng < -180 || place.lng > 180) {
                console.warn('Coordenadas inválidas para lugar:', place.id, place.lat, place.lng);
                return null;
              }
              
              return (
                <Marker
                  key={place.id}
                  position={[place.lat, place.lng]}
                  icon={createCustomIcon(place.emotion)}
                >
                <Popup>
                  <div className="p-4 min-w-72">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-gray-900 text-lg">
                        {place.title}
                      </h4>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                        style={{ backgroundColor: emotionColors[place.emotion] }}
                      >
                        {emotionLabels[place.emotion]}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">
                      {place.description}
                    </p>
                    
                    {place.tags.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-1">Palavras-chave:</div>
                        <div className="flex flex-wrap gap-1">
                          {place.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 mb-3">
                      Criado em: {new Date(place.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-3">
                      <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm text-gray-600">Coordenadas: {place.lat.toFixed(6)}, {place.lng.toFixed(6)}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          const coords = `${place.lat}, ${place.lng}`;
                          navigator.clipboard.writeText(coords);
                          alert(`Coordenadas copiadas: ${coords}`);
                        }}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs px-3 py-2 rounded-lg font-medium transition-colors"
                        title="Copiar coordenadas"
                      >
                        Copiar coordenadas
                      </button>
                      
                      <button
                        onClick={() => {
                          const url = `/meu-lugar-favorito?lat=${place.lat}&lng=${place.lng}`;
                          window.open(url, '_blank');
                        }}
                        className="bg-green-100 hover:bg-green-200 text-green-700 text-xs px-3 py-2 rounded-lg font-medium transition-colors"
                        title="Usar estas coordenadas para novo lugar"
                      >
                        ➕ Novo Lugar Aqui
                      </button>
                      
                      <button
                        onClick={() => handleEditPlace(place)}
                        className="bg-primary-100 hover:bg-primary-200 text-primary-700 text-xs px-3 py-2 rounded-lg font-medium transition-colors"
                      >
                        ✏️ Editar
                      </button>
                      
                      <button
                        onClick={() => handleDeletePlace(place.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 text-xs px-3 py-2 rounded-lg font-medium transition-colors"
                      >
                        Apagar
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* Legenda */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Legenda das cores
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(emotionLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div
                className="w-6 h-6 rounded-full shadow-sm border-2 border-white"
                style={{ backgroundColor: emotionColors[key as Emotion] }}
              />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dicas */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-medium text-blue-900 mb-2">Dicas para usar o mapa:</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Clique nos marcadores para ver detalhes dos lugares</li>
          <li>Use os filtros para encontrar lugares específicos</li>
          <li>As cores representam como você se sente em cada lugar</li>
          <li>Você pode editar ou apagar lugares diretamente do mapa</li>
        </ul>
      </div>
    </div>
  );
};

export default MapaEmocoes;
