import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MobileMenu from './components/MobileMenu';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MeuLugarFavorito from './pages/MeuLugarFavorito';
import MapaEmocoes from './pages/MapaEmocoes';
import ExploracaoSensorial from './pages/ExploracaoSensorial';
import CompareLugares from './pages/CompareLugares';
import Quiz from './pages/Quiz';
import Portfolio from './pages/Portfolio';
import Jogos from './pages/Jogos';
import { StorageService } from './services/storageService';
import { TeacherModeProvider } from './contexts/TeacherModeContext';
import type { Place } from './types';


function App() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Carregar lugares salvos
    const savedPlaces = StorageService.getPlaces();
    setPlaces(savedPlaces);

    // Monitorar conectividade
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handlePlaceAdded = (newPlace: Place) => {
    setPlaces(prev => [...prev, newPlace]);
  };

  const handlePlaceUpdated = (updatedPlace: Place) => {
    setPlaces(prev => prev.map(p => p.id === updatedPlace.id ? updatedPlace : p));
  };

  const handlePlaceDeleted = (placeId: string) => {
    setPlaces(prev => prev.filter(p => p.id !== placeId));
  };

  return (
    <TeacherModeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar isOnline={isOnline} />
          
          <div className="flex pt-16">
            <Sidebar />
            <MobileMenu />
            
            <main className="flex-1 lg:ml-64">
              <div className="w-full px-2 sm:px-4 py-4 sm:py-6">
            <Routes>
              <Route path="/" element={<Home places={places} />} />
              <Route 
                path="/meu-lugar" 
                element={
                  <MeuLugarFavorito 
                    onPlaceAdded={handlePlaceAdded}
                    onPlaceUpdated={handlePlaceUpdated}
                  />
                } 
              />
              <Route 
                path="/mapa" 
                element={
                  <MapaEmocoes 
                    places={places}
                    onPlaceDeleted={handlePlaceDeleted}
                  />
                } 
              />
              <Route path="/exploracao" element={<ExploracaoSensorial />} />
              <Route path="/compare" element={<CompareLugares />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/portfolio" element={<Portfolio places={places} />} />
              <Route path="/jogos" element={<Jogos places={places} />} />
            </Routes>
              </div>
            </main>
          </div>

          {/* Indicador de status offline */}
          {!isOnline && (
            <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg">
              <span className="text-sm">Modo Offline</span>
            </div>
          )}
        </div>
      </Router>
    </TeacherModeProvider>
  );
}

export default App;
