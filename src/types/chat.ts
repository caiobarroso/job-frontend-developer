/* ------------------------------------------------------------------
   Modelagem central de tipos do chatbot - Versão Profissional
-------------------------------------------------------------------*/

/** Todas as etapas possíveis do fluxo expandido */
export type StepType =
  | "welcome"
  | "intro_more_info"
  | "company_size"
  | "business_model"
  | "current_challenges"
  | "market_presence"
  | "revenue_range"
  | "team_structure"
  | "technology_stack"
  | "marketplace_experience"
  | "competitive_analysis"
  | "growth_goals"
  | "budget_range"
  | "decision_timeline"
  | "stakeholder_buy_in"
  | "diagnosis"
  | "result_basic"
  | "result_advanced"
  | "result_enterprise"
  | "goodbye";

/** Mensagem do usuário ou do bot */
export interface ChatMessage {
  from: "bot" | "user";
  text: string;
  timestamp?: string;
  metadata?: Record<string, string | number | boolean>;
}

/** Sistema de pontuação para qualificação de leads */
export interface LeadScore {
  total: number;
  companySize: number;
  marketFit: number;
  budgetFit: number;
  urgency: number;
  authority: number;
}

/** Níveis de qualificação do lead */
export type LeadTier = "enterprise" | "advanced" | "basic" | "unqualified";

/** Condições para navegação condicional */
export interface NavigationCondition {
  field: string;
  operator: "equals" | "contains" | "greater_than" | "less_than" | "in";
  value: string | number | string[];
}

/** Análise de diagnóstico expandida */
export interface DiagnosisBlock {
  stage: string;
  tier: LeadTier;
  score: LeadScore;
  potential: string;
  specificInsights: string[];
  recommendations: string[];
  riskFactors?: string[];
  timeline?: string;
  investmentRange?: string;
  roiProjection?: string;
}

/** Próximos passos personalizados */
export interface NextStepsBlock {
  message: string;
  options: string[];
  urgency: "high" | "medium" | "low";
}

/** Configuração de segmentação */
export interface SegmentConfig {
  name: string;
  criteria: NavigationCondition[];
  nextStep: StepType;
  priority: number;
}

/** Estrutura base de cada etapa do fluxo */
export interface ChatStep {
  id: StepType;
  message: string;
  options?: string[];
  diagnosis?: DiagnosisBlock;
  nextSteps?: NextStepsBlock;
  segments?: SegmentConfig[];
  scoring?: Record<string, number>;
  accessConditions?: NavigationCondition[];
  estimatedTime?: number;
  tags?: string[];
}
