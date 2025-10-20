export type Emotion = "alegria" | "calma" | "curiosidade" | "medo" | "saudade";

export interface Place {
  id: string;
  title: string;
  lat: number;
  lng: number;
  emotion: Emotion;
  description: string;
  photoRef?: string;
  audioRef?: string;
  tags: string[];
  createdAt: string;
}

export interface StudentPortfolio {
  studentAlias: string;
  places: Place[];
  quizResult?: string;
  createdAt: string;
  version: "1.0";
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: string;
}

export interface QuizResult {
  type: "aconchegante" | "explorador" | "movimentado";
  description: string;
  suggestions: string[];
}

export interface BrazilianPlace {
  id: string;
  name: string;
  type: string;
  description: string;
  imageUrl: string;
  region: string;
  characteristics: string[];
}

export interface Sound {
  id: string;
  name: string;
  description: string;
  audioUrl: string;
  category: string;
}

export interface TeacherTip {
  id: string;
  title: string;
  description: string;
  theoreticalFoundation: string;
  practicalSteps: string[];
  bnccAlignment: string[];
  ageGroup: string;
  duration: string;
  materials: string[];
}

export interface TheoreticalReference {
  author: string;
  concept: string;
  description: string;
  application: string;
}
