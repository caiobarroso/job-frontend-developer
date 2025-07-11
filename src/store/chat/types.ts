import type { ChatMessage, ChatStep, LeadScore, StepType } from "@/types/chat";

/* Tipo para filtros de conversa */
export type ConversationFilter = "all" | "active" | "completed";

/* ----------------------- CONVERSATION SHAPE ----------------------- */
export interface Conversation {
  currentStepId: StepType;
  messages: ChatMessage[];
  payload: Record<string, string>;
  leadScore: LeadScore;
  createdAt: string;
  updatedAt: string;
  completedSteps: StepType[];
}

/* ----------------------- STATE SHAPE ----------------------- */
export interface ChatState {
  steps: ChatStep[]; // fluxo estático
  currentConversationId: string; // ID da conversa ativa
  conversations: Record<string, Conversation>; // histórico de conversas
  conversationFilter: ConversationFilter; // filtro ativo

  /* --------- STREAMING STATE --------- */
  isStreaming: boolean;
  streamingText: string;
  streamingMessageId: string | null;

  /* --------- CONVERSATION MANAGEMENT --------- */
  createConversation: () => string;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  setConversationFilter: (filter: ConversationFilter) => void;

  /* --------- CHAT ACTIONS --------- */
  sendUserOption: (option: string) => void;
  nextBotMessage: () => void;
  startStreaming: (messageId: string, fullText: string) => void;
  stopStreaming: () => void;
  reset: () => void;
  updateLeadScore: () => void;

  /* --------- GETTERS --------- */
  getCurrentConversation: () => Conversation | undefined;
  getFilteredConversations: () => Record<string, Conversation>;
  getCurrentStep: () => ChatStep | undefined;
  getNextStepId: () => StepType | undefined;
}
