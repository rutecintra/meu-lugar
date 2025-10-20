import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { useTeacherMode } from '../contexts/TeacherModeContext';

interface HeaderProps {
  isOnline: boolean;
}

const Header: React.FC<HeaderProps> = ({ isOnline }) => {
  const location = useLocation();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isTeacherMode, toggleTeacherMode } = useTeacherMode();

  const navigation = [
    { 
      name: 'Início', 
      href: '/', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      name: 'Meu Lugar', 
      href: '/meu-lugar', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    { 
      name: 'Mapa', 
      href: '/mapa', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    },
    { 
      name: 'Sons', 
      href: '/exploracao', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      )
    },
    { 
      name: 'Compare', 
      href: '/compare', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    { 
      name: 'Quiz', 
      href: '/quiz', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      name: 'Jogos', 
      href: '/jogos', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      name: 'Portfólio', 
      href: '/portfolio', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
  ];

  const handleExport = () => {
    const data = StorageService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meu-lugar-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (StorageService.importData(content)) {
            alert('Dados importados com sucesso!');
            window.location.reload();
          } else {
            alert('Erro ao importar dados. Verifique o arquivo.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
    setShowExportMenu(false);
  };

  const handleClearData = () => {
    if (confirm('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.')) {
      StorageService.clearAllData();
      alert('Dados apagados com sucesso!');
      window.location.reload();
    }
    setShowExportMenu(false);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  // Fechar menu mobile quando a rota mudar
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo e título */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Fundo circular */}
                <circle cx="16" cy="16" r="15" fill="#0ea5e9" stroke="#0369a1" strokeWidth="2"/>
                
                {/* Casa */}
                <path d="M8 20V12L16 6L24 12V20H8Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5"/>
                
                {/* Telhado */}
                <path d="M6 12L16 4L26 12L24 10L16 6L8 10L6 12Z" fill="#dc2626" stroke="#b91c1c" strokeWidth="1.5"/>
                
                {/* Porta */}
                <rect x="13" y="16" width="6" height="4" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="1"/>
                
                {/* Janela */}
                <rect x="10" y="14" width="3" height="3" fill="#60a5fa" stroke="#3b82f6" strokeWidth="0.5"/>
                <rect x="19" y="14" width="3" height="3" fill="#60a5fa" stroke="#3b82f6" strokeWidth="0.5"/>
                
                {/* Localização (pino) */}
                <circle cx="16" cy="26" r="2" fill="#ef4444" stroke="#dc2626" strokeWidth="1"/>
                <path d="M16 24V22" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
                
                {/* Estrela */}
                <path d="M22 8L23.5 9.5L25 8L23.5 6.5L22 8Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5"/>
                <path d="M9 8L10.5 9.5L12 8L10.5 6.5L9 8Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Meu Lugar</h1>
              <p className="hidden md:block text-sm text-gray-600">Geografia para Crianças</p>
            </div>
          </Link>

          {/* Navegação principal */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Menu de ações e status */}
          <div className="flex items-center space-x-3">
            {/* Toggle Modo Docente */}
            <button
              onClick={toggleTeacherMode}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center ${
                isTeacherMode
                  ? 'bg-purple-100 text-purple-700 border border-purple-300'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              title={isTeacherMode ? 'Modo Docente Ativo' : 'Ativar Modo Docente'}
            >
              <span className="mr-2">
                {isTeacherMode ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </span>
              <span className="hidden sm:inline">
                {isTeacherMode ? 'Docente' : 'Estudante'}
              </span>
            </button>

            {/* Botão hambúrguer para mobile */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
              aria-label="Menu de navegação"
            >
              <svg
                className="w-6 h-6 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {showMobileMenu ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            {/* Status online/offline */}
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
              isOnline 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <span className="hidden sm:inline">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Menu de exportar/importar */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="btn-secondary text-sm"
              >
                Dados
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={handleExport}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Exportar
                  </button>
                  <button
                    onClick={handleImport}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Importar
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleClearData}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Limpar Dados
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu mobile hambúrguer */}
        <div className={`md:hidden fixed top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-200 transition-all duration-300 ease-in-out z-50 ${
          showMobileMenu ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}>
          <div className="py-4 px-4 rounded-b-2xl">
            <nav className="space-y-2">
              {navigation.map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 transform ${
                      isActive
                        ? 'bg-primary-100 text-primary-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:shadow-sm'
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: showMobileMenu ? 'slideInFromTop 0.3s ease-out forwards' : 'none'
                    }}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            {/* Separador */}
            <div className="border-t border-gray-200 my-4 mx-4"></div>
            
            {/* Toggle Modo Docente Mobile */}
            <div className="px-4 py-2">
              <button
                onClick={toggleTeacherMode}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                  isTeacherMode
                    ? 'bg-purple-100 text-purple-700 border border-purple-300'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                <span>
                  {isTeacherMode ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </span>
                <span>{isTeacherMode ? 'Modo Docente' : 'Modo Estudante'}</span>
              </button>
            </div>
            
            {/* Status online/offline mobile */}
            <div className="px-4 py-2">
              <div className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm shadow-sm ${
                isOnline 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
                <span className="font-medium">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay escuro para mobile */}
      {showMobileMenu && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeMobileMenu}
        />
      )}
    </header>
  );
};

export default Header;
