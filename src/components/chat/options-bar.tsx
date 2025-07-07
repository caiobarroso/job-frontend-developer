"use client";

import { useState } from "react";
import { useChatStore } from "@/store/chat/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OptionsBarProps {
  options: string[];
}

export function OptionsBar({ options }: OptionsBarProps) {
  const { sendUserOption } = useChatStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);

    sendUserOption(option);

    setTimeout(() => {
      setSelectedOption(null);
    }, 300);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 font-medium">Escolha uma opção:</p>

      <div className="flex flex-col gap-2">
        {options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className={cn(
              "justify-start text-left h-auto p-3 transition-all duration-200",
              "hover:bg-blue-50 hover:border-blue-300 hover:shadow-md",
              "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              selectedOption === option && [
                "bg-blue-100 border-blue-400 shadow-md",
                "transform scale-[0.98]",
              ]
            )}
            onClick={() => handleOptionClick(option)}
            disabled={selectedOption !== null}
          >
            <span className="text-sm leading-relaxed">{option}</span>
          </Button>
        ))}
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        💡 Clique na opção que melhor descreve sua situação
      </p>
    </div>
  );
}
