"use client";

import { useChatStore } from "@/store/chat/store";
import { Button } from "@/components/ui/button";
import { Plus, MessageCircle, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";
import { ConversationStats } from "./conversation-stats";

export function ConversationList() {
  const {
    currentConversationId,
    createConversation,
    selectConversation,
    deleteConversation,
    getFilteredConversations,
  } = useChatStore();

  const filteredConversations = getFilteredConversations();
  const conversationEntries = Object.entries(filteredConversations).sort(
    ([, a], [, b]) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleDeleteConversation = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    deleteConversation(id);
  };

  const getConversationPreview = (messages: ChatMessage[]) => {
    if (messages.length === 0) return "Nova conversa";
    const lastUserMessage = messages
      .filter((msg) => msg.from === "user")
      .slice(-1)[0];
    return lastUserMessage?.text || "Conversa iniciada";
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-3 py-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between h-[38px]">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Conversas</h2>
          </div>
          <Button
            onClick={createConversation}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Nova
          </Button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex-shrink-0">
        <ConversationStats />
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversationEntries.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Nenhuma conversa encontrada</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversationEntries.map(([id, conversation]) => (
              <div
                key={id}
                className={cn(
                  "group relative p-3 rounded-lg cursor-pointer transition-all duration-200",
                  "hover:bg-gray-50 hover:shadow-sm",
                  currentConversationId === id
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : "bg-white border border-gray-100"
                )}
                onClick={() => selectConversation(id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-500 truncate">
                        {formatDistanceToNow(new Date(conversation.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 truncate">
                      {getConversationPreview(conversation.messages)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {conversation.currentStepId === "welcome"
                          ? "Iniciando"
                          : conversation.currentStepId === "goodbye"
                          ? "Concluído"
                          : "Em andamento"}
                      </span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  {conversationEntries.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1 h-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => handleDeleteConversation(id, e)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
