"use client";

import React, { useState, useRef, useCallback } from "react";
import { cn } from "@/utils/cn";
import { Upload, X, File as FileIcon, Image } from "lucide-react";

export interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  onChange?: (files: File[]) => void;
  multiple?: boolean;
  preview?: boolean;
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
}

interface FileWithPreview {
  file: File;
  previewUrl?: string;
}

export function FileUpload({
  accept,
  maxSize = 10 * 1024 * 1024,
  onChange,
  multiple = false,
  preview = true,
  label,
  error,
  className,
  disabled = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    (incoming: FileList | File[]) => {
      const valid: FileWithPreview[] = [];
      setSizeError(null);

      Array.from(incoming).forEach((file) => {
        if (file.size > maxSize) {
          setSizeError(
            `"${file.name}" dépasse la taille maximale (${formatSize(maxSize)})`,
          );
          return;
        }

        const previewUrl = file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined;

        valid.push({ file, previewUrl });
      });

      const next = multiple ? [...files, ...valid] : valid.slice(0, 1);
      setFiles(next);
      onChange?.(next.map((f) => f.file));
    },
    [files, maxSize, multiple, onChange],
  );

  const removeFile = (index: number) => {
    const removed = files[index];
    if (removed.previewUrl) URL.revokeObjectURL(removed.previewUrl);

    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    onChange?.(next.map((f) => f.file));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;
    if (e.dataTransfer.files?.length) processFiles(e.dataTransfer.files);
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors",
          dragActive
            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
            : "border-slate-300 bg-slate-50 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:border-slate-500",
          disabled && "opacity-50 pointer-events-none",
          (error || sizeError) && "border-red-300 dark:border-red-600",
        )}
      >
        <Upload
          className={cn(
            "h-8 w-8",
            dragActive
              ? "text-emerald-500"
              : "text-slate-400 dark:text-slate-500",
          )}
        />
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Glissez vos fichiers ici ou{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              parcourir
            </span>
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {accept ? `Formats: ${accept}` : "Tous les formats"} — Max{" "}
            {formatSize(maxSize)}
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files?.length && processFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {(error || sizeError) && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400">
          {error || sizeError}
        </p>
      )}

      {preview && files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((f, i) => (
            <li
              key={`${f.file.name}-${i}`}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800"
            >
              {f.previewUrl ? (
                <img
                  src={f.previewUrl}
                  alt={f.file.name}
                  className="h-10 w-10 rounded object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-100 dark:bg-slate-700">
                  {f.file.type.startsWith("image/") ? (
                    <Image className="h-5 w-5 text-slate-400" />
                  ) : (
                    <FileIcon className="h-5 w-5 text-slate-400" />
                  )}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                  {f.file.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatSize(f.file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
