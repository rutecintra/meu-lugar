# 🏠 Meu Lugar - Geografia para Crianças

Um site educativo offline-first que ajuda crianças a compreender o conceito de lugar em Geografia através do espaço vivido, memória afetiva e linguagem cartográfica inicial.

## 🎯 Visão & Objetivo

Criar uma ferramenta lúdica e educativa que permita às crianças:
- Identificar e pertencer ao seu lugar (meu lugar)
- Observar o espaço vivido (casa, rua, escola)
- Desenvolver linguagem cartográfica inicial (mapa, marcador, legenda, comparação)
- Comparar lugares sem hierarquizar (diferenças e semelhanças)

## 🚀 Stack Tecnológica

- **Frontend**: React + Vite + TypeScript
- **UI**: Tailwind CSS (design limpo e responsivo)
- **Mapas**: Leaflet + OpenStreetMap (sem chave de API)
- **Estado/Persistência**: localStorage (metadados) + IndexedDB (mídia)
- **Roteamento**: React Router
- **PWA/Offline**: Vite PWA plugin (Service Worker, cache)
- **A11y & i18n**: WCAG 2.1 AA + i18next (pt-BR por padrão)
- **Build/QA**: ESLint + Prettier + Vitest + React Testing Library

## 📱 Módulos do Produto

### 1. Meu Lugar Favorito ⭐
- Formulário para criar lugares especiais
- Captura de fotos e áudios
- Seleção de emoções e tags
- Geolocalização automática

### 2. Mapa das Emoções 🗺️
- Visualização interativa dos lugares
- Marcadores coloridos por emoção
- Filtros por emoção e tags
- Popups com informações detalhadas

### 3. Exploração Sensorial 🔊
- Biblioteca de sons ambientes
- Atividade de arrastar e soltar
- Feedback personalizado
- Sugestões para saídas de campo

### 4. Compare Lugares 🔍
- Galeria de lugares brasileiros
- Perguntas-guia para reflexão
- Comparação de semelhanças e diferenças
- Valorização da diversidade territorial

### 5. Quiz - Perfil do Meu Lugar ❓
- 6-7 perguntas sobre preferências
- Feedback lúdico personalizado
- Sugestões de observação
- Perfis: aconchegante, explorador, movimentado

### 6. Portfólio da Turma 📚
- Organização visual dos lugares criados
- Filtros e busca avançada
- Modos de visualização (grid/lista)
- Exportação para apresentações

## 🎓 Alinhamento Educativo

### Competências Desenvolvidas
- **Identidade e pertencimento**: Conexão emocional com o lugar
- **Observação espacial**: Desenvolvimento da percepção geográfica
- **Linguagem cartográfica**: Símbolos, cores, legendas
- **Comparação territorial**: Análise de diferenças e semelhanças

### BNCC - Geografia (EF anos iniciais)
- **EF02GE01**: Identificar e comparar diferentes tipos de lugar
- **EF02GE02**: Observar e descrever paisagens
- **EF02GE03**: Reconhecer símbolos cartográficos básicos

## 🏗️ Arquitetura de Dados

### Tipos Principais
```typescript
type Place = {
  id: string;
  title: string;
  lat: number; lng: number;
  emotion: "alegria"|"calma"|"curiosidade"|"medo"|"saudade";
  description: string;
  photoRef?: string;
  audioRef?: string;
  tags: string[];
  createdAt: string;
};

type StudentPortfolio = {
  studentAlias: string;
  places: Place[];
  quizResult?: string;
  createdAt: string;
  version: "1.0";
};
```

### Armazenamento
- **localStorage**: Metadados dos lugares e portfólio
- **IndexedDB**: Fotos e áudios (via idb-keyval)
- **Exportação/Importação**: JSON único com todos os dados

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clonar o repositório
git clone [url-do-repositorio]
cd meu-lugar

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

### Scripts Disponíveis
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview da build
- `npm run lint` - Verificação de código
- `npm run lint:fix` - Correção automática de código

## 🌐 Funcionalidades PWA

- **Instalação**: Pode ser instalado como app
- **Offline**: Funciona sem internet após primeiro acesso
- **Cache**: Assets e mapas são cacheados automaticamente
- **Atualizações**: Atualizações automáticas em background

## 🔒 Privacidade & Segurança

- **100% Offline**: Nenhum dado sai do dispositivo
- **Sem Login**: Não há coleta de dados pessoais
- **Exportação Manual**: Dados só saem quando explicitamente exportados
- **Sem Analytics**: Não há rastreamento de uso

## 📚 Dicas para Professores

### Atividades Sugeridas
1. **Saída de Campo**: Observação do bairro/escola
2. **Construção Coletiva**: Mapas emocionais da turma
3. **Feira de Lugares**: Apresentação dos lugares favoritos
4. **Comparação Territorial**: Análise de diferentes ambientes

### Extensões Pedagógicas
- Mapeamento emocional da escola
- Comparação de territórios urbanos e rurais
- Análise de mudanças sazonais
- Projetos de intervenção no espaço

## 🤝 Contribuição

### Estrutura do Projeto
```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas principais
├── services/      # Serviços (storage, API)
├── types/         # Definições TypeScript
├── data/          # Dados mockados
└── utils/         # Utilitários
```

### Padrões de Código
- TypeScript strict mode
- ESLint + Prettier
- Componentes funcionais com hooks
- Tailwind CSS para estilização
- Responsive-first design

## 📄 Licença

Este projeto é desenvolvido para fins educativos e está sob licença [MIT/CC-BY-SA].

## 🙏 Agradecimentos

- Professores e educadores que testaram o projeto
- Comunidade React e Vite
- OpenStreetMap pela disponibilização dos mapas
- Tailwind CSS pela framework de design

---

**Desenvolvido com ❤️ para a educação geográfica brasileira**
