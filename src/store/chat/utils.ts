import { chatFlow } from "@/mocks/chat-flow";
import type {
  ChatStep,
  StepType,
  LeadScore,
  LeadTier,
  NavigationCondition,
} from "@/types/chat";

/* Util — retorna o índice de um passo pelo id */
export const idxOf = (id: StepType) =>
  chatFlow.findIndex((step) => step.id === id);

/* Util — gera ID único para conversa */
export const generateConversationId = () =>
  `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/* Util — calcula pontuação baseada nas respostas */
export const calculateScore = (
  responses: Record<string, string>,
  steps: ChatStep[]
): LeadScore => {
  let total = 0;
  let companySize = 0;
  let marketFit = 0;
  let budgetFit = 0;
  let urgency = 0;
  let authority = 0;

  // Percorre todas as respostas e soma as pontuações
  Object.entries(responses).forEach(([stepId, response]) => {
    const step = steps.find((s) => s.id === stepId);
    if (step?.scoring && step.scoring[response]) {
      const score = step.scoring[response];
      total += score;

      // Categoriza a pontuação por tipo
      switch (stepId) {
        case "company_size":
          companySize = score;
          break;
        case "business_model":
        case "market_presence":
        case "marketplace_experience":
          marketFit += score;
          break;
        case "current_challenges":
          urgency += score;
          break;
        case "stakeholder_buy_in":
          authority = score;
          break;
        default:
          break;
      }
    }
  });

  // Normaliza as pontuações por categoria
  marketFit = Math.min(marketFit, 10);
  budgetFit = Math.min(
    responses.budget_range ? parseInt(responses.budget_range) || 0 : 0,
    10
  );

  return {
    total,
    companySize,
    marketFit,
    budgetFit,
    urgency,
    authority,
  };
};

/* Util — determina o tier do lead baseado na pontuação */
export const determineLeadTier = (score: LeadScore): LeadTier => {
  if (score.total >= 40) return "enterprise";
  if (score.total >= 20) return "advanced";
  if (score.total >= 10) return "basic";
  return "unqualified";
};

/* Util — verifica se uma condição é atendida */
export const checkCondition = (
  condition: NavigationCondition,
  data: Record<string, string | number>
): boolean => {
  const fieldValue = data[condition.field];

  switch (condition.operator) {
    case "equals":
      return fieldValue === condition.value;
    case "contains":
      return String(fieldValue).includes(String(condition.value));
    case "greater_than":
      return Number(fieldValue) > Number(condition.value);
    case "less_than":
      return Number(fieldValue) < Number(condition.value);
    case "in":
      return (
        Array.isArray(condition.value) &&
        condition.value.includes(String(fieldValue))
      );
    default:
      return false;
  }
};

/* ----------------- TABELA CENTRAL DE NAVEGAÇÃO -------------- */
export function nextIdFromRules(current: StepType): StepType | undefined {
  const map: Record<StepType, StepType | undefined> = {
    welcome: "company_size",
    intro_more_info: "company_size",
    company_size: "business_model",
    business_model: "current_challenges",
    current_challenges: "market_presence",
    market_presence: "marketplace_experience",
    marketplace_experience: "stakeholder_buy_in",
    stakeholder_buy_in: "diagnosis",
    diagnosis: "result_basic", // será sobrescrito pela lógica de pontuação
    result_basic: "goodbye",
    result_advanced: "goodbye",
    result_enterprise: "goodbye",
    goodbye: undefined,
    // Fluxo simplificado - alguns passos não são usados no fluxo principal
    revenue_range: "team_structure",
    team_structure: "technology_stack",
    technology_stack: "marketplace_experience",
    competitive_analysis: "growth_goals",
    growth_goals: "budget_range",
    budget_range: "decision_timeline",
    decision_timeline: "stakeholder_buy_in",
  };
  return map[current];
}
