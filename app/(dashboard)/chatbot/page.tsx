"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Shield, Sparkles } from "lucide-react";
import ChatMessage from "@/components/chatbot/ChatMessage";
import ChatInput from "@/components/chatbot/ChatInput";
import ChatSidebar from "@/components/chatbot/ChatSidebar";
import { useChatStore } from "@/hooks/useChatStore";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

const makeWelcomeMessage = (t: (en: string, hi: string) => string) => ({
  id: "welcome",
  role: "assistant" as const,
  content: t(
    `Namaste! 🙏 I'm OREVA, your personal Suraksha AI insurance advisor.

I can help you:
- 📋 **Understand** your existing policies
- 🔍 **Find gaps** in your current coverage  
- ⭐ **Recommend** the top 5 policies for your family
- 💬 **Answer** any insurance questions in English or Hindi

To give you the best recommendations, I already have access to your profile and uploaded policies. Just ask me anything!

Try asking: *"Recommend the best health insurance for my family"* 🏥`,

    `नमस्ते! 🙏 मैं ओरेवा हूँ, आपका व्यक्तिगत सुरक्षा एआई बीमा सलाहकार।

मैं आपकी मदद कर सकता हूँ:
- 📋 आपकी मौजूदा पॉलिसियों को **समझने** में
- 🔍 आपके कवरेज में **कमियों को खोजने** में
- ⭐ आपके परिवार के लिए शीर्ष 5 पॉलिसियों का **सुझाव** देने में
- 💬 आपके बीमा प्रश्नों के **उत्तर** देने में

सर्वश्रेष्ठ सुझाव देने के लिए मेरे पास आपकी प्रोफाइल और पॉलिसियों का विवरण है। मुझसे कुछ भी पूछें!

पूछकर देखें: *"मेरे परिवार के लिए सबसे अच्छा स्वास्थ्य बीमा सुझाएं"* 🏥`
  ),
  timestamp: new Date(),
});

export default function ChatbotPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
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
      setMessages([makeWelcomeMessage(t)]);
      return;
    }
    loadMessages(activeSessionId);
  }, [activeSessionId, t]);

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
    setMessages([makeWelcomeMessage(t)]);
  }, [user, supabase, t]);

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
      setMessages([makeWelcomeMessage(t)]);
    }

    toast.success("Chat deleted");
  };

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
  };

  const displayMessages = messages.length === 0 ? [makeWelcomeMessage(t)] : messages;

  return (
    <div className="h-[calc(100vh-6rem)] flex rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs relative">
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
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Chat Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1D7A6C] rounded-xl flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                  {t("OREVA AI Advisor", "ओरेवा एआई सलाहकार")}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-teal-50 border border-teal-100 text-[#1D7A6C] font-mono text-[10px] font-semibold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D7A6C] animate-pulse" />
                  {t("OREVA ONLINE · GEMINI 2.5", "ओरेवा ऑनलाइन · जेमिनी 2.5")}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans">
                {t(
                  "Real-time policy recommendations & clause clarification in English / Hindi",
                  "वास्तविक समय नीति सुझाव और अंग्रेजी / हिंदी में खंड स्पष्टीकरण"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-teal-50 border border-teal-100 px-3 py-1 rounded-md">
              <Sparkles className="w-3 h-3 text-[#1D7A6C]" />
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#1D7A6C]">
                Profile-aware
              </span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full px-6 py-6 space-y-6">
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
