import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import TeacherTips from '../components/TeacherTips';
import type { Place, Emotion } from '../types';
import { StorageService } from '../services/storageService';
import { emotionLabels } from '../data/mockData';
import 'leaflet/dist/leaflet.css';

interface MeuLugarFavoritoProps {
  onPlaceAdded: (place: Place) => void;
  onPlaceUpdated: (place: Place) => void;
}

const MeuLugarFavorito: React.FC<MeuLugarFavoritoProps> = ({ 
  onPlaceAdded, 
  onPlaceUpdated 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emotion, setEmotion] = useState<Emotion>('alegria');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  
  // Campos críticos adicionais
  const [criticalCharacteristics, setCriticalCharacteristics] = useState('');
  const [whatWouldChange, setWhatWouldChange] = useState('');
  const [spacePerception, setSpacePerception] = useState('');
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [copiedCoordinates, setCopiedCoordinates] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Verificar se há coordenadas na URL (copiadas de outras páginas)
    const urlParams = new URLSearchParams(location.search);
    const urlLat = urlParams.get('lat');
    const urlLng = urlParams.get('lng');
    
    if (urlLat && urlLng) {
      setLat(parseFloat(urlLat));
      setLng(parseFloat(urlLng));
      setCopiedCoordinates(`Coordenadas copiadas: ${urlLat}, ${urlLng}`);
    } else {
      // Tentar obter localização atual
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLat(position.coords.latitude);
            setLng(position.coords.longitude);
          },
          (error) => {
            console.log('Erro ao obter localização:', error);
            // Coordenadas padrão (São Paulo)
            setLat(-23.5505);
            setLng(-46.6333);
          }
        );
      }
    }
  }, [location]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      setError('Não foi possível acessar o microfone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioBlob && audioRef.current) {
      audioRef.current.src = URL.createObjectURL(audioBlob);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !whatWouldChange.trim() || !lat || !lng) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const placeId = editingPlace?.id || StorageService.generateId();
      let photoRef = '';
      let audioRef = '';

      // Salvar foto se houver
      if (photoFile) {
        photoRef = `photo_${placeId}`;
        await StorageService.saveMedia(photoRef, photoFile);
      }

      // Salvar áudio se houver
      if (audioBlob) {
        audioRef = `audio_${placeId}`;
        await StorageService.saveMedia(audioRef, audioBlob);
      }

      const place: Place = {
        id: placeId,
        title: title.trim(),
        description: description.trim(),
        emotion,
        tags,
        lat,
        lng,
        photoRef: photoRef || undefined,
        audioRef: audioRef || undefined,
        createdAt: editingPlace?.createdAt || new Date().toISOString(),
        criticalCharacteristics: criticalCharacteristics.trim() || undefined,
        whatWouldChange: whatWouldChange.trim(),
        spacePerception: spacePerception.trim() || undefined
      };

      if (isEditing && editingPlace) {
        StorageService.updatePlace(place);
        onPlaceUpdated(place);
      } else {
        StorageService.addPlace(place);
        onPlaceAdded(place);
      }

      // Limpar formulário
      resetForm();
      
      // Redirecionar para o mapa
      navigate('/mapa');
      
    } catch (error) {
      console.error('Erro ao salvar lugar:', error);
      setError('Erro ao salvar lugar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEmotion('alegria');
    setTags([]);
    setPhotoFile(null);
    setPhotoPreview('');
    setAudioBlob(null);
    setIsEditing(false);
    setEditingPlace(null);
    setError('');
    setCriticalCharacteristics('');
    setWhatWouldChange('');
    setSpacePerception('');
  };

  const handleMapClick = (e: any) => {
    setLat(e.latlng.lat);
    setLng(e.latlng.lng);
  };

  const copyCoordinatesToClipboard = () => {
    if (lat && lng) {
      const coords = `${lat}, ${lng}`;
      navigator.clipboard.writeText(coords);
      setCopiedCoordinates(`Coordenadas copiadas: ${coords}`);
      setTimeout(() => setCopiedCoordinates(''), 3000);
    }
  };

  const pasteCoordinatesFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const coords = text.split(',').map(coord => coord.trim());
      if (coords.length === 2) {
        const newLat = parseFloat(coords[0]);
        const newLng = parseFloat(coords[1]);
        if (!isNaN(newLat) && !isNaN(newLng)) {
          setLat(newLat);
          setLng(newLng);
          setCopiedCoordinates(`Coordenadas coladas: ${newLat}, ${newLng}`);
          setTimeout(() => setCopiedCoordinates(''), 3000);
        }
      }
    } catch (error) {
      console.error('Erro ao ler da área de transferência:', error);
    }
  };

  const generateMapLink = () => {
    if (lat && lng) {
      return `https://www.google.com/maps?q=${lat},${lng}`;
    }
    return '#';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Dicas para professores */}
      <TeacherTips moduleId="meu-lugar-favorito" />
      
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditing ? 'Editar Lugar' : 'Meu Lugar Favorito'}
        </h1>
        <p className="text-gray-600 text-lg mb-2">
          {isEditing 
            ? 'Edite as informações do seu lugar especial'
            : 'Todo mundo tem um lugar favorito, me conte qual o seu!'
          }
        </p>
        {!isEditing && (
          <p className="text-gray-500 text-sm">
            Onde fica? Como você se sente lá? O que torna este lugar especial para você?
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações básicas */}
        <div className="card">
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">Informações do lugar</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Lugar *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="Ex: Minha casa, Parque da cidade..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Como você se sente lá? *
              </label>
              <select
                value={emotion}
                onChange={(e) => setEmotion(e.target.value as Emotion)}
                className="input-field"
                required
              >
                {Object.entries(emotionLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Por que este lugar é especial? *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              rows={4}
              placeholder="Descreva o que torna este lugar especial para você..."
              required
            />
          </div>
        </div>

        {/* Características críticas do lugar */}
        <div className="card">
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">Pensando criticamente sobre o lugar</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quais características deste lugar você observa que podem ser problemáticas ou que precisam de atenção?
              </label>
              <textarea
                value={criticalCharacteristics}
                onChange={(e) => setCriticalCharacteristics(e.target.value)}
                className="input-field"
                rows={3}
                placeholder="Ex: falta de segurança, poluição, falta de áreas verdes, problemas de acessibilidade..."
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Pense sobre aspectos que poderiam ser melhorados ou que afetam negativamente o lugar
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O que você mudaria neste lugar? *
              </label>
              <textarea
                value={whatWouldChange}
                onChange={(e) => setWhatWouldChange(e.target.value)}
                className="input-field"
                rows={3}
                placeholder="Se você pudesse mudar algo neste lugar, o que seria? Por quê?"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Reflita sobre melhorias que tornariam este lugar ainda mais especial ou melhor para todos
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Como você percebe este espaço de maneira crítica? O que você observa sobre como as pessoas usam este lugar?
              </label>
              <textarea
                value={spacePerception}
                onChange={(e) => setSpacePerception(e.target.value)}
                className="input-field"
                rows={3}
                placeholder="Ex: como as pessoas interagem com o espaço, quem frequenta este lugar, como o espaço é organizado..."
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Observe e reflita sobre a relação entre as pessoas e o espaço geográfico
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="card">
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">Palavras-chave</h3>
          </div>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="input-field flex-1"
              placeholder="Adicionar palavra-chave..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <button
              type="button"
              onClick={addTag}
              className="btn-primary whitespace-nowrap"
            >
              Adicionar
            </button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-primary-500 hover:text-primary-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Mídia */}
        <div className="card">
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">Mídia do lugar</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Foto */}
            <div>
              <div className="flex items-center mb-3">
                <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h4 className="font-medium text-gray-700">Foto</h4>
              </div>
              
              {photoPreview ? (
                <div className="space-y-3">
                  <img
                    src={photoPreview}
                    alt="Preview da foto"
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-secondary text-sm"
                    >
                      Trocar Foto
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview('');
                      }}
                      className="btn-secondary text-sm text-red-600"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-primary-400 hover:text-primary-400 transition-colors"
                >
                  <span className="text-2xl mb-2">
                    <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span className="text-sm">Clique para adicionar foto</span>
                </button>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            {/* Áudio */}
            <div>
              <div className="flex items-center mb-3">
                <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <h4 className="font-medium text-gray-700">Áudio</h4>
              </div>
              
              {audioBlob ? (
                <div className="space-y-3">
                  <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">🎵 Áudio gravado</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={playAudio}
                      disabled={isPlaying}
                      className="btn-secondary text-sm"
                    >
                      {isPlaying ? 'Reproduzindo...' : '▶️ Reproduzir'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAudioBlob(null)}
                      className="btn-secondary text-sm text-red-600"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-full h-32 rounded-lg flex flex-col items-center justify-center transition-colors ${
                      isRecording
                        ? 'bg-red-100 text-red-700 border-2 border-red-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-2xl mb-2">
                      {isRecording ? (
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      )}
                    </span>
                    <span className="text-sm">
                      {isRecording ? 'Clique para parar' : 'Clique para gravar'}
                    </span>
                  </button>
                  
                  {isRecording && (
                    <div className="text-center text-sm text-red-600">
                      ⏺️ Gravando...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Localização */}
        <div className="card">
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">Localização</h3>
          </div>
          
          {/* Opções de localização */}
          <div className="mb-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="btn-secondary text-sm"
              >
                {showMap ? 'Ocultar mapa' : 'Mostrar mapa'}
              </button>
              
              <button
                type="button"
                onClick={copyCoordinatesToClipboard}
                disabled={!lat || !lng}
                className="btn-secondary text-sm"
              >
                Copiar coordenadas
              </button>
              
              <button
                type="button"
                onClick={pasteCoordinatesFromClipboard}
                className="btn-secondary text-sm"
              >
                Colar coordenadas
              </button>
              
              <a
                href={generateMapLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                Ver no Google Maps
              </a>
            </div>
            
            {copiedCoordinates && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm">
                ✅ {copiedCoordinates}
              </div>
            )}
          </div>

          {/* Mapa interativo */}
          {showMap && (
            <div className="mb-4">
              <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
                <MapContainer
                  center={lat && lng ? [lat, lng] : [-23.5505, -46.6333]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* Marcador da localização atual */}
                  {lat && lng && (
                    <Marker
                      position={[lat, lng]}
                      icon={new Icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                      })}
                    />
                  )}
                  
                  {/* Componente para capturar cliques no mapa */}
                  <MapClickHandler onMapClick={handleMapClick} />
                </MapContainer>
              </div>
              
              <p className="text-sm text-gray-600 mt-2">
                💡 Clique no mapa para selecionar a localização exata do seu lugar!
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                value={lat || ''}
                onChange={(e) => setLat(parseFloat(e.target.value) || null)}
                step="any"
                className="input-field"
                placeholder="Latitude"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                value={lng || ''}
                onChange={(e) => setLng(parseFloat(e.target.value) || null)}
                step="any"
                className="input-field"
                placeholder="Longitude"
                required
              />
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Dicas para localização:</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• <strong>Clique no mapa</strong> para selecionar a localização exata</li>
              <li>• <strong>Copie coordenadas</strong> de outras páginas do projeto</li>
              <li>• <strong>Cole coordenadas</strong> da área de transferência</li>
              <li>• <strong>Use o Google Maps</strong> para verificar a localização</li>
            </ul>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={resetForm}
            className="btn-secondary"
          >
            {isEditing ? 'Cancelar' : 'Limpar'}
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? 'Salvando...' : (isEditing ? 'Atualizar lugar' : 'Salvar lugar')}
          </button>
        </div>

        {/* Elemento de áudio oculto */}
        <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          className="hidden"
        />

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

const MapClickHandler: React.FC<{ onMapClick: (e: any) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click: onMapClick,
  });
  return null;
};

export default MeuLugarFavorito;
