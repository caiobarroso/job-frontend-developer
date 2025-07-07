import { chatFlow } from "@/mocks/chat-flow";
import type { StepType, LeadScore } from "@/types/chat";
import type { ChatState, Conversation, ConversationFilter } from "./types";
import {
  generateConversationId,
  idxOf,
  calculateScore,
  determineLeadTier,
  checkCondition,
  nextIdFromRules,
} from "./utils";

type SetState = (
  state: Partial<ChatState> | ((state: ChatState) => Partial<ChatState>)
) => void;

/* --------- CONVERSATION MANAGEMENT --------- */
export const createConversation =
  (set: SetState, _get: () => ChatState) => (): string => {
    const newId = generateConversationId();
    const initialScore: LeadScore = {
      total: 0,
      companySize: 0,
      marketFit: 0,
      budgetFit: 0,
      urgency: 0,
      authority: 0,
    };

    // Encontra a primeira mensagem do fluxo
    const welcomeStep = chatFlow.find((step) => step.id === "welcome");
    const initialMessages = welcomeStep
      ? [
          {
            from: "bot" as const,
            text: welcomeStep.message,
            timestamp: new Date().toISOString(),
          },
        ]
      : [];

    const newConversation: Conversation = {
      currentStepId: "welcome",
      messages: initialMessages,
      payload: {},

      leadScore: initialScore,
      leadTier: "unqualified",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedSteps: [],
    };

    set((state) => ({
      conversations: {
        ...state.conversations,
        [newId]: newConversation,
      },
      currentConversationId: newId,
    }));

    return newId;
  };

export const selectConversation =
  (set: SetState, get: () => ChatState) =>
  (id: string): void => {
    const { conversations } = get();
    if (conversations[id]) {
      set({ currentConversationId: id });
    }
  };

export const deleteConversation =
  (set: SetState, get: () => ChatState) =>
  (id: string): void => {
    const { conversations, currentConversationId } = get();

    if (!conversations[id]) return;

    const remainingConversations = { ...conversations };
    delete remainingConversations[id];

    let newCurrentId = currentConversationId;

    // Se deletou a conversa ativa, precisa escolher outra
    if (currentConversationId === id) {
      const remainingIds = Object.keys(remainingConversations);
      if (remainingIds.length > 0) {
        newCurrentId = remainingIds[0];
      } else {
        // Não há mais conversas, cria uma nova
        newCurrentId = get().createConversation();
        return; // createConversation já atualiza o estado
      }
    }

    set({
      conversations: remainingConversations,
      currentConversationId: newCurrentId,
    });
  };

export const setConversationFilter =
  (set: SetState) =>
  (filter: ConversationFilter): void => {
    set({ conversationFilter: filter });
  };

/* --------- STREAMING ACTIONS --------- */
export const startStreaming =
  (set: SetState, get: () => ChatState) =>
  (messageId: string, fullText: string): void => {
    set({
      isStreaming: true,
      streamingText: "",
      streamingMessageId: messageId,
    });

    const words = fullText.split(" ");
    let currentIndex = 0;

    const streamNextWord = () => {
      if (currentIndex >= words.length) {
        // Streaming completo - commita a mensagem final
        const { currentConversationId, conversations } = get();
        const currentConv = conversations[currentConversationId];

        if (currentConv) {
          const updatedMessages = [...currentConv.messages];
          const lastMessageIndex = updatedMessages.length - 1;

          if (lastMessageIndex >= 0) {
            updatedMessages[lastMessageIndex] = {
              ...updatedMessages[lastMessageIndex],
              text: fullText,
            };
          }

          set({
            conversations: {
              ...conversations,
              [currentConversationId]: {
                ...currentConv,
                messages: updatedMessages,
                updatedAt: new Date().toISOString(),
              },
            },
            isStreaming: false,
            streamingText: "",
            streamingMessageId: null,
          });
        }
        return;
      }

      const currentText = words.slice(0, currentIndex + 1).join(" ");
      set({ streamingText: currentText });
      currentIndex++;

      // Velocidade: 150ms por palavra
      setTimeout(streamNextWord, 150);
    };

    // Inicia o streaming após pequeno delay
    setTimeout(streamNextWord, 3000);
  };

export const stopStreaming = (set: SetState) => (): void => {
  set({
    isStreaming: false,
    streamingText: "",
    streamingMessageId: null,
  });
};

