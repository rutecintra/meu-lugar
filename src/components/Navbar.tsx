import { useState } from 'react';
import { StorageService } from '../services/storageService';
import { useTeacherMode } from '../contexts/TeacherModeContext';

interface NavbarProps {
  isOnline: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isOnline }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const { isTeacherMode, toggleTeacherMode } = useTeacherMode();

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

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          StorageService.importData(data);
          window.location.reload();
        } catch (error) {
          alert('Erro ao importar dados. Verifique se o arquivo está correto.');
        }
      };
      reader.readAsText(file);
    }
    setShowExportMenu(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-40">
      <div className="px-4 py-3">
        <div className="flex items-center justify-end">
          {/* Controles */}
          <div className="flex items-center space-x-4">
            {/* Status Online */}
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Modo Professor/Estudante */}
            <button
              onClick={toggleTeacherMode}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isTeacherMode
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span className="text-sm font-medium">
                {isTeacherMode ? 'Professor' : 'Estudante'}
              </span>
            </button>

            {/* Menu de Dados */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                <span className="text-sm font-medium">Dados</span>
              </button>

              {showExportMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    onClick={handleExport}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                  >
                    Exportar dados
                  </button>
                  <label className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 cursor-pointer block rounded-b-lg">
                    Importar dados
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
