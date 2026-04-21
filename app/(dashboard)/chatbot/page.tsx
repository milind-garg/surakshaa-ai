"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Shield, Sparkles } from "lucide-react";
import ChatMessage from "@/components/chatbot/ChatMessage";
import ChatInput from "@/components/chatbot/ChatInput";
import ChatSidebar from "@/components/chatbot/ChatSidebar";
import { useChatStore } from "@/hooks/useChatStore";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

// ✅ Add this helper inside the component file, above the component:
const makeWelcomeMessage = () => ({
  id: "welcome",
  role: "assistant" as const,
  content: `Namaste! 🙏 I'm Suraksha AI, your personal insurance advisor.

I can help you:
- 📋 **Understand** your existing policies
- 🔍 **Find gaps** in your current coverage  
- ⭐ **Recommend** the top 5 policies for your family
- 💬 **Answer** any insurance questions in Hindi or English

To give you the best recommendations, I already have access to your profile and uploaded policies. Just ask me anything!

Try asking: *"Recommend the best health insurance for my family"* 🏥`,
  timestamp: new Date(),
});

export default function ChatbotPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { messages, isLoading, sendMessage, loadMessages, setMessages } =
    useChatStore(activeSessionId);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load sessions on mount
  useEffect(() => {
    if (!user) return;
    loadSessions();
  }, [user]);

  // Load messages when session changes
  useEffect(() => {
    if (!activeSessionId) {
      setMessages([makeWelcomeMessage()]);
      return;
    }
    loadMessages(activeSessionId);
  }, [activeSessionId]);

  const loadSessions = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) setSessions(data);
  };

  const createNewSession = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({
        user_id: user.id,
        title: "New Chat",
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      toast.error("Could not create new chat session");
      return;
    }

    setSessions((prev) => [data, ...prev]);
    setActiveSessionId(data.id);
    setMessages([makeWelcomeMessage()]);
  }, [user, supabase]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      let sessionId = activeSessionId;

      // Auto-create session if none exists
      if (!sessionId) {
        if (!user) return;
        const { data, error } = await supabase
          .from("chat_sessions")
          .insert({
            user_id: user.id,
            title: content.slice(0, 40) + (content.length > 40 ? "..." : ""),
            is_active: true,
          })
          .select()
          .single();

        if (error || !data) {
          toast.error("Could not start chat session");
          return;
        }

        sessionId = data.id;
        setActiveSessionId(data.id);
        setSessions((prev) => [data, ...prev]);
      } else {
        // Update session title from first user message
        const isFirstUserMessage =
          messages.filter((m) => m.role === "user").length === 0;
        if (isFirstUserMessage) {
          await supabase
            .from("chat_sessions")
            .update({
              title: content.slice(0, 40) + (content.length > 40 ? "..." : ""),
            })
            .eq("id", sessionId);

          setSessions((prev) =>
            prev.map((s) =>
              s.id === sessionId ? { ...s, title: content.slice(0, 40) } : s,
            ),
          );
        }
      }

      if (!sessionId) return; // safety guard
      await sendMessage(content, sessionId);
    },
    [activeSessionId, user, supabase, messages, sendMessage],
  );

  const handleDeleteSession = async (sessionId: string) => {
    await supabase.from("chat_sessions").delete().eq("id", sessionId);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));

    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
      setMessages([makeWelcomeMessage()]);
    }

    toast.success("Chat deleted");
  };

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
  };

  const displayMessages = messages.length === 0 ? [makeWelcomeMessage()] : messages;

  return (
    <div className="-m-6 h-[calc(100vh-4rem)] flex overflow-hidden">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="hidden lg:flex h-full">
          <ChatSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={handleSelectSession}
            onNewSession={createNewSession}
            onDeleteSession={handleDeleteSession}
          />
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-gray-950">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#f59e0b] rounded-xl flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-[#1E3A5F] dark:text-white">
                Suraksha AI Assistant
              </h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Online · Powered by Google Gemini
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3 h-3 text-[#1E3A5F] dark:text-blue-400" />
              <span className="text-xs font-medium text-[#1E3A5F] dark:text-blue-400">
                Profile-aware recommendations
              </span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {displayMessages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput
          onSend={handleSendMessage}
          isLoading={isLoading}
          disabled={false}
        />
      </div>
    </div>
  );
}
