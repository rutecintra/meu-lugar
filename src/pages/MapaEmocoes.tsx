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
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [places, map]);
  
  return null;
};

// Ícone personalizado para marcadores
const createCustomIcon = (emotion: Emotion) => {
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="${emotionColors[emotion]}" stroke="white" stroke-width="2"/>
        <circle cx="9" cy="10" r="1.5" fill="white"/>
        <circle cx="15" cy="10" r="1.5" fill="white"/>
        <path d="M9 15c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `)}`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
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
        <div className="h-96 w-full">
          <MapContainer
            ref={mapRef}
            center={[-23.5505, -46.6333]} // São Paulo
            zoom={10}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            <MapUpdater places={filteredPlaces} />
            
            {filteredPlaces.map((place) => (
              <Marker
                key={place.id}
                position={[place.lat, place.lng]}
                icon={createCustomIcon(place.emotion)}
              >
                <Popup>
                  <div className="p-2 min-w-64">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {place.title}
                      </h4>
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
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
                        className="btn-secondary text-xs px-3 py-1"
                        title="Copiar coordenadas"
                      >
                        📋 Copiar Coordenadas
                      </button>
                      
                      <button
                        onClick={() => {
                          const url = `/meu-lugar-favorito?lat=${place.lat}&lng=${place.lng}`;
                          window.open(url, '_blank');
                        }}
                        className="btn-secondary text-xs px-3 py-1"
                        title="Usar estas coordenadas para novo lugar"
                      >
                        ➕ Novo Lugar Aqui
                      </button>
                      
                      <button
                        onClick={() => handleEditPlace(place)}
                        className="btn-primary text-xs px-3 py-1"
                      >
                        ✏️ Editar
                      </button>
                      
                      <button
                        onClick={() => handleDeletePlace(place.id)}
                        className="btn-secondary text-xs px-3 py-1 text-red-600 hover:bg-red-50"
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(emotionLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: emotionColors[key as Emotion] }}
              />
              <span className="text-sm text-gray-700">{label}</span>
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
