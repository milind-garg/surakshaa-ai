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
    <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-6 shadow-xs">

      {/* Animated Icon */}
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 bg-[#1D7A6C] rounded-xl flex items-center justify-center shadow-xs">
          {stage === "uploading" ? (
            <Upload className="w-8 h-8 text-white animate-bounce" />
          ) : (
            <Brain className="w-8 h-8 text-white animate-pulse" />
          )}
        </div>

        {/* Spinning ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 border-2 border-slate-200 border-t-[#1D7A6C] rounded-full animate-spin" />
        </div>
      </div>

      {/* Stage Label */}
      <div>
        <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 px-3 py-1 rounded-md mb-3">
          <Loader2 className="w-3.5 h-3.5 text-[#1D7A6C] animate-spin" />
          <span className="text-xs font-mono uppercase tracking-wider text-[#1D7A6C] font-semibold">
            {stage === "uploading" ? "Uploading" : "AI Analyzing"}
          </span>
        </div>

        {/* Cycling message */}
        <p className="text-slate-900 font-bold text-base">
          {messages[messageIndex]}
        </p>

        {stage === "processing" && (
          <p className="text-[#1D7A6C] font-hindi text-xs mt-1 font-medium">
            AI आपकी पॉलिसी पढ़ रहा है...
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 max-w-sm mx-auto w-full">
        <Progress value={progress} className="h-2 rounded-full bg-slate-100" />
        <div className="flex justify-between text-xs text-slate-500 font-mono">
          <span>Processing</span>
          <span className="font-bold text-[#1D7A6C]">
            {progress}%
          </span>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex justify-center gap-6">
        {[
          { label: "Upload", done: progress >= 50 },
          { label: "AI Read", done: progress >= 75 },
          { label: "Analyze", done: progress >= 100 },
        ].map((step, i) => (
          <div key={step.label} className="flex flex-col items-center gap-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-colors ${
                step.done
                  ? "bg-[#1D7A6C] text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {step.done ? "✓" : i + 1}
            </div>
            <span className="text-[11px] font-mono uppercase text-slate-500">
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400">
        Please don't close this tab — this takes about 15–30 seconds
      </p>
    </div>
  );
}