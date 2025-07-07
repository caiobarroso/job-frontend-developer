"use client";

import { useState, useEffect } from "react";
import { ChatWindow } from "./chat-window";
import { ConversationList } from "./conversation-list";
import { cn } from "@/lib/utils";

export function Chatbot() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen w-full flex bg-gray-100 relative">
      <div className="hidden md:flex w-80 flex-shrink-0">
        <ConversationList />
      </div>

      <div
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ConversationList />
      </div>

      {isMobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 backdrop-blur-xs bg-white/30 z-40 transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <ChatWindow
          isMobileSidebarOpen={isMobileSidebarOpen}
          onToggleMobileSidebar={() =>
            setIsMobileSidebarOpen(!isMobileSidebarOpen)
          }
        />
      </div>
    </div>
  );
}
