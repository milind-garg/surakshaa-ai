"use client";

import { useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./useAuth";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  recommendations?: PolicyRecommendation[];
  isLoading?: boolean;
}

export interface PolicyRecommendation {
  rank: number;
  policy_name: string;
  insurer: string;
  policy_type: string;
  premium_estimate: string;
  sum_insured: string;
  key_features: string[];
  why_recommended: string;
  match_score: number;
}

export function useChatStore(sessionId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false); // ref to avoid stale closure
  const supabase = createClient();

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const updateLastMessage = useCallback((updates: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === prev.length - 1 ? { ...msg, ...updates } : msg,
      ),
    );
  }, []);

  const sendMessage = useCallback(
    async (content: string, currentSessionId: string) => {
      // Use ref to prevent double sends, don't block on user check here
      if (isLoadingRef.current) return;
      if (!user) {
        console.warn("sendMessage called before user loaded");
        return;
      }

      isLoadingRef.current = true;
      setIsLoading(true);

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      const loadingMessage: Message = {
        id: `assistant-loading-${Date.now()}`,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isLoading: true,
      };

      setMessages((prev) => [...prev, userMessage, loadingMessage]);

      try {
        // Save user message to DB (non-blocking — don't await before API call)
        supabase.from("chat_messages").insert({
          session_id: currentSessionId,
          user_id: user.id,
          role: "user",
          content,
        }).then(({ error }) => {
          if (error) console.warn("Failed to save user message:", error);
        });

        // Build history from current messages (exclude loading + welcome)
        const history = messages
          .filter((m) => !m.isLoading && m.id !== "welcome")
          .slice(-10)
          .map((m) => ({ role: m.role, content: m.content }));

        // Call chat API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            sessionId: currentSessionId,
            history, // clean history, no welcome message
          }),
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          console.error("Chat API error response:", errBody);
          throw new Error(errBody?.details ?? `API error ${response.status}`);
        }

        const data = await response.json();

        if (!data.response) {
          throw new Error("Empty response from API");
        }

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
          recommendations: data.recommendations ?? undefined,
          isLoading: false,
        };

        // Replace loading message with real response
        setMessages((prev) =>
          prev.map((msg) => (msg.isLoading ? assistantMessage : msg)),
        );

        // Save assistant message to DB
        supabase.from("chat_messages").insert({
          session_id: currentSessionId,
          user_id: user.id,
          role: "assistant",
          content: data.response,
          metadata: data.recommendations
            ? { recommendations: data.recommendations }
            : {},
        }).then(({ error }) => {
          if (error) console.warn("Failed to save assistant message:", error);
        });

      } catch (err) {
        console.error("Chat send error:", err);
        updateLastMessage({
          content: "Sorry, I encountered an error. Please try again.",
          isLoading: false,
        });
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    // Remove isLoading from deps — use ref instead to avoid stale closures
    [user, messages, supabase, updateLastMessage],
  );

  const loadMessages = useCallback(
    async (sid: string) => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sid)
        .order("created_at", { ascending: true });

      if (data) {
        setMessages(
          data.map((m) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
            timestamp: new Date(m.created_at),
            recommendations: (m.metadata as any)?.recommendations,
          })),
        );
      }
    },
    [supabase],
  );

  return {
    messages,
    isLoading,
    sendMessage,
    addMessage,
    loadMessages,
    setMessages,
  };
}