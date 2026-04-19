"use client";

import { useState, useCallback } from "react";
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
  const supabase = createClient();

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const updateLastMessage = useCallback((updates: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === prev.length - 1 ? { ...msg, ...updates } : msg
      )
    );
  }, []);

  const sendMessage = useCallback(
    async (content: string, currentSessionId: string) => {
      if (!user || isLoading) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // Add loading assistant message
      const loadingMessage: Message = {
        id: `assistant-loading-${Date.now()}`,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isLoading: true,
      };
      setMessages((prev) => [...prev, loadingMessage]);

      try {
        // Save user message to DB
        await supabase.from("chat_messages").insert({
          session_id: currentSessionId,
          user_id: user.id,
          role: "user",
          content,
        });

        // Get conversation history for context
        const history = messages
          .filter((m) => !m.isLoading)
          .slice(-10) // last 10 messages for context
          .map((m) => ({ role: m.role, content: m.content }));

        // Call chat API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            sessionId: currentSessionId,
            history,
          }),
        });

        if (!response.ok) throw new Error("Chat API failed");

        const data = await response.json();

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
          recommendations: data.recommendations,
          isLoading: false,
        };

        // Replace loading message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.isLoading ? assistantMessage : msg
          )
        );

        // Save assistant message to DB
        await supabase.from("chat_messages").insert({
          session_id: currentSessionId,
          user_id: user.id,
          role: "assistant",
          content: data.response,
          metadata: data.recommendations
            ? { recommendations: data.recommendations }
            : {},
        });

      } catch (err) {
        updateLastMessage({
          content: "Sorry, I encountered an error. Please try again.",
          isLoading: false,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [user, isLoading, messages, supabase]
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
          }))
        );
      }
    },
    [supabase]
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