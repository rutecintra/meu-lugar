import type { BrazilianPlace, Sound, QuizQuestion, QuizResult } from '../types';

export const brazilianPlaces: BrazilianPlace[] = [
  {
    id: '1',
    name: 'Praia de Copacabana',
    type: 'Praia',
    description: 'Uma das praias mais famosas do mundo, com areia dourada e mar azul',
    imageUrl: '/images/places/praia.jpg',
    region: 'Sudeste',
    characteristics: ['mar', 'areia', 'sol', 'água salgada', 'conchas']
  },
  {
    id: '2',
    name: 'Sertão Nordestino',
    type: 'Sertão',
    description: 'Terra seca e quente, com cactos e paisagem árida',
    imageUrl: '/images/places/sertao.jpg',
    region: 'Nordeste',
    characteristics: ['seco', 'quente', 'cactos', 'terra árida', 'sol forte']
  },
  {
    id: '3',
    name: 'Floresta Amazônica',
    type: 'Floresta',
    description: 'A maior floresta tropical do mundo, cheia de árvores e animais',
    imageUrl: '/images/places/floresta.jpg',
    region: 'Norte',
    characteristics: ['muitas árvores', 'verde', 'úmido', 'animais', 'rio']
  },
  {
    id: '4',
    name: 'Fazenda no Campo',
    type: 'Campo',
    description: 'Terra fértil para plantar alimentos, com animais e plantações',
    imageUrl: '/images/places/campo.jpg',
    region: 'Centro-Oeste',
    characteristics: ['terra fértil', 'plantações', 'animais', 'ar puro', 'tranquilo']
  },
  {
    id: '5',
    name: 'Centro da Cidade',
    type: 'Cidade',
    description: 'Lugar movimentado com prédios altos, carros e muitas pessoas',
    imageUrl: '/images/places/cidade.jpg',
    region: 'Sudeste',
    characteristics: ['prédios', 'carros', 'muitas pessoas', 'movimentado', 'barulho']
  },
  {
    id: '6',
    name: 'Comunidade Quilombola',
    type: 'Quilombo',
    description: 'Comunidade com história rica, tradições e cultura afro-brasileira',
    imageUrl: '/images/places/quilombo.jpg',
    region: 'Diversas',
    characteristics: ['tradições', 'cultura', 'história', 'comunidade', 'raízes']
  },
  {
    id: '7',
    name: 'Vila Ribeirinha',
    type: 'Ribeirinho',
    description: 'Comunidade à beira do rio, vivendo da pesca e transporte fluvial',
    imageUrl: '/images/places/ribeirinho.jpg',
    region: 'Norte',
    characteristics: ['rio', 'barcos', 'pesca', 'água doce', 'tranquilo']
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
