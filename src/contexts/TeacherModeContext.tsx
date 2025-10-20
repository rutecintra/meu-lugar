import React, { createContext, useContext, useState, useEffect } from 'react';

interface TeacherModeContextType {
  isTeacherMode: boolean;
  toggleTeacherMode: () => void;
}

const TeacherModeContext = createContext<TeacherModeContextType | undefined>(undefined);

export const TeacherModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTeacherMode, setIsTeacherMode] = useState(() => {
    const saved = localStorage.getItem('teacherMode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('teacherMode', isTeacherMode.toString());
  }, [isTeacherMode]);

  const toggleTeacherMode = () => {
    setIsTeacherMode(prev => !prev);
  };

  return (
    <TeacherModeContext.Provider value={{ isTeacherMode, toggleTeacherMode }}>
      {children}
    </TeacherModeContext.Provider>
  );
};

export const useTeacherMode = () => {
  const context = useContext(TeacherModeContext);
  if (context === undefined) {
    throw new Error('useTeacherMode must be used within a TeacherModeProvider');
  }
  return context;
};