/* --------- CHAT ACTIONS --------- */
export const sendUserOption =
  (set: SetState, get: () => ChatState) =>
  (option: string): void => {
    const { currentConversationId, conversations } = get();
    const currentConv = conversations[currentConversationId];

    if (!currentConv) return;

    // Lógica especial para opções nos passos de resultado
    if (
      currentConv.currentStepId === "result_basic" ||
      currentConv.currentStepId === "result_advanced" ||
      currentConv.currentStepId === "result_enterprise"
    ) {
      if (option === "Reiniciar diagnóstico") {
        get().reset();
        return;
      }

      if (option === "Finalizar conversa") {
        const updatedConversation = {
          ...currentConv,
          currentStepId: "goodbye" as StepType,
          messages: [
            ...currentConv.messages,
            {
              from: "user" as const,
              text: option,
              timestamp: new Date().toISOString(),
            },
          ],
          updatedAt: new Date().toISOString(),
        };

        set({
          conversations: {
            ...conversations,
            [currentConversationId]: updatedConversation,
          },
        });

        get().nextBotMessage();
        return;
      }
    }

    // Lógica especial para "Começar nova conversa" no goodbye
    if (
      currentConv.currentStepId === "goodbye" &&
      option === "Começar nova conversa"
    ) {
      get().createConversation();
      return;
    }

    const updatedConversation = {
      ...currentConv,
      payload: {
        ...currentConv.payload,
        [currentConv.currentStepId]: option,
      },
      messages: [
        ...currentConv.messages,
        {
          from: "user" as const,
          text: option,
          timestamp: new Date().toISOString(),
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    set({
      conversations: {
        ...conversations,
        [currentConversationId]: updatedConversation,
      },
    });

    // Atualiza pontuação e determina próximo passo
    get().updateLeadScore();
    get().nextBotMessage();
  };

export const updateLeadScore =
  (set: SetState, get: () => ChatState) => (): void => {
    const { currentConversationId, conversations, steps } = get();
    const currentConv = conversations[currentConversationId];

    if (!currentConv) return;

    const leadScore = calculateScore(currentConv.payload, steps);
    console.log("leadScore", leadScore);
    const leadTier = determineLeadTier(leadScore);

    set({
      conversations: {
        ...conversations,
        [currentConversationId]: {
          ...currentConv,
          leadScore,
          leadTier,
          updatedAt: new Date().toISOString(),
        },
      },
    });
  };

export const nextBotMessage =
  (set: SetState, get: () => ChatState) => (): void => {
    const { steps, currentConversationId, conversations } = get();
    const currentConv = conversations[currentConversationId];

    if (!currentConv) return;

    /* 🔄 Lógica especial para o passo de diagnóstico */
    if (currentConv.currentStepId === "diagnosis") {
      // Atualiza a pontuação primeiro
      get().updateLeadScore();

      // Delay para simular processamento e então avança automaticamente
      setTimeout(() => {
        const updatedConv = get().getCurrentConversation();
        if (updatedConv && updatedConv.currentStepId === "diagnosis") {
          const nextId = get().getNextStepId();
          if (nextId) {
            const nextStep = steps[idxOf(nextId)];
            const messageId = `msg_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 9)}`;

            set({
              conversations: {
                ...get().conversations,
                [currentConversationId]: {
                  ...updatedConv,
                  currentStepId: nextId,
                  completedSteps: [...updatedConv.completedSteps, "diagnosis"],
                  messages: [
                    ...updatedConv.messages,
                    {
                      from: "bot" as const,
                      text: "", // placeholder vazio
                      timestamp: new Date().toISOString(),
                    },
                  ],
                  updatedAt: new Date().toISOString(),
                },
              },
            });

            // Inicia o streaming para o resultado do diagnóstico
            get().startStreaming(messageId, nextStep.message);
          }
        }
      }, 2000);
      return;
    }

    if (currentConv.currentStepId === "goodbye") {
      const goodbyeStep = steps[idxOf("goodbye")];
      const messageId = `msg_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      set({
        conversations: {
          ...conversations,
          [currentConversationId]: {
            ...currentConv,
            messages: [
              ...currentConv.messages,
              {
                from: "bot" as const,
                text: "", // placeholder vazio
                timestamp: new Date().toISOString(),
              },
            ],
            updatedAt: new Date().toISOString(),
          },
        },
      });

      get().startStreaming(messageId, goodbyeStep.message);
      return;
    }

    const nextId = get().getNextStepId();
    if (!nextId) return; // fim de fluxo

    const nextStep = steps[idxOf(nextId)];

    if (nextStep.accessConditions) {
      const meetsConditions = nextStep.accessConditions.every((condition) =>
        checkCondition(condition, {
          ...currentConv.payload,
          totalScore: currentConv.leadScore.total,
        })
      );

      if (!meetsConditions) {
        const defaultNextId = nextIdFromRules(currentConv.currentStepId);
        if (defaultNextId) {
          const defaultNextStep = steps[idxOf(defaultNextId)];
          const messageId = `msg_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;

          set({
            conversations: {
              ...conversations,
              [currentConversationId]: {
                ...currentConv,
                currentStepId: defaultNextId,
                completedSteps: [
                  ...currentConv.completedSteps,
                  currentConv.currentStepId,
                ],
                messages: [
                  ...currentConv.messages,
                  {
                    from: "bot" as const,
                    text: "", // placeholder vazio
                    timestamp: new Date().toISOString(),
                  },
                ],
                updatedAt: new Date().toISOString(),
              },
            },
          });

          get().startStreaming(messageId, defaultNextStep.message);
        }
        return;
      }
    }

    const messageId = `msg_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    set({
      conversations: {
        ...conversations,
        [currentConversationId]: {
          ...currentConv,
          currentStepId: nextId,
          completedSteps: [
            ...currentConv.completedSteps,
            currentConv.currentStepId,
          ],
          messages: [
            ...currentConv.messages,
            {
              from: "bot" as const,
              text: "", // placeholder vazio
              timestamp: new Date().toISOString(),
            },
          ],
          updatedAt: new Date().toISOString(),
        },
      },
    });

    get().startStreaming(messageId, nextStep.message);

    if (nextId === "diagnosis") {
      get().nextBotMessage();
    }
  };

export const reset = (set: SetState, get: () => ChatState) => (): void => {
  const { currentConversationId, conversations } = get();
  const currentConv = conversations[currentConversationId];

  if (!currentConv) return;

  const initialScore: LeadScore = {
    total: 0,
    companySize: 0,
    marketFit: 0,
    budgetFit: 0,
    urgency: 0,
    authority: 0,
  };

  set({
    conversations: {
      ...conversations,
      [currentConversationId]: {
        ...currentConv,
        currentStepId: "welcome",
        messages: [],
        payload: {},
        leadScore: initialScore,
        leadTier: "unqualified",
        completedSteps: [],
        updatedAt: new Date().toISOString(),
      },
    },
  });
};

/* --------- GETTERS --------- */
export const getCurrentConversation =
  (get: () => ChatState) => (): Conversation | undefined => {
    const { currentConversationId, conversations } = get();
    return conversations[currentConversationId];
  };

export const getCurrentStep = (get: () => ChatState) => () => {
  const { steps } = get();
  const currentConv = getCurrentConversation(get)();
  if (!currentConv) return undefined;
  return steps[idxOf(currentConv.currentStepId)];
};

export const getNextStepId =
  (get: () => ChatState) => (): StepType | undefined => {
    const currentConv = getCurrentConversation(get)();
    if (!currentConv) return undefined;

    if (currentConv.currentStepId === "diagnosis") {
      if (currentConv.leadScore.total >= 40) return "result_enterprise";
      if (currentConv.leadScore.total >= 20) return "result_advanced";
      return "result_basic";
    }

    return nextIdFromRules(currentConv.currentStepId);
  };

export const getFilteredConversations =
  (get: () => ChatState) => (): Record<string, Conversation> => {
    const { conversations, conversationFilter } = get();

    if (conversationFilter === "all") {
      return conversations;
    }

    const filteredConversations: Record<string, Conversation> = {};

    for (const [id, conversation] of Object.entries(conversations)) {
      const isCompleted = conversation.currentStepId === "goodbye";
      const isActive = conversation.messages.length > 0 && !isCompleted;

      if (
        (conversationFilter === "active" && isActive) ||
        (conversationFilter === "completed" && isCompleted)
      ) {
        filteredConversations[id] = conversation;
      }
    }

    return filteredConversations;
  };
