import type { BrazilianPlace, Sound, QuizQuestion, QuizResult } from '../types';

export const brazilianPlaces: BrazilianPlace[] = [
  {
    id: '1',
    name: 'Praia de Pajuçara - Maceió',
    type: 'Praia',
    description: 'Uma das praias mais bonitas de Maceió, com piscinas naturais e areia branca',
    imageUrl: 'https://i.ibb.co/Dgt2cpjJ/praiapajucara.jpg',
    region: 'Nordeste - Alagoas',
    characteristics: ['mar azul', 'areia branca', 'piscinas naturais', 'coqueiros', 'água cristalina']
  },
  {
    id: '2',
    name: 'Sertão de Alagoas',
    type: 'Sertão',
    description: 'Terra seca e quente do interior de Alagoas, com cactos e paisagem árida',
    imageUrl: 'https://i.ibb.co/Fkk4pgWJ/sertaoalagoas.jpg',
    region: 'Nordeste - Alagoas',
    characteristics: ['seco', 'quente', 'cactos', 'terra árida', 'sol forte']
  },
  {
    id: '3',
    name: 'Mata Atlântica - Maceió',
    type: 'Floresta',
    description: 'Floresta tropical costeira de Maceió, cheia de árvores e vida selvagem',
    imageUrl: 'https://i.ibb.co/svXmZq0w/mataatlantica.jpg',
    region: 'Nordeste - Alagoas',
    characteristics: ['muitas árvores', 'verde', 'úmido', 'pássaros', 'sombra fresca']
  },
  {
    id: '4',
    name: 'Lagoa Mundaú - Maceió',
    type: 'Lagoa',
    description: 'Lagoa de água doce em Maceió, perfeita para pesca e passeios de barco',
    imageUrl: 'https://i.ibb.co/TqDbTQs2/lagoamondau.jpg',
    region: 'Nordeste - Alagoas',
    characteristics: ['água doce', 'barcos', 'pesca', 'tranquilo', 'mangue']
  },
  {
    id: '5',
    name: 'Centro Histórico - Maceió',
    type: 'Cidade',
    description: 'Centro histórico de Maceió com prédios antigos, igrejas e cultura local',
    imageUrl: 'https://i.ibb.co/J8Bb7sY/centrohistorico.jpg',
    region: 'Nordeste - Alagoas',
    characteristics: ['prédios antigos', 'igrejas', 'cultura', 'história', 'tradição']
  },
  {
    id: '6',
    name: 'Pontal da Barra - Maceió',
    type: 'Pontal',
    description: 'Ponta de areia entre o mar e a lagoa, com vista deslumbrante do pôr do sol',
    imageUrl: 'https://i.ibb.co/cX1rJGDy/pontaldabarra.jpg',
    region: 'Nordeste - Alagoas',
    characteristics: ['pôr do sol', 'vista panorâmica', 'areia', 'mar', 'lagoa']
  },
  {
    id: '7',
    name: 'Serra da Barriga - Alagoas',
    type: 'Serra',
    description: 'Montanha histórica onde ficava o Quilombo dos Palmares, com vista para toda a região',
    imageUrl: 'https://i.ibb.co/tP3qTPd9/serradabarriga.jpg',
    region: 'Nordeste - Alagoas',
    characteristics: ['montanha', 'história', 'vista panorâmica', 'cultura', 'tradição']
  }
];

export const sounds: Sound[] = [
  {
    id: '1',
    name: 'Som do Mar',
    description: 'Ondas batendo na praia',
    audioUrl: '/sounds/mar.mp3',
    category: 'natureza'
  },
  {
    id: '2',
    name: 'Pássaros Cantando',
    description: 'Canto de diferentes pássaros',
    audioUrl: '/sounds/passaros.mp3',
    category: 'natureza'
  },
  {
    id: '3',
    name: 'Rua Movimentada',
    description: 'Carros, pessoas e movimento da cidade',
    audioUrl: '/sounds/rua.mp3',
    category: 'urbano'
  },
  {
    id: '4',
    name: 'Chuva',
    description: 'Som da chuva caindo',
    audioUrl: '/sounds/chuva.mp3',
    category: 'natureza'
  },
  {
    id: '5',
    name: 'Vento nas Folhas',
    description: 'Vento soprando nas árvores',
    audioUrl: '/sounds/vento.mp3',
    category: 'natureza'
  },
  {
    id: '6',
    name: 'Sinos da Igreja',
    description: 'Sinos tocando na igreja',
    audioUrl: '/sounds/sinos.mp3',
    category: 'urbano'
  }
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'Como você se sente quando está no seu lugar favorito?',
    options: ['Muito feliz e animado', 'Calmo e tranquilo', 'Curioso para explorar']
  },
  {
    id: '2',
    question: 'O que você mais gosta de fazer lá?',
    options: ['Ficar quieto e observar', 'Correr e brincar', 'Descobrir coisas novas']
  },
  {
    id: '3',
    question: 'Como é o som do seu lugar?',
    options: ['Muito barulhento', 'Silencioso e calmo', 'Uma mistura dos dois']
  },
  {
    id: '4',
    question: 'Que tipo de cheiro tem no seu lugar?',
    options: ['Cheiro de natureza', 'Cheiro da cidade', 'Diferentes cheiros']
  },
  {
    id: '5',
    question: 'Como você descreveria o seu lugar?',
    options: ['Um refúgio tranquilo', 'Um lugar para aventuras', 'Um lugar movimentado']
  },
  {
    id: '6',
    question: 'O que você faria se pudesse mudar algo no seu lugar?',
    options: ['Deixar mais tranquilo', 'Adicionar mais atividades', 'Manter como está']
  }
];

export const quizResults: QuizResult[] = [
  {
    type: 'aconchegante',
    description: 'Você gosta de lugares tranquilos e aconchegantes! Seu lugar é como um abraço quentinho.',
    suggestions: [
      'Observe as cores do seu lugar',
      'Preste atenção nos sons suaves',
      'Sinta a temperatura e o vento'
    ]
  },
  {
    type: 'explorador',
    description: 'Você é um explorador nato! Adora descobrir coisas novas no seu lugar.',
    suggestions: [
      'Explore cantos diferentes do seu lugar',
      'Observe como as coisas mudam ao longo do dia',
      'Descubra novos caminhos para chegar lá'
    ]
  },
  {
    type: 'movimentado',
    description: 'Você gosta de lugares cheios de vida e movimento! Seu lugar nunca para.',
    suggestions: [
      'Observe as pessoas que passam',
      'Preste atenção nos diferentes sons',
      'Veja como o movimento muda ao longo do dia'
    ]
  }
];

export const emotionColors = {
  alegria: '#fbbf24',
  calma: '#34d399',
  curiosidade: '#60a5fa',
  medo: '#f87171',
  saudade: '#a78bfa'
};

export const emotionLabels = {
  alegria: 'Alegria',
  calma: 'Calma',
  curiosidade: 'Curiosidade',
  medo: 'Medo',
  saudade: 'Saudade'
};
