import React, { useState } from 'react';
import { useTeacherMode } from '../contexts/TeacherModeContext';
import { teacherTips, theoreticalReferences } from '../data/teacherData';
import type { TeacherTip } from '../types';

interface TeacherTipsProps {
  moduleId?: string;
}

const TeacherTips: React.FC<TeacherTipsProps> = ({ moduleId }) => {
  const { isTeacherMode } = useTeacherMode();
  const [selectedTip, setSelectedTip] = useState<TeacherTip | null>(null);
  const [showReferences, setShowReferences] = useState(false);

  if (!isTeacherMode) return null;

  const filteredTips = moduleId 
    ? teacherTips.filter(tip => tip.id === moduleId)
    : [];

  const handleTipClick = (tip: TeacherTip) => {
    setSelectedTip(tip);
  };

  const closeModal = () => {
    setSelectedTip(null);
  };

  return (
    <>
      {/* Dicas rápidas */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-purple-900 flex items-center">
            Dicas para professores
          </h3>
          <button
            onClick={() => setShowReferences(!showReferences)}
            className="text-sm text-purple-700 hover:text-purple-900 underline"
          >
            {showReferences ? 'Ocultar' : 'Ver'} fundamentação teórica
          </button>
        </div>

        {/* Fundamentação teórica */}
        {showReferences && (
          <div className="mb-4 p-4 bg-white rounded-lg border border-purple-100">
            <h4 className="font-medium text-purple-900 mb-3">Referencial Teórico</h4>
            <div className="space-y-3">
              {theoreticalReferences.map((ref, index) => (
                <div key={index} className="text-sm">
                  <div className="font-medium text-purple-800">{ref.author}</div>
                  <div className="text-purple-700 italic">"{ref.concept}"</div>
                  <div className="text-purple-600 mt-1">{ref.description}</div>
                  <div className="text-purple-600 mt-1">
                    <strong>Aplicação:</strong> {ref.application}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dicas específicas do módulo */}
        {filteredTips.length > 0 && (
          <div className="space-y-2">
            {filteredTips.map((tip) => (
              <button
                key={tip.id}
                onClick={() => handleTipClick(tip)}
                className="w-full text-left p-3 bg-white rounded-lg border border-purple-100 hover:border-purple-300 hover:shadow-sm transition-all duration-200"
              >
                <div className="font-medium text-purple-900">{tip.title}</div>
                <div className="text-sm text-purple-700 mt-1">{tip.description}</div>
                <div className="flex items-center space-x-4 mt-2 text-xs text-purple-600">
                  <span>{tip.ageGroup}</span>
                  <span>{tip.duration}</span>
                  <span>{tip.bnccAlignment.length} BNCC</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Dicas gerais se não há módulo específico */}
        {!moduleId && (
          <div className="space-y-4">
            <div className="text-sm text-purple-700">
              <p className="mb-2">
                <strong>Dica:</strong> Este app foi desenvolvido com base no referencial teórico de geografia humanística e didática da geografia.
              </p>
              <p className="mb-2">
                <strong>Objetivo:</strong> Conectar o conhecimento científico com a experiência vivida dos estudantes.
              </p>
              <p>
                <strong>Metodologia:</strong> Valorize o lugar como espaço vivido e promova aprendizagem significativa através da articulação professor-aluno-saber.
              </p>
            </div>
            
            {/* Link para folheto informativo */}
            <div className="mt-4 p-4 bg-white rounded-lg border-2 border-purple-300">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-purple-900 mb-1">Folheto Informativo</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    Baixe e imprima o folheto informativo para compartilhar com sua turma!
                  </p>
                  <a
                    href="https://drive.google.com/file/d/1Jnaa2m1bx5IeU6Fao7RJFZ9CRCtQlAEA/view?usp=share_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Baixar Folheto
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal com detalhes da dica */}
      {selectedTip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{selectedTip.title}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
                  <p className="text-gray-700">{selectedTip.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fundamentação teórica</h3>
                  <p className="text-gray-700">{selectedTip.theoreticalFoundation}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Passos práticos</h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700">
                    {selectedTip.practicalSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Alinhamento BNCC</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedTip.bnccAlignment.map((bncc, index) => (
                      <li key={index}>{bncc}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Faixa etária</h3>
                    <p className="text-gray-700">{selectedTip.ageGroup}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Duração</h3>
                    <p className="text-gray-700">{selectedTip.duration}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Materiais necessários</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedTip.materials.map((material, index) => (
                      <li key={index}>{material}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherTips;
