import { describe, it, expect, beforeEach, vi } from "vitest";
import { useChatStore } from "@/store/chat/store";
import { chatFlow } from "@/mocks/chat-flow";

vi.mock("@/mocks/chat-flow", () => ({
  chatFlow: [
    { id: "welcome", message: "Welcome!" },
    { id: "qualification", message: "Qualification" },
    { id: "result", message: "Result" },
  ],
}));

describe("useChatStore", () => {
  beforeEach(() => {
    useChatStore.setState({
      steps: chatFlow,
      currentConversationId: "",
      conversations: {},
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
        messages: [],
        payload: {},
        createdAt: expect.any(String),
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
      expect(conversation.messages).toHaveLength(2);
      expect(conversation.messages[0]).toEqual({ from: "user", text: "Yes" });
      expect(conversation.messages[1]).toEqual({
        from: "bot",
        text: "Qualification",
      });
      expect(conversation.currentStepId).toBe("qualification");
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
      expect(conversation.messages).toEqual([]);
      expect(conversation.payload).toEqual({});
    });

    it("handles non-existent conversation gracefully", () => {
      useChatStore.setState({ currentConversationId: "invalid-id" });

      const { sendUserOption, nextBotMessage, reset } = useChatStore.getState();

      expect(() => sendUserOption("test")).not.toThrow();
      expect(() => nextBotMessage()).not.toThrow();
      expect(() => reset()).not.toThrow();
    });
  });
});
