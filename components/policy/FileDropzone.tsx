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
          "relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-200",
          isDragActive && !isDragReject
            ? "border-[#1E3A5F] bg-blue-50 dark:bg-blue-900/20 scale-[1.01]"
            : isDragReject
            ? "border-red-400 bg-red-50 dark:bg-red-900/20"
            : selectedFile
            ? "border-green-400 bg-green-50 dark:bg-green-900/20"
            : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-[#1E3A5F] hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
        )}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          /* File Selected State */
          <div className="space-y-4">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto shadow-md border border-gray-100 dark:border-gray-700">
              {isPdf ? (
                <FileText className="w-10 h-10 text-red-500" />
              ) : (
                <Image className="w-10 h-10 text-blue-500" />
              )}
            </div>
            <div>
              <p className="font-semibold text-[#1E3A5F] dark:text-white text-lg">
                {selectedFile.name}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {formatBytes(selectedFile.size)} ·{" "}
                {selectedFile.type === "application/pdf" ? "PDF Document" : "Image File"}
              </p>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium mt-2">
                ✓ Ready to upload
              </p>
            </div>
            <button
              onClick={handleRemoveFile}
              className="absolute top-4 right-4 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
            </button>
          </div>
        ) : isDragActive && !isDragReject ? (
          /* Drag Over State */
          <div className="space-y-4">
            <div className="w-20 h-20 bg-[#1E3A5F] rounded-2xl flex items-center justify-center mx-auto animate-bounce">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <p className="text-[#1E3A5F] dark:text-blue-300 font-semibold text-xl">
              Drop it here!
            </p>
            <p className="text-blue-400 font-hindi">यहाँ छोड़ें!</p>
          </div>
        ) : isDragReject ? (
          /* Drag Reject State */
          <div className="space-y-4">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <p className="text-red-600 dark:text-red-400 font-semibold text-xl">
              File not supported
            </p>
          </div>
        ) : (
          /* Default Idle State */
          <div className="space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#1E3A5F] to-[#2d5986] rounded-3xl flex items-center justify-center mx-auto shadow-xl">
              <Upload className="w-12 h-12 text-white" />
            </div>

            <div>
              <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">
                Drop your policy here
              </p>
              <p className="text-[#FF6B35] font-hindi text-base mt-1">
                पॉलिसी यहाँ छोड़ें
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">
                or{" "}
                <span className="text-[#1E3A5F] dark:text-blue-400 font-semibold underline underline-offset-2">
                  browse to choose a file
                </span>
              </p>
            </div>

            {/* Accepted formats */}
            <div className="flex flex-wrap justify-center gap-2">
              {["PDF", "JPG", "PNG", "WebP"].map((fmt) => (
                <span
                  key={fmt}
                  className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300"
                >
                  {fmt}
                </span>
              ))}
              <span className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-semibold text-gray-500 dark:text-gray-400">
                Max 10MB
              </span>
            </div>
          </div>
        )}
      </div>

      {/* File Error */}
      {fileError && (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-red-600 dark:text-red-400 text-sm">{fileError}</p>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && !fileError && (
        <Button
          onClick={handleUpload}
          className="w-full bg-[#1E3A5F] hover:bg-[#152A46] text-white rounded-2xl h-14 text-base font-semibold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 gap-3"
        >
          <Upload className="w-5 h-5" />
          Analyze This Policy with AI
        </Button>
      )}

      {/* Supported Insurers */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Supported Insurers (and more)
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "LIC", "HDFC Life", "ICICI Prudential", "SBI Life",
            "Max Life", "Bajaj Allianz", "Tata AIA", "Star Health",
            "New India", "United India", "National Insurance",
          ].map((insurer) => (
            <span
              key={insurer}
              className="px-2.5 py-1 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-lg border border-gray-100 dark:border-gray-700"
            >
              {insurer}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}