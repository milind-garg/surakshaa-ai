"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Image, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFilesAccepted: (files: File[]) => void;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileDropzone({ onFilesAccepted }: FileDropzoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setFileError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === "file-too-large") {
          setFileError("File is too large. Maximum size is 10MB.");
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setFileError("Invalid file type. Please upload PDF, JPG, PNG, or WebP.");
        } else {
          setFileError("File rejected. Please try another file.");
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    maxFiles: 1,
    multiple: false,
  });

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setFileError(null);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFilesAccepted([selectedFile]);
    }
  };

  const isPdf = selectedFile?.type === "application/pdf";

  return (
    <div className="space-y-4">
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200",
          isDragActive && !isDragReject
            ? "border-[#1D7A6C] bg-teal-50/50 scale-[1.005]"
            : isDragReject
            ? "border-red-400 bg-red-50"
            : selectedFile
            ? "border-teal-500 bg-teal-50/30"
            : "border-slate-300 bg-slate-50/50 hover:border-[#1D7A6C] hover:bg-slate-50"
        )}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          /* File Selected State */
          <div className="space-y-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto shadow-xs border border-slate-200">
              {isPdf ? (
                <FileText className="w-8 h-8 text-red-500" />
              ) : (
                <Image className="w-8 h-8 text-[#1D7A6C]" />
              )}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-base">
                {selectedFile.name}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                {formatBytes(selectedFile.size)} ·{" "}
                {selectedFile.type === "application/pdf" ? "PDF Document" : "Image File"}
              </p>
              <p className="text-[#1D7A6C] text-xs font-mono font-medium mt-2 uppercase tracking-wider">
                ✓ Ready to upload
              </p>
            </div>
            <button
              onClick={handleRemoveFile}
              className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xs border border-slate-200 hover:bg-red-50 transition-colors"
            >
              <X className="w-4 h-4 text-slate-500 hover:text-red-500" />
            </button>
          </div>
        ) : isDragActive && !isDragReject ? (
          /* Drag Over State */
          <div className="space-y-4">
            <div className="w-16 h-16 bg-[#1D7A6C] rounded-xl flex items-center justify-center mx-auto animate-bounce">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <p className="text-slate-900 font-bold text-lg">
              Drop it here!
            </p>
            <p className="text-[#1D7A6C] font-hindi text-sm">यहाँ छोड़ें!</p>
          </div>
        ) : isDragReject ? (
          /* Drag Reject State */
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-red-600 font-bold text-lg">
              File not supported
            </p>
          </div>
        ) : (
          /* Default Idle State */
          <div className="space-y-5">
            <div className="w-16 h-16 bg-[#1D7A6C] rounded-xl flex items-center justify-center mx-auto shadow-xs">
              <Upload className="w-8 h-8 text-white" />
            </div>

            <div>
              <p className="text-lg font-bold text-slate-900">
                Drop your policy here
              </p>
              <p className="text-[#1D7A6C] font-hindi text-xs mt-0.5 font-medium">
                पॉलिसी यहाँ छोड़ें
              </p>
              <p className="text-slate-500 text-xs mt-2">
                or{" "}
                <span className="text-[#1D7A6C] font-semibold underline underline-offset-2">
                  browse to choose a file
                </span>
              </p>
            </div>

            {/* Accepted formats */}
            <div className="flex flex-wrap justify-center gap-2">
              {["PDF", "JPG", "PNG", "WebP"].map((fmt) => (
                <span
                  key={fmt}
                  className="px-2.5 py-0.5 bg-white border border-slate-200 rounded text-xs font-mono font-medium text-slate-600 uppercase"
                >
                  {fmt}
                </span>
              ))}
              <span className="px-2.5 py-0.5 bg-white border border-slate-200 rounded text-xs font-mono font-medium text-slate-500">
                Max 10MB
              </span>
            </div>
          </div>
        )}
      </div>

      {/* File Error */}
      {fileError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-red-600 text-xs">{fileError}</p>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && !fileError && (
        <Button
          onClick={handleUpload}
          className="w-full bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-lg h-11 text-sm font-medium shadow-xs transition-colors gap-2"
        >
          <Upload className="w-4 h-4" />
          Analyze This Policy with AI
        </Button>
      )}

      {/* Supported Insurers */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <p className="text-xs font-bold text-slate-900 mb-2">
          Supported Insurers (and more)
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[
            "LIC", "HDFC Life", "ICICI Prudential", "SBI Life",
            "Max Life", "Bajaj Allianz", "Tata AIA", "Star Health",
            "New India", "United India", "National Insurance",
          ].map((insurer) => (
            <span
              key={insurer}
              className="px-2 py-0.5 bg-slate-50 text-slate-700 text-xs rounded border border-slate-200 font-mono"
            >
              {insurer}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}