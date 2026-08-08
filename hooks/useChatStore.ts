"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./useAuth";
import type { PolicyRecommendation } from "@/types";

export type { PolicyRecommendation };

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  recommendations?: PolicyRecommendation[];
  isLoading?: boolean;
}

export function useChatStore(sessionId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false); // ref to avoid double sends
  const messagesRef = useRef<Message[]>(messages); // ref to avoid stale closures

  // Sync ref with state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Memoize client — prevents creating new instances on every render
  const supabase = useMemo(() => createClient(), []);

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
      // Prevent double sends
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

      // Add user message & loading indicator
      setMessages((prev) => [...prev, userMessage, loadingMessage]);

      try {
        // Save user message to DB (non-blocking)
        supabase
          .from("chat_messages")
          .insert({
            session_id: currentSessionId,
            user_id: user.id,
            role: "user",
            content,
          })
          .then(({ error }) => {
            if (error) console.warn("Failed to save user message:", error);
          });

        // Build history from latest messages ref (exclude loading + welcome)
        const history = messagesRef.current
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
            history,
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
        supabase
          .from("chat_messages")
          .insert({
            session_id: currentSessionId,
            user_id: user.id,
            role: "assistant",
            content: data.response,
            metadata: data.recommendations
              ? { recommendations: data.recommendations }
              : {},
          })
          .then(({ error }) => {
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
    [user, supabase, updateLastMessage],
  );

  const loadMessages = useCallback(
    async (sid: string) => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sid)
        .order("created_at", { ascending: true });

      if (error) {
        console.warn("Failed to load chat messages:", error);
        return;
      }

      if (data) {
        setMessages(
          data.map((m) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
            timestamp: new Date(m.created_at),
            recommendations: (m.metadata as Record<string, unknown>)?.recommendations as PolicyRecommendation[] | undefined,
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