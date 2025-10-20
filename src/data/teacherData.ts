import type { TeacherTip, TheoreticalReference } from '../types';

export const theoreticalReferences: TheoreticalReference[] = [
  {
    author: "Libâneo (2006)",
    concept: "Sala de aula como coração do sistema educacional",
    description: "A sala de aula é o espaço onde os conhecimentos são absorvidos e os alunos aprimoram suas habilidades. É fundamental considerar os aspectos pedagógico-didáticos da sala de aula nas políticas educacionais.",
    application: "Use este app como ferramenta pedagógica que conecta o conhecimento científico com a experiência vivida dos estudantes, promovendo aprendizagem significativa."
  },
  {
    author: "Moraes (2019)",
    concept: "Geografia contextualizada e pensamento científico",
    description: "Promover conhecimento científico não significa apenas ensinar a raciocinar cientificamente. É necessário trabalhar habilidades ligadas ao raciocínio, curiosidade e pensamento científico.",
    application: "As atividades do app desenvolvem habilidades de observação, comparação e análise geográfica através da exploração do lugar vivido pelos estudantes."
  },
  {
    author: "Merenne-Schoumaker (1999)",
    concept: "Triângulo didático",
    description: "A didática da geografia articula professor, aluno e saber, promovendo um saber que desenvolve a forma como os estudantes aprendem e se motivam, rejeitando um saber enciclopédico.",
    application: "O app facilita a articulação entre professor e aluno através de atividades interativas que valorizam o conhecimento prévio e a experiência dos estudantes."
  },
  {
    author: "Cavalcanti (1998)",
    concept: "Lugar como espaço vivido",
    description: "O lugar é o espaço que se torna familiar ao indivíduo, é o espaço vivido e experienciado. Possui significados marcados pelas experiências, memórias e relações afetivas.",
    application: "Cada funcionalidade do app valoriza o lugar vivido pelos estudantes, permitindo que expressem suas experiências, emoções e memórias associadas aos lugares."
  }
];

