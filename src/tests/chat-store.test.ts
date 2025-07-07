import { describe, it, expect, beforeEach, vi } from "vitest";
import { useChatStore } from "@/store/chat/store";
import { chatFlow } from "@/mocks/chat-flow";

vi.mock("@/mocks/chat-flow", () => ({
  chatFlow: [
    { id: "welcome", message: "Welcome!" },
    {
      id: "company_size",
      message: "Company Size",
      options: ["Small", "Medium", "Large"],
    },
    {
      id: "business_model",
      message: "Business Model",
      options: ["B2B", "B2C"],
    },
    {
      id: "current_challenges",
      message: "Current Challenges",
      options: ["Challenge 1", "Challenge 2"],
    },
    {
      id: "market_presence",
      message: "Market Presence",
      options: ["Option 1", "Option 2"],
    },
    {
      id: "marketplace_experience",
      message: "Marketplace Experience",
      options: ["No experience", "Some experience"],
    },
    {
      id: "stakeholder_buy_in",
      message: "Stakeholder Buy-in",
      options: ["Self decision", "Need approval"],
    },
    { id: "diagnosis", message: "Diagnosis in progress..." },
    {
      id: "result_basic",
      message: "Basic Result",
      options: ["Reiniciar diagnóstico", "Finalizar conversa"],
    },
    {
      id: "result_advanced",
      message: "Advanced Result",
      options: ["Reiniciar diagnóstico", "Finalizar conversa"],
    },
    {
      id: "result_enterprise",
      message: "Enterprise Result",
      options: ["Reiniciar diagnóstico", "Finalizar conversa"],
    },
    { id: "goodbye", message: "Goodbye!" },
  ],
}));

describe("useChatStore", () => {
  beforeEach(() => {
    useChatStore.setState({
      steps: chatFlow,
      currentConversationId: "",
      conversations: {},
      conversationFilter: "all",
      isStreaming: false,
      streamingText: "",
      streamingMessageId: null,
    });
  });

  describe("Conversation Management", () => {
    it("creates conversation with correct initial state", () => {
      const { createConversation } = useChatStore.getState();

      const id = createConversation();
      const { conversations } = useChatStore.getState();

      expect(id).toMatch(/^conv_\d+_[a-z0-9]+$/);
      expect(conversations[id]).toEqual({
        currentStepId: "welcome",
        messages: [
          {
            from: "bot",
            text: "Welcome!",
            timestamp: expect.any(String),
          },
        ],
        payload: {},
        leadScore: {
          total: 0,
          companySize: 0,
          marketFit: 0,
          budgetFit: 0,
          urgency: 0,
          authority: 0,
        },
        leadTier: "unqualified",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        completedSteps: [],
      });
    });

    it("switches between conversations", () => {
      const { createConversation, selectConversation } =
        useChatStore.getState();

      const id1 = createConversation();

      selectConversation(id1);
      expect(useChatStore.getState().currentConversationId).toBe(id1);
    });

    it("deletes conversation and selects fallback", () => {
      const { createConversation, deleteConversation } =
        useChatStore.getState();

      const id1 = createConversation();
      const id2 = createConversation();

      deleteConversation(id1);

      expect(useChatStore.getState().conversations[id1]).toBeUndefined();
      expect(useChatStore.getState().currentConversationId).toBe(id2);
    });
  });

  describe("Chat Flow", () => {
    it("sends user option and advances flow", () => {
      const { createConversation, sendUserOption } = useChatStore.getState();

      const id = createConversation();
      sendUserOption("Yes");

      const conversation = useChatStore.getState().conversations[id];
      expect(conversation.messages).toHaveLength(3); // bot message + user message + bot response
      expect(conversation.messages[1]).toEqual({
        from: "user",
        text: "Yes",
        timestamp: expect.any(String),
      });
      // The bot message is created with empty text initially due to streaming
      expect(conversation.messages[2]).toEqual({
        from: "bot",
        text: "", // Initially empty due to streaming
        timestamp: expect.any(String),
      });
      expect(conversation.currentStepId).toBe("company_size");
    });
  });

  describe("State Management", () => {
    it("resets conversation state", () => {
      const { createConversation, sendUserOption, reset } =
        useChatStore.getState();

      const id = createConversation();
      sendUserOption("Test");

      reset();

      const conversation = useChatStore.getState().conversations[id];
      expect(conversation.currentStepId).toBe("welcome");
      expect(conversation.messages).toHaveLength(0); // Reset clears all messages
      expect(conversation.payload).toEqual({});
      expect(conversation.completedSteps).toEqual([]);
    });

    it("handles non-existent conversation gracefully", () => {
      useChatStore.setState({ currentConversationId: "invalid-id" });

      const { sendUserOption, nextBotMessage, reset } = useChatStore.getState();

      expect(() => sendUserOption("test")).not.toThrow();
      expect(() => nextBotMessage()).not.toThrow();
      expect(() => reset()).not.toThrow();
    });
  });

  describe("Getters", () => {
    it("gets current conversation", () => {
      const { createConversation, getCurrentConversation } =
        useChatStore.getState();

      createConversation();
      const conversation = getCurrentConversation();

      expect(conversation).toBeDefined();
      expect(conversation?.currentStepId).toBe("welcome");
    });

    it("returns undefined for non-existent conversation", () => {
      const { getCurrentConversation } = useChatStore.getState();
      useChatStore.setState({ currentConversationId: "invalid-id" });

      const conversation = getCurrentConversation();
      expect(conversation).toBeUndefined();
    });
  });

  describe("Conversation Filtering", () => {
    it("sets conversation filter", () => {
      const { setConversationFilter } = useChatStore.getState();

      setConversationFilter("active");
      expect(useChatStore.getState().conversationFilter).toBe("active");

      setConversationFilter("completed");
      expect(useChatStore.getState().conversationFilter).toBe("completed");
    });
  });
});
