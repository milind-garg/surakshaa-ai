"use client";

import { Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";
import RecommendationCards from "./RecommendationCards";
import type { Message } from "@/hooks/useChatStore";

interface ChatMessageProps {
  message: Message;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isLoading = message.isLoading;

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1",
          isUser
            ? "bg-[#1E3A5F]"
            : "bg-gradient-to-br from-[#FF6B35] to-[#f59e0b]",
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Shield className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] space-y-2",
          isUser ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-[#1E3A5F] text-white rounded-tr-sm"
              : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm shadow-sm",
          )}
        >
          {isLoading ? (
            <TypingIndicator />
          ) : (
            <div className="whitespace-pre-wrap">
              {message.content
                .replace(/```(?:json)?\s*[\s\S]*?```/gi, "")
                .replace(/\n{3,}/g, "\n\n")
                .trim()}
            </div>
          )}
        </div>

        {/* Recommendations */}
        {message.recommendations && message.recommendations.length > 0 && (
          <div className="w-full max-w-lg">
            <RecommendationCards recommendations={message.recommendations} />
          </div>
        )}

        {/* Timestamp */}
        {!isLoading && (
          // Replace with:
          <p
            suppressHydrationWarning
            className={cn(
              "text-xs text-gray-400",
              isUser ? "text-right" : "text-left",
            )}
          >
            {message.timestamp.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
