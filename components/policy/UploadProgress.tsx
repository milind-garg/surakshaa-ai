"use client";

import { useEffect, useState } from "react";
import { Upload, Brain, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { UploadStage } from "./UploadContainer";

interface UploadProgressProps {
  stage: UploadStage;
  progress: number;
}

const uploadMessages = [
  "Uploading your document securely...",
  "Storing in encrypted vault...",
  "Preparing for AI analysis...",
];

const processingMessages = [
  "Reading your policy document...",
  "AI is analyzing coverage details...",
  "Identifying coverage gaps...",
  "Calculating claim probability...",
  "Generating Hindi & English summary...",
  "Almost done...",
];

export default function UploadProgress({ stage, progress }: UploadProgressProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = stage === "uploading" ? uploadMessages : processingMessages;

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-10 text-center space-y-8 shadow-lg">

      {/* Animated Icon */}
      <div className="relative flex items-center justify-center">
        <div className="w-24 h-24 bg-gradient-to-br from-[#1E3A5F] to-[#2d5986] rounded-3xl flex items-center justify-center shadow-2xl">
          {stage === "uploading" ? (
            <Upload className="w-12 h-12 text-white animate-bounce" />
          ) : (
            <Brain className="w-12 h-12 text-white animate-pulse" />
          )}
        </div>

        {/* Spinning ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 border-4 border-[#1E3A5F]/20 border-t-[#FF6B35] rounded-full animate-spin" />
        </div>
      </div>

      {/* Stage Label */}
      <div>
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-3">
          <Loader2 className="w-4 h-4 text-[#1E3A5F] dark:text-blue-400 animate-spin" />
          <span className="text-sm font-semibold text-[#1E3A5F] dark:text-blue-400">
            {stage === "uploading" ? "Uploading" : "AI Analyzing"}
          </span>
        </div>

        {/* Cycling message */}
        <p className="text-gray-700 dark:text-gray-300 font-medium text-lg animate-fade-in">
          {messages[messageIndex]}
        </p>

        {stage === "processing" && (
          <p className="text-[#FF6B35] font-hindi text-base mt-2">
            AI आपकी पॉलिसी पढ़ रहा है...
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 max-w-sm mx-auto w-full">
        <Progress value={progress} className="h-3 rounded-full" />
        <div className="flex justify-between text-xs text-gray-400">
          <span>Processing</span>
          <span className="font-semibold text-[#1E3A5F] dark:text-blue-400">
            {progress}%
          </span>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex justify-center gap-8">
        {[
          { label: "Upload", done: progress >= 50 },
          { label: "AI Read", done: progress >= 75 },
          { label: "Analyze", done: progress >= 100 },
        ].map((step, i) => (
          <div key={step.label} className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step.done
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-400"
              }`}
            >
              {step.done ? "✓" : i + 1}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400">
        Please don't close this tab — this takes about 15–30 seconds
      </p>
    </div>
  );
}