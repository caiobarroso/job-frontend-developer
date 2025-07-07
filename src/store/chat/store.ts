import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { chatFlow } from "@/mocks/chat-flow";
import type { ChatState } from "./types";
import {
  createConversation,
  selectConversation,
  deleteConversation,
  setConversationFilter,
  sendUserOption,
  nextBotMessage,
  startStreaming,
  stopStreaming,
  reset,
  updateLeadScore,
  getCurrentConversation,
  getFilteredConversations,
  getCurrentStep,
  getNextStepId,
} from "./actions";

/* ----------------------- STORE ----------------------------- */
export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set, get) => ({
        steps: chatFlow,
        currentConversationId: "",
        conversations: {},
        conversationFilter: "all",

        /* --------- STREAMING STATE --------- */
        isStreaming: false,
        streamingText: "",
        streamingMessageId: null,

        /* --------- CONVERSATION MANAGEMENT --------- */
        createConversation: createConversation(set, get),
        selectConversation: selectConversation(set, get),
        deleteConversation: deleteConversation(set, get),
        setConversationFilter: setConversationFilter(set),

        /* --------- CHAT ACTIONS --------- */
        sendUserOption: sendUserOption(set, get),
        nextBotMessage: nextBotMessage(set, get),
        startStreaming: startStreaming(set, get),
        stopStreaming: stopStreaming(set),
        reset: reset(set, get),
        updateLeadScore: updateLeadScore(set, get),

        /* --------- GETTERS --------- */
        getCurrentConversation: getCurrentConversation(get),
        getFilteredConversations: getFilteredConversations(get),
        getCurrentStep: getCurrentStep(get),
        getNextStepId: getNextStepId(get),
      }),
      {
        name: "dolado-chat",
        // Inicialização: se não há conversas, cria uma automaticamente
        onRehydrateStorage: () => (state) => {
          if (state && Object.keys(state.conversations).length === 0) {
            state.createConversation();
          }
        },
      }
    )
  )
);
