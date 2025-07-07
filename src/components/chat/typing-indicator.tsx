import { useChatStore } from "@/store/chat/store";
import { Bot } from "lucide-react";
import { useState, useEffect } from "react";

export function TypingIndicator() {
  const { getCurrentConversation, isStreaming } = useChatStore();
  const [isTyping, setIsTyping] = useState(false);
  const currentConversation = getCurrentConversation();

  useEffect(() => {
    const messages = currentConversation?.messages || [];
    const lastMessage = messages[messages.length - 1];
    const shouldShowTyping =
      messages.length > 0 && lastMessage?.from === "user" && !isStreaming;

    if (shouldShowTyping) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1500);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [currentConversation?.messages, isStreaming]);

  if (!isTyping) return null;

  return (
    <div className="flex gap-3 justify-start">
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <Bot className="w-4 h-4 text-white" />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm relative">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600 mr-2">
            Sofia está digitando
          </span>

          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
        </div>

        <div className="absolute top-4 -left-2 w-0 h-0 border-l-0 border-r-[8px] border-t-[6px] border-b-[6px] border-r-white border-t-transparent border-b-transparent" />
      </div>
    </div>
  );
}
