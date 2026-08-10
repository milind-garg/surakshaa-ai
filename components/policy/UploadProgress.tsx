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
    <div className="bg-[#0A1118] border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-xl text-white font-sans relative overflow-hidden">

      {/* Top Terminal Status Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-400">
          <Brain className="w-4 h-4 text-teal-400 animate-pulse" />
          <span>SURAKSHA_OCR_ENGINE_ACTIVE</span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 font-mono text-[10px] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          {stage === "uploading" ? "UPLOADING" : "PARSING CLAUSES"}
        </span>
      </div>

      {/* Animated Icon */}
      <div className="relative flex items-center justify-center pt-2">
        <div className="w-16 h-16 bg-[#1D7A6C] rounded-2xl flex items-center justify-center shadow-lg">
          {stage === "uploading" ? (
            <Upload className="w-8 h-8 text-white animate-bounce" />
          ) : (
            <Brain className="w-8 h-8 text-white animate-pulse" />
          )}
        </div>

        {/* Spinning ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 border-2 border-slate-800 border-t-teal-400 rounded-full animate-spin" />
        </div>
      </div>

      {/* Stage Label */}
      <div>
        <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-md mb-3">
          <Loader2 className="w-3.5 h-3.5 text-teal-400 animate-spin" />
          <span className="text-xs font-mono uppercase tracking-wider text-teal-300 font-semibold">
            {stage === "uploading" ? "UPLOADING FILE" : "AI CLAUSE ANALYSIS"}
          </span>
        </div>

        {/* Cycling message */}
        <p className="text-white font-extrabold text-lg tracking-tight">
          {messages[messageIndex]}
        </p>

        {stage === "processing" && (
          <p className="text-teal-400 font-hindi text-xs mt-1.5 font-medium">
            AI आपकी पॉलिसी पढ़ रहा है...
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 max-w-sm mx-auto w-full">
        <Progress value={progress} className="h-2.5 rounded-full bg-slate-800" />
        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span>STATUS: IN_PROGRESS</span>
          <span className="font-bold text-teal-400">
            {progress}%
          </span>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex justify-center gap-8 pt-2">
        {[
          { label: "UPLOAD", done: progress >= 50 },
          { label: "OCR READ", done: progress >= 75 },
          { label: "ANALYZE", done: progress >= 100 },
        ].map((step, i) => (
          <div key={step.label} className="flex flex-col items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-colors ${
                step.done
                  ? "bg-[#1D7A6C] text-white ring-2 ring-teal-400/30"
                  : "bg-slate-800 text-slate-500 border border-slate-700"
              }`}
            >
              {step.done ? "✓" : i + 1}
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500 font-mono pt-2 border-t border-slate-800/80">
        Please don't close this tab — clause extraction takes about 15–30 seconds
      </p>
    </div>
  );
}