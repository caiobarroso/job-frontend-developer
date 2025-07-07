"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface MobileConversationToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileConversationToggle({
  isOpen,
  onToggle,
}: MobileConversationToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="md:hidden text-white hover:bg-white/20 p-2"
    >
      {isOpen ? (
        <X className="w-5 h-5" />
      ) : (
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5" />
          <span className="text-sm font-medium">Conversas</span>
        </div>
      )}
    </Button>
  );
}
