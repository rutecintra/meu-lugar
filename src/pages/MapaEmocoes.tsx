import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
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

// Ícone personalizado para marcadores
const createCustomIcon = (emotion: Emotion) => {
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Sombra -->
        <ellipse cx="16" cy="30" rx="8" ry="2" fill="rgba(0,0,0,0.2)"/>
        
        <!-- Fundo do marcador -->
        <path d="M16 2C10.477 2 6 6.477 6 12c0 5.5 10 18 10 18s10-12.5 10-18c0-5.523-4.477-10-10-10z" 
              fill="${emotionColors[emotion]}" 
              stroke="white" 
              stroke-width="2"/>
        
        <!-- Brilho -->
        <path d="M16 4C11.582 4 8 7.582 8 12c0 4.5 8 16 8 16s8-11.5 8-16c0-4.418-3.582-8-8-8z" 
              fill="rgba(255,255,255,0.3)"/>
        
        <!-- Ícone interno baseado na emoção -->
        ${emotion === 'alegria' ? `
          <circle cx="12" cy="14" r="1.5" fill="white"/>
          <circle cx="20" cy="14" r="1.5" fill="white"/>
          <path d="M12 18c0 1.5 1.5 2.5 4 2.5s4-1 4-2.5" stroke="white" stroke-width="2" stroke-linecap="round"/>
        ` : emotion === 'calma' ? `
          <circle cx="16" cy="16" r="3" fill="white"/>
          <path d="M16 8v2M16 22v2M8 16h2M22 16h2" stroke="white" stroke-width="2" stroke-linecap="round"/>
        ` : emotion === 'curiosidade' ? `
          <circle cx="16" cy="16" r="3" fill="white"/>
          <path d="M16 8v2M16 22v2M8 16h2M22 16h2" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <path d="M16 8c0 0-2-2-2-2" stroke="white" stroke-width="1.5"/>
        ` : emotion === 'medo' ? `
          <path d="M16 8l-2 4h4l-2 4" fill="white"/>
          <circle cx="12" cy="14" r="1" fill="white"/>
          <circle cx="20" cy="14" r="1" fill="white"/>
        ` : emotion === 'saudade' ? `
          <path d="M16 8c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4z" fill="white"/>
          <path d="M16 16v6" stroke="white" stroke-width="2" stroke-linecap="round"/>
        ` : `
          <circle cx="12" cy="14" r="1.5" fill="white"/>
          <circle cx="20" cy="14" r="1.5" fill="white"/>
          <path d="M12 18c0 1.5 1.5 2.5 4 2.5s4-1 4-2.5" stroke="white" stroke-width="2" stroke-linecap="round"/>
        `}
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
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
      {/* Cabeçalho */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mapa das Emoções 🗺️
        </h1>
        <p className="text-gray-600">
          Veja todos os seus lugares especiais em um mapa colorido por emoção!
        </p>
        <div className="mt-2 text-sm text-primary-600 bg-primary-50 px-4 py-2 rounded-lg inline-block">
          🏖️ Mapa centralizado em Maceió, Alagoas
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            🔍 Filtros
          </h3>
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
                Limpar Filtros
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
            
            {filteredPlaces.map((place) => (
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
                      📍 Coordenadas: {place.lat.toFixed(6)}, {place.lng.toFixed(6)}
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
                        📋 Copiar Coordenadas
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
                        🗑️ Apagar
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Legenda */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🎨 Legenda das Cores
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
        <h4 className="font-medium text-blue-900 mb-2">💡 Dicas para usar o mapa:</h4>
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
