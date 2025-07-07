"use client";

import { useChatStore } from "@/store/chat/store";
import { MessageCircle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConversationStats() {
  const { conversations, conversationFilter, setConversationFilter } =
    useChatStore();

  const stats = Object.values(conversations).reduce(
    (acc, conv) => {
      acc.total++;
      if (conv.currentStepId === "goodbye") {
        acc.completed++;
      } else if (conv.messages.length > 0) {
        acc.inProgress++;
      }

      return acc;
    },
    { total: 0, completed: 0, inProgress: 0 }
  );

  const filters = [
    {
      id: "all" as const,
      label: "Todas",
      count: stats.total,
      icon: MessageCircle,
      color: "text-gray-600",
    },
    {
      id: "active" as const,
      label: "Ativas",
      count: stats.inProgress,
      icon: Clock,
      color: "text-blue-600",
    },
    {
      id: "completed" as const,
      label: "Finalizadas",
      count: stats.completed,
      icon: CheckCircle,
      color: "text-green-600",
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-3 py-4">
      <div className="flex gap-1">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = conversationFilter === filter.id;

          return (
            <button
              key={filter.id}
              onClick={() => setConversationFilter(filter.id)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-200",
                "hover:bg-gray-50",
                isActive
                  ? "bg-blue-50 border-2 border-blue-200"
                  : "bg-gray-50 border-2 border-transparent"
              )}
            >
              <div className="flex items-center gap-1">
                <Icon
                  className={cn(
                    "w-3 h-3",
                    isActive ? "text-blue-600" : filter.color
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-medium",
                    isActive ? "text-blue-600" : "text-gray-600"
                  )}
                >
                  {filter.label}
                </span>
              </div>
              <span
                className={cn(
                  "text-sm font-bold",
                  isActive ? "text-blue-700" : filter.color
                )}
              >
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