export const teacherTips: TeacherTip[] = [
  {
    id: "meu-lugar-favorito",
    title: "Meu lugar favorito - construção de identidade espacial",
    description: "Atividade que permite aos estudantes criarem e salvarem seu lugar especial com fotos, áudios e emoções.",
    theoreticalFoundation: "Baseado em Cavalcanti (1998), esta atividade valoriza o lugar como espaço vivido e experienciado, onde os estudantes podem expressar suas relações afetivas e memórias.",
    practicalSteps: [
      "Oriente os estudantes a escolherem um lugar que tenha significado especial para eles",
      "Peça para fotografarem o lugar ou desenharem se não tiverem acesso à câmera",
      "Estimule a gravação de áudios descrevendo sons característicos do lugar",
      "Trabalhe as emoções associadas ao lugar através de conversas em grupo",
      "Conecte as experiências pessoais com conceitos geográficos (paisagem, território, lugar)"
    ],
    bnccAlignment: [
      "EF02GE01 - Identificar e comparar diferentes tipos de lugar",
      "EF02GE02 - Observar e descrever paisagens",
      "EF02GE03 - Reconhecer símbolos cartográficos básicos"
    ],
    ageGroup: "6-10 anos",
    duration: "2-3 aulas",
    materials: ["Dispositivos móveis", "Papel e lápis", "Mapas da região"]
  },
  {
    id: "mapa-emocoes",
    title: "Mapa das emoções - geografia afetiva",
    description: "Visualização de todos os lugares em um mapa colorido por emoção, desenvolvendo a geografia afetiva.",
    theoreticalFoundation: "Inspirado em Libâneo (2006), esta atividade conecta aspectos pedagógico-didáticos com a experiência emocional dos estudantes, promovendo aprendizagem significativa.",
    practicalSteps: [
      "Apresente o conceito de geografia afetiva aos estudantes",
      "Analise coletivamente os mapas criados pelos estudantes",
      "Identifique padrões emocionais nos lugares da turma",
      "Conecte as emoções com características físicas e sociais dos lugares",
      "Desenvolva atividades de comparação entre diferentes lugares"
    ],
    bnccAlignment: [
      "EF02GE01 - Identificar e comparar diferentes tipos de lugar",
      "EF02GE02 - Observar e descrever paisagens",
      "EF02GE04 - Comparar diferentes paisagens"
    ],
    ageGroup: "6-10 anos",
    duration: "1-2 aulas",
    materials: ["Mapas impressos", "Cores", "Papel para registro"]
  },
  {
    id: "exploracao-sensorial",
    title: "Exploração sensorial - percepção geográfica",
    description: "Exploração de sons e descoberta de qual combina com o lugar, desenvolvendo a percepção geográfica.",
    theoreticalFoundation: "Baseado em Moraes (2019), esta atividade desenvolve habilidades de observação e pensamento científico através da percepção sensorial do espaço.",
    practicalSteps: [
      "Realize uma saída de campo para observação sensorial",
      "Peça para os estudantes registrarem sons característicos",
      "Trabalhe a relação entre sons e características do lugar",
      "Desenvolva atividades de identificação de sons em diferentes ambientes",
      "Conecte a percepção sensorial com conceitos de paisagem"
    ],
    bnccAlignment: [
      "EF02GE02 - Observar e descrever paisagens",
      "EF02GE03 - Reconhecer símbolos cartográficos básicos"
    ],
    ageGroup: "6-10 anos",
    duration: "2-3 aulas",
    materials: ["Gravador de áudio", "Mapas", "Caderno de campo"]
  },
  {
    id: "compare-lugares",
    title: "Compare lugares - análise comparativa",
    description: "Comparação do lugar do estudante com diferentes lugares do Brasil, desenvolvendo habilidades de análise geográfica.",
    theoreticalFoundation: "Inspirado em Merenne-Schoumaker (1999), esta atividade promove o desenvolvimento de habilidades de análise e comparação, rejeitando o saber enciclopédico.",
    practicalSteps: [
      "Apresente diferentes lugares do Brasil com características diversas",
      "Oriente a comparação sistemática entre lugares",
      "Trabalhe conceitos de diversidade geográfica brasileira",
      "Desenvolva atividades de identificação de semelhanças e diferenças",
      "Conecte as comparações com conceitos de região e território"
    ],
    bnccAlignment: [
      "EF02GE01 - Identificar e comparar diferentes tipos de lugar",
      "EF02GE04 - Comparar diferentes paisagens",
      "EF02GE05 - Reconhecer a diversidade do território brasileiro"
    ],
    ageGroup: "6-10 anos",
    duration: "3-4 aulas",
    materials: ["Mapas do Brasil", "Imagens de lugares", "Material de pesquisa"]
  },
  {
    id: "quiz-perfil",
    title: "Quiz - perfil do meu lugar - autoconhecimento geográfico",
    description: "Descoberta do tipo de lugar que o estudante gosta mais, desenvolvendo autoconhecimento geográfico.",
    theoreticalFoundation: "Baseado em Cavalcanti (1998), esta atividade valoriza a relação afetiva do estudante com diferentes tipos de lugar, promovendo autoconhecimento espacial.",
    practicalSteps: [
      "Apresente diferentes tipos de lugares e suas características",
      "Oriente a reflexão sobre preferências pessoais",
      "Trabalhe conceitos de identidade e pertencimento",
      "Desenvolva atividades de autoconhecimento geográfico",
      "Conecte as preferências com características dos lugares"
    ],
    bnccAlignment: [
      "EF02GE01 - Identificar e comparar diferentes tipos de lugar",
      "EF02GE02 - Observar e descrever paisagens"
    ],
    ageGroup: "6-10 anos",
    duration: "1-2 aulas",
    materials: ["Questionários", "Material de reflexão", "Papel para registro"]
  },
  {
    id: "jogos-educativos",
    title: "Jogos educativos - aprendizagem lúdica",
    description: "Aprendizagem de geografia de forma divertida através de jogos, promovendo engajamento e motivação.",
    theoreticalFoundation: "Inspirado em Libâneo (2006), os jogos promovem engajamento e motivação, elementos essenciais para a qualidade da educação na sala de aula.",
    practicalSteps: [
      "Apresente os jogos como ferramentas de aprendizagem",
      "Oriente o uso dos jogos de forma pedagógica",
      "Conecte os jogos com conceitos geográficos trabalhados",
      "Desenvolva atividades de reflexão sobre o aprendizado",
      "Use os jogos como avaliação formativa"
    ],
    bnccAlignment: [
      "EF02GE01 - Identificar e comparar diferentes tipos de lugar",
      "EF02GE02 - Observar e descrever paisagens",
      "EF02GE03 - Reconhecer símbolos cartográficos básicos"
    ],
    ageGroup: "6-10 anos",
    duration: "1-2 aulas",
    materials: ["Dispositivos móveis", "Material de apoio", "Registro de atividades"]
  },
  {
    id: "portfolio-turma",
    title: "Portfólio da turma - construção coletiva",
    description: "Visualização de todos os lugares organizados em um portfólio, promovendo construção coletiva do conhecimento.",
    theoreticalFoundation: "Baseado em Merenne-Schoumaker (1999), o portfólio promove a articulação entre professor e aluno, facilitando a construção coletiva do conhecimento.",
    practicalSteps: [
      "Organize uma apresentação coletiva dos portfólios",
      "Promova discussões sobre a diversidade de lugares",
      "Trabalhe conceitos de coletividade e diversidade",
      "Desenvolva atividades de síntese e reflexão",
      "Use o portfólio como avaliação formativa"
    ],
    bnccAlignment: [
      "EF02GE01 - Identificar e comparar diferentes tipos de lugar",
      "EF02GE04 - Comparar diferentes paisagens",
      "EF02GE05 - Reconhecer a diversidade do território brasileiro"
    ],
    ageGroup: "6-10 anos",
    duration: "2-3 aulas",
    materials: ["Material de apresentação", "Papel para síntese", "Registro coletivo"]
  }
];
