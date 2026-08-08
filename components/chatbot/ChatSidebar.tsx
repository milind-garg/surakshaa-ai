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
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <Button
          onClick={onNewSession}
          className="w-full bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-lg gap-2 text-xs font-medium shadow-xs"
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
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-400 font-mono">No chats yet</p>
            <p className="text-xs font-hindi text-[#1D7A6C]">अभी कोई चैट नहीं</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-xs font-mono",
                activeSessionId === session.id
                  ? "bg-[#1D7A6C] text-white font-medium"
                  : "hover:bg-slate-50 text-slate-700"
              )}
              onClick={() => onSelectSession(session.id)}
            >
              <MessageSquare
                className={cn(
                  "w-3.5 h-3.5 shrink-0",
                  activeSessionId === session.id
                    ? "text-teal-200"
                    : "text-slate-400"
                )}
              />
              <p className="text-xs flex-1 truncate">
                {session.title}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className={cn(
                  "opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded",
                  activeSessionId === session.id
                    ? "hover:bg-white/20 text-white"
                    : "hover:bg-slate-200 text-slate-500"
                )}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer note */}
      <div className="p-3 border-t border-slate-200">
        <p className="text-[11px] text-slate-400 text-center font-mono">
          Conversations saved automatically
        </p>
      </div>
    </div>
  );
}