"use client";

import { Bot } from "lucide-react";

export function OptionsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 justify-center">
        <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Bot className="w-3 h-3 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Preparando suas opções</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: "1.2s",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-12 bg-gray-100 rounded-lg animate-pulse"
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: "2s",
            }}
          >
            <div className="h-full bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-lg" />
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 text-center">
        ⏳ Aguarde enquanto Sofia finaliza sua mensagem
      </p>
    </div>
  );
}
