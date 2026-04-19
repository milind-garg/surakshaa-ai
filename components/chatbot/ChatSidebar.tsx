"use client";

import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
}

export default function ChatSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
}: ChatSidebarProps) {
  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <Button
          onClick={onNewSession}
          className="w-full bg-[#1E3A5F] hover:bg-[#152A46] text-white rounded-xl gap-2 text-sm"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No chats yet</p>
            <p className="text-xs font-hindi text-gray-400">अभी कोई चैट नहीं</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors",
                activeSessionId === session.id
                  ? "bg-[#1E3A5F] text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              )}
              onClick={() => onSelectSession(session.id)}
            >
              <MessageSquare
                className={cn(
                  "w-4 h-4 shrink-0",
                  activeSessionId === session.id
                    ? "text-blue-300"
                    : "text-gray-400"
                )}
              />
              <p className="text-xs flex-1 truncate font-medium">
                {session.title}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className={cn(
                  "opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg",
                  activeSessionId === session.id
                    ? "hover:bg-white/20 text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                )}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer note */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-400 text-center">
          Conversations are saved
        </p>
      </div>
    </div>
  );
}