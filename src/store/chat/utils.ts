import { chatFlow } from "@/mocks/chat-flow";
import type { ChatStep, LeadScore, StepType } from "@/types/chat";

/* Util — retorna o índice de um passo pelo id */
export const idxOf = (id: StepType) =>
  chatFlow.findIndex((step) => step.id === id);

/* Util — gera ID único para conversa */
export const generateConversationId = (): string => {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/* Util — calcula pontuação baseada nas respostas */
export const calculateScore = (
  payload: Record<string, string>,
  steps: ChatStep[]
): LeadScore => {
  let total = 0;
  let companySize = 0;
  let marketFit = 0;
  let budgetFit = 0;
  let urgency = 0;
  let authority = 0;

  // Mapeia campos para categorias de pontuação
  const fieldMapping: Record<string, keyof Omit<LeadScore, "total">> = {
    company_size: "companySize",
    business_model: "marketFit",
    current_challenges: "urgency",
    market_presence: "budgetFit",
    marketplace_experience: "budgetFit",
    stakeholder_buy_in: "authority",
  };

  for (const [field, value] of Object.entries(payload)) {
    const step = steps.find((s) => s.id === field);
    if (step?.scoring && step.scoring[value]) {
      const score = step.scoring[value];
      total += score;

      // Distribui pontuação por categoria
      const category = fieldMapping[field];
      if (category) {
        switch (category) {
          case "companySize":
            companySize = score;
            break;
          case "marketFit":
            marketFit = score;
            break;
          case "budgetFit":
            budgetFit += score;
            break;
          case "urgency":
            urgency = score;
            break;
          case "authority":
            authority = score;
            break;
        }
      }
    }
  }

  return {
    total,
    companySize,
    marketFit,
    budgetFit,
    urgency,
    authority,
  };
};

/* Util — determina o step de resultado baseado na pontuação */
export const getResultStepId = (score: number): StepType => {
  if (score >= 40) return "result_enterprise";
  if (score >= 20) return "result_advanced";
  return "result_basic";
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
    diagnosis: "result_basic",
    result_basic: "goodbye",
    result_advanced: "goodbye",
    result_enterprise: "goodbye",
    goodbye: undefined,
  };
  return map[current];
}
