import { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { useChatStore } from "@/store/chat/store";

interface MessageBubbleProps {
  message: ChatMessage;
  children?: React.ReactNode;
  isLastBotMessage?: boolean;
}

export function MessageBubble({
  message,
  children,
  isLastBotMessage = false,
}: MessageBubbleProps) {
  const isBot = message.from === "bot";
  const { isStreaming, streamingText } = useChatStore();

  const displayText =
    isBot && isLastBotMessage && isStreaming ? streamingText : message.text;

  return (
    <div
      className={cn(
        "flex gap-3 max-w-full",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 relative",
          isBot
            ? "bg-white border border-gray-200 shadow-sm"
            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        )}
      >
        {/* Message Text */}
        <p
          className={cn(
            "text-sm leading-relaxed",
            isBot ? "text-gray-800" : "text-white"
          )}
        >
          {displayText}
          {isBot && isLastBotMessage && isStreaming && (
            <span className="animate-pulse">▎</span>
          )}
        </p>

        {children && <div className="mt-3">{children}</div>}

        <div
          className={cn(
            "absolute top-4 w-0 h-0",
            isBot
              ? [
                  "-left-2 border-l-0 border-r-[8px] border-t-[6px] border-b-[6px]",
                  "border-r-white border-t-transparent border-b-transparent",
                ]
              : [
                  "-right-2 border-r-0 border-l-[8px] border-t-[6px] border-b-[6px]",
                  "border-l-blue-600 border-t-transparent border-b-transparent",
                ]
          )}
        />
      </div>

      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </div>
      )}
    </div>
  );
}
