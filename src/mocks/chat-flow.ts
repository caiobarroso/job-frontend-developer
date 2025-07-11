import { ChatStep } from "@/types/chat";

export const chatFlow: ChatStep[] = [
  // ===== BOAS-VINDAS E INTRODUÇÃO =====
  {
    id: "welcome",
    message:
      "Olá! Eu sou Sofia, consultora sênior de growth digital da Dolado. 👋\n\nDesenvolvemos estratégias de marketplace que já geraram mais de R$ 500 milhões em GMV para nossos clientes. Em apenas 8 minutos, vou criar um diagnóstico personalizado mostrando como sua empresa pode acelerar o crescimento digital.\n\nPosso fazer algumas perguntas estratégicas para entender melhor seu cenário?",
    options: [
      "Sim, vamos começar o diagnóstico",
      "Primeiro, quero saber mais sobre a metodologia",
      "Qual o diferencial da Dolado?",
    ],
  },

  {
    id: "intro_more_info",
    message:
      "Perfeito! Nossa metodologia 'Growth Mapping' é baseada em 3 pilares:\n\n🎯 **Diagnóstico Estratégico** - Mapeamos seu modelo de negócio atual\n📊 **Análise de Oportunidades** - Identificamos os marketplaces mais lucrativos\n🚀 **Plano de Execução** - Criamos um roadmap personalizado\n\nJá aplicamos isso com +150 empresas, desde startups até corporações. Agora vamos personalizar para sua realidade?",
    options: [
      "Perfeito, vamos ao diagnóstico",
      "Quero ver alguns cases de sucesso primeiro",
    ],
  },

  // ===== QUALIFICAÇÃO DE EMPRESA =====
  {
    id: "company_size",
    message:
      "Vamos começar entendendo o porte da sua operação. Isso é fundamental para personalizar as recomendações:",
    options: [
      "Startup/Scale-up (até R$ 5M/ano)",
      "Empresa média (R$ 5M - R$ 50M/ano)",
      "Grande empresa (R$ 50M - R$ 200M/ano)",
      "Corporação (R$ 200M+/ano)",
      "Grupo/Holding com múltiplas empresas",
    ],
    scoring: {
      "Startup/Scale-up (até R$ 5M/ano)": 2,
      "Empresa média (R$ 5M - R$ 50M/ano)": 4,
      "Grande empresa (R$ 50M - R$ 200M/ano)": 7,
      "Corporação (R$ 200M+/ano)": 10,
      "Grupo/Holding com múltiplas empresas": 10,
    },
  },

  {
    id: "business_model",
    message:
      "Entendi! Agora me conta sobre o modelo de negócio. Cada modelo tem estratégias específicas de marketplace:",
    options: [
      "Indústria/Fabricante (B2B e B2C)",
      "Distribuidor/Atacadista",
      "Varejista tradicional",
      "E-commerce puro",
      "Marketplace/Plataforma",
      "Operação mista/híbrida",
      "Prestação de serviços",
    ],
    scoring: {
      "Indústria/Fabricante (B2B e B2C)": 8,
      "Distribuidor/Atacadista": 7,
      "Varejista tradicional": 6,
      "E-commerce puro": 5,
      "Marketplace/Plataforma": 4,
      "Operação mista/híbrida": 7,
      "Prestação de serviços": 3,
    },
  },

  // ===== ANÁLISE DE DESAFIOS ATUAIS =====
  {
    id: "current_challenges",
    message:
      "Qual o principal desafio que vocês enfrentam hoje para crescer? Entender isso me ajuda a priorizar as soluções:",
    options: [
      "Dependência excessiva de poucos canais",
      "Dificuldade para escalar vendas",
      "Concorrência predatória nos canais atuais",
      "Falta de visibilidade da marca",
      "Operação complexa/custosa",
      "Limitações tecnológicas",
      "Equipe sem expertise digital",
      "Conflitos com distribuidores/parceiros",
    ],
    scoring: {
      "Dependência excessiva de poucos canais": 8,
      "Dificuldade para escalar vendas": 9,
      "Concorrência predatória nos canais atuais": 7,
      "Falta de visibilidade da marca": 6,
      "Operação complexa/custosa": 5,
      "Limitações tecnológicas": 4,
      "Equipe sem expertise digital": 6,
      "Conflitos com distribuidores/parceiros": 3,
    },
  },

  // ===== PRESENÇA DIGITAL ATUAL =====
  {
    id: "market_presence",
    message:
      "Agora vamos mapear sua presença digital atual. Como vocês estão posicionados online?",
    options: [
      "Apenas site institucional",
      "E-commerce próprio básico",
      "E-commerce próprio avançado",
      "Presença em 1-2 marketplaces",
      "Omnichannel estruturado",
      "Focamos só no offline",
      "Temos presença digital mas não vendemos",
    ],
    scoring: {
      "Apenas site institucional": 3,
      "E-commerce próprio básico": 5,
      "E-commerce próprio avançado": 7,
      "Presença em 1-2 marketplaces": 6,
      "Omnichannel estruturado": 4,
      "Focamos só no offline": 8,
      "Temos presença digital mas não vendemos": 7,
    },
  },

  // ===== EXPERIÊNCIA COM MARKETPLACES =====
  {
    id: "marketplace_experience",
    message:
      "Qual a experiência prévia com marketplaces? Isso influencia muito nossa estratégia:",
    options: [
      "Nunca vendemos em marketplaces",
      "Testamos mas não deu certo",
      "Vendemos pouco em 1-2 marketplaces",
      "Temos operação ativa mas limitada",
      "Marketplaces são parte importante do negócio",
      "Temos operação sofisticada multicanal",
    ],
    scoring: {
      "Nunca vendemos em marketplaces": 8,
      "Testamos mas não deu certo": 6,
      "Vendemos pouco em 1-2 marketplaces": 7,
      "Temos operação ativa mas limitada": 5,
      "Marketplaces são parte importante do negócio": 3,
      "Temos operação sofisticada multicanal": 2,
    },
  },

  // ===== ESTRUTURA E DECISÃO =====
  {
    id: "stakeholder_buy_in",
    message:
      "Última pergunta estratégica: como funciona o processo de decisão para investimentos em crescimento digital?",
    options: [
      "Eu decido sozinho(a)",
      "Preciso convencer meu sócio/CEO",
      "Decisão conjunta com diretoria",
      "Comitê executivo decide",
      "Processo corporativo estruturado",
      "Ainda estou mapeando internamente",
    ],
    scoring: {
      "Eu decido sozinho(a)": 9,
      "Preciso convencer meu sócio/CEO": 7,
      "Decisão conjunta com diretoria": 6,
      "Comitê executivo decide": 5,
      "Processo corporativo estruturado": 4,
      "Ainda estou mapeando internamente": 3,
    },
  },

  // ===== DIAGNÓSTICO INTELIGENTE =====
  {
    id: "diagnosis",
    message:
      "Perfeito! Agora vou processar suas respostas e criar um diagnóstico personalizado...",
    options: [],
  },

  // ===== RESULTADO DINÂMICO COM DIAGNÓSTICO =====
  {
    id: "result_basic",
    message: "Baseado no seu perfil, aqui está seu diagnóstico personalizado:",
    options: ["Reiniciar diagnóstico", "Finalizar conversa"],
    diagnosis: {
      stage: "Oportunidade Foundational",
      tier: "basic",
      score: {
        total: 15,
        companySize: 3,
        marketFit: 5,
        budgetFit: 4,
        urgency: 3,
        authority: 5,
      },
      potential: "Potencial de R$ 2M-8M em GMV adicional nos próximos 12 meses",
      specificInsights: [
        "Perfil ideal para marketplaces de entrada (Mercado Livre, Shopee)",
        "Oportunidade de criar nova fonte de receita",
        "ROI esperado: 150-300% no primeiro ano",
        "Chance de validar produto-mercado fit digital",
      ],
      recommendations: [
        "Começar com 1-2 marketplaces principais",
        "Automação básica de gestão de produtos",
        "Pessoa dedicada meio período",
        "Integração simples com sistema atual",
        "Foco em produtos com maior margem",
      ],
      timeline: "Setup completo em 30 dias",
      investmentRange: "R$ 10k - R$ 30k setup + R$ 5k-20k/mês operação",
      roiProjection: "ROI de 200-350% no primeiro ano",
    },
  },

  {
    id: "result_advanced",
    message: "Baseado no seu perfil, aqui está seu diagnóstico personalizado:",
    options: ["Reiniciar diagnóstico", "Finalizar conversa"],
    diagnosis: {
      stage: "Oportunidade Growth Ready",
      tier: "advanced",
      score: {
        total: 25,
        companySize: 6,
        marketFit: 7,
        budgetFit: 6,
        urgency: 6,
        authority: 7,
      },
      potential:
        "Potencial de R$ 10M-30M em GMV adicional nos próximos 18 meses",
      specificInsights: [
        "Porte ideal para marketplaces principais (ML, Shopee, Amazon)",
        "Estrutura permite crescimento acelerado",
        "ROI esperado: 200-400% no primeiro ano",
        "Oportunidade de otimizar canais existentes",
      ],
      recommendations: [
        "Entrada em 3-5 marketplaces estratégicos",
        "Automação de pricing e inventory",
        "Equipe de 2-3 pessoas especializadas",
        "Integração com sistemas atuais",
        "Estratégia de brand building",
      ],
      timeline: "Setup completo em 60 dias",
      investmentRange: "R$ 50k - R$ 150k setup + R$ 20k-80k/mês operação",
      roiProjection: "ROI de 250-400% no primeiro ano",
    },
  },

  {
    id: "result_enterprise",
    message: "Baseado no seu perfil, aqui está seu diagnóstico personalizado:",
    options: ["Reiniciar diagnóstico", "Finalizar conversa"],
    diagnosis: {
      stage: "Oportunidade Premium Enterprise",
      tier: "enterprise",
      score: {
        total: 45,
        companySize: 10,
        marketFit: 9,
        budgetFit: 9,
        urgency: 8,
        authority: 9,
      },
      potential: "Potencial de R$ 50M+ em GMV adicional nos próximos 24 meses",
      specificInsights: [
        "Sua empresa tem perfil ideal para marketplaces premium (Amazon, B2W)",
        "Potencial para criar operação omnichannel sofisticada",
        "ROI esperado: 300-500% no primeiro ano",
        "Possibilidade de internacionalização via marketplaces globais",
      ],
      recommendations: [
        "Estratégia omnichannel com 5-8 marketplaces premium",
        "Automação completa de precificação e estoque",
        "Equipe dedicada de 3-5 pessoas",
        "Integração com ERP/WMS existente",
        "Programa de brand protection",
      ],
      timeline: "Setup completo em 90 dias",
      investmentRange: "R$ 150k - R$ 500k setup + R$ 50k-200k/mês operação",
      roiProjection: "ROI de 400-600% no primeiro ano",
    },
  },

  {
    id: "goodbye",
    message:
      "Foi um prazer falar com você! 🚀\n\nSeu diagnóstico personalizado está pronto. Qualquer dúvida sobre como implementar essas estratégias, é só me chamar aqui.\n\nSucesso na jornada de crescimento digital! 💪",
    options: ["Começar nova conversa"],
  },
];
