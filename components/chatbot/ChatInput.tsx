"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Send, Mic, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const quickPrompts = [
  "Recommend policies for my family",
  "What insurance do I need?",
  "Explain health insurance",
  "Best term plan for me",
  "How to file a claim?",
  "Compare health vs life insurance",
];

export default function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || disabled) return;
    onSend(trimmed);
    setInput("");
    setShowQuickPrompts(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    setShowQuickPrompts(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-3">
      {/* Quick Prompts */}
      {showQuickPrompts && (
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleQuickPrompt(prompt)}
              className="text-xs px-3 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-700 hover:border-[#1E3A5F] text-gray-600 dark:text-gray-400 hover:text-[#1E3A5F] rounded-full transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus-within:border-[#1E3A5F] focus-within:ring-2 focus-within:ring-[#1E3A5F]/10 transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowQuickPrompts(false)}
            placeholder="Ask about insurance, get recommendations... (Press Enter to send)"
            disabled={disabled || isLoading}
            rows={1}
            className="w-full bg-transparent px-4 py-3 pr-10 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 resize-none outline-none max-h-32"
          />
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isLoading || disabled}
          className={cn(
            "w-11 h-11 rounded-xl p-0 shrink-0 transition-all",
            input.trim() && !isLoading
              ? "bg-[#1E3A5F] hover:bg-[#152A46] text-white shadow-lg"
              : "bg-gray-100 dark:bg-gray-800 text-gray-400"
          )}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-[#1E3A5F] rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Suraksha AI may make mistakes. Verify recommendations with the insurer.
        <span className="font-hindi"> · AI गलतियाँ कर सकता है।</span>
      </p>
    </div>
  );
}