import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { StorageService } from '../services/storageService';

interface HeaderProps {
  isOnline: boolean;
}

const Header: React.FC<HeaderProps> = ({ isOnline }) => {
  const location = useLocation();
  const [showExportMenu, setShowExportMenu] = useState(false);

  const navigation = [
    { name: 'Início', href: '/', icon: '🏠' },
    { name: 'Meu Lugar', href: '/meu-lugar', icon: '⭐' },
    { name: 'Mapa', href: '/mapa', icon: '🗺️' },
    { name: 'Sons', href: '/exploracao', icon: '🔊' },
    { name: 'Compare', href: '/compare', icon: '🔍' },
    { name: 'Quiz', href: '/quiz', icon: '❓' },
    { name: 'Portfólio', href: '/portfolio', icon: '📚' },
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

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo e título */}
          <div className="flex items-center space-x-3">
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
              <p className="text-sm text-gray-600">Geografia para Crianças</p>
            </div>
          </div>

          {/* Navegação principal */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
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
                📁 Dados
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={handleExport}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    📤 Exportar
                  </button>
                  <button
                    onClick={handleImport}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    📥 Importar
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleClearData}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    🗑️ Limpar Dados
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navegação mobile */}
        <div className="md:hidden py-4 border-t border-gray-200">
          <nav className="flex flex-wrap gap-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
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
        </div>
      </div>
    </header>
  );
};

export default Header;
