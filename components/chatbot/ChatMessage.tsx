"use client";

import { useState, useEffect } from "react";
import { Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";
import RecommendationCards from "./RecommendationCards";
import type { Message } from "@/hooks/useChatStore";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: Message;
  userAvatar?: string;
}

function TypingIndicator() {
  return (
    <div className="space-y-2 p-3.5 w-56 sm:w-72 animate-pulse">
      <div className="h-3.5 bg-slate-200/80 rounded-md w-full" />
      <div className="h-3.5 bg-slate-200/70 rounded-md w-5/6" />
      <div className="h-3 bg-slate-100 rounded-md w-4/6" />
    </div>
  );
}

export default function ChatMessage({ message, userAvatar }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isLoading = message.isLoading;

  const [avatarUrl, setAvatarUrl] = useState<string>(userAvatar || "");

  useEffect(() => {
    if (userAvatar) {
      setAvatarUrl(userAvatar);
    } else if (typeof window !== "undefined") {
      const saved = localStorage.getItem("suraksha_user_avatar");
      if (saved) setAvatarUrl(saved);
    }
  }, [userAvatar]);

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      {/* Avatar */}
      {isUser ? (
        <Avatar className="w-8 h-8 rounded-lg shrink-0 mt-1 shadow-xs border border-slate-200 bg-slate-100 overflow-hidden">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt="User Avatar" className="object-contain p-0.5" />
          ) : null}
          <AvatarFallback className="bg-slate-900 text-white rounded-lg">
            <User className="w-4 h-4 text-white" />
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-11 h-11 flex items-center justify-center shrink-0 mt-0.5">
          <img src="/logo_option4.png" alt="Surakshaa.ai" className="w-full h-full object-contain" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[80%] min-w-0 space-y-2 break-words overflow-hidden",
          isUser ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "rounded-xl px-4 py-3 text-sm leading-relaxed break-words overflow-hidden max-w-full",
            isUser
              ? "bg-[#1D7A6C] text-white rounded-tr-xs shadow-xs font-medium"
              : "bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs",
          )}
        >
          {isLoading ? (
            <TypingIndicator />
          ) : isUser ? (
            // User message — plain white text, no prose
            <div className="text-white text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </div>
          ) : (
            // Assistant message — markdown rendered
            <div className="prose prose-sm max-w-none break-words overflow-hidden
              prose-p:my-1 prose-p:leading-relaxed prose-p:break-words
              prose-ul:my-1 prose-ul:pl-4
              prose-li:my-0.5
              prose-strong:text-slate-900 prose-strong:font-bold
              prose-headings:text-slate-900
              prose-pre:whitespace-pre-wrap prose-pre:break-words prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-3.5 prose-pre:rounded-lg prose-pre:text-xs prose-pre:font-mono prose-pre:max-w-full prose-pre:overflow-x-auto
              prose-code:break-words prose-code:whitespace-pre-wrap
              [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
              <ReactMarkdown
                components={{
                  pre: ({ node, ...props }) => (
                    <pre className="whitespace-pre-wrap break-words overflow-x-auto bg-slate-900 text-slate-100 p-3.5 rounded-lg text-xs font-mono max-w-full" {...props} />
                  ),
                  code: ({ node, ...props }) => (
                    <code className="whitespace-pre-wrap break-words text-xs font-mono" {...props} />
                  ),
                }}
              >
                {message.content
                  .replace(/```(?:json)?\s*[\s\S]*?```/gi, "")
                  .replace(/\n{3,}/g, "\n\n")
                  .trim()}
              </ReactMarkdown>
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