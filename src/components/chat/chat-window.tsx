"use client";

import { useChatStore } from "@/store/chat/store";
import { getResultStepId } from "@/store/chat/utils";
import { useEffect, useRef } from "react";
import { DiagnosisCard } from "./diagnosis-card";
import { MessageBubble } from "./message-bubble";
import { MobileConversationToggle } from "./mobile-conversation-toggle";
import { OptionsBar } from "./options-bar";
import { OptionsLoading } from "./options-loading";
import { TypingIndicator } from "./typing-indicator";

interface ChatWindowProps {
  isMobileSidebarOpen: boolean;
  onToggleMobileSidebar: () => void;
}

export function ChatWindow({
  isMobileSidebarOpen,
  onToggleMobileSidebar,
}: ChatWindowProps) {
  const {
    nextBotMessage,
    getCurrentConversation,
    getCurrentStep,
    isStreaming,
    steps,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentConversation = getCurrentConversation();
  const currentStep = getCurrentStep();

  console.log("currentConversation", currentConversation);

  // Scroll automático quando novas mensagens chegam
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages]);

  // Inicia a conversa com a primeira mensagem (apenas se necessário)
  useEffect(() => {
    if (
      currentConversation &&
      currentConversation.messages.length === 0 &&
      currentStep &&
      currentStep.id !== "welcome" // Não chama para welcome pois já vem com mensagem inicial
    ) {
      // Delay inicial para simular que o bot está "pensando"
      setTimeout(() => {
        nextBotMessage();
      }, 800);
    }
  }, [currentConversation?.messages.length, currentStep?.id]);

  // Se não há conversa ativa, não renderiza nada
  if (!currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Selecione uma conversa para começar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between h-[38px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">S</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg">Sofia</h1>
              <p className="text-sm text-blue-100">Consultora Digital Dolado</p>
            </div>
          </div>

          {/* Toggle mobile para conversas */}
          <MobileConversationToggle
            isOpen={isMobileSidebarOpen}
            onToggle={onToggleMobileSidebar}
          />
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {currentConversation.messages.map((message, index) => {
          // Verifica se é a última mensagem do bot
          const isLastBotMessage =
            message.from === "bot" &&
            index === currentConversation.messages.length - 1;

          // Verifica se é uma mensagem de resultado com diagnóstico
          const messageWithDiagnosis =
            message.from === "bot" &&
            message.text ===
              "Baseado no seu perfil, aqui está seu diagnóstico personalizado:";

          // Busca o step de diagnóstico baseado no score da conversa
          const getDiagnosisStep = () => {
            if (!messageWithDiagnosis) return null;

            const resultStepId = getResultStepId(
              currentConversation.leadScore.total
            );
            return steps.find((s) => s.id === resultStepId);
          };

          const diagnosisStep = getDiagnosisStep();

          return (
            <MessageBubble
              key={index}
              message={message}
              isLastBotMessage={isLastBotMessage}
            >
              {/* Mostrar diagnóstico se esta mensagem contém diagnóstico */}
              {messageWithDiagnosis && diagnosisStep?.diagnosis && (
                <DiagnosisCard diagnosis={diagnosisStep.diagnosis} />
              )}
            </MessageBubble>
          );
        })}

        <TypingIndicator />

        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        {/* Verifica se há opções disponíveis */}
        {currentStep?.options && currentStep.options.length > 0 ? (
          <>
            {/* Mostra loading se o bot estiver digitando */}
            {isStreaming ? (
              <OptionsLoading />
            ) : /* Mostra as opções quando o bot terminar de falar */
            currentStep?.options && currentStep.options.length > 0 ? (
              <OptionsBar options={currentStep.options} />
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
