"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/utils/cn";
import { X } from "lucide-react";

export interface ModalProps {
  /** Preferred API (Radix): controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Back-compat API. */
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";
  className?: string;
  showCloseButton?: boolean;
}

const sizeClasses: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  "2xl": "max-w-5xl",
  "3xl": "max-w-6xl",
  "4xl": "max-w-7xl",
  full: "max-w-[95vw] sm:max-w-[90vw]",
};

export function Modal({
  open,
  onOpenChange,
  isOpen,
  onClose,
  title,
  description,
  icon,
  children,
  size = "md",
  className,
}: ModalProps) {
  const resolvedOpen = open ?? isOpen ?? false;
  const resolvedOnOpenChange =
    onOpenChange ??
    ((next: boolean) => {
      if (!next) onClose?.();
    });
  return (
    <Dialog.Root open={resolvedOpen} onOpenChange={resolvedOnOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2",
            "rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "max-h-[90vh] overflow-y-auto",
            sizeClasses[size],
            className,
          )}
        >
          {(title || description) && (
            <div className="flex items-start justify-between p-4 sm:p-6 border-b border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-2">
                {icon && <span className="shrink-0">{icon}</span>}
                <div>
                {title && (
                  <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {description}
                  </Dialog.Description>
                )}
                </div>
              </div>
              <Dialog.Close className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="w-4 h-4" />
              </Dialog.Close>
            </div>
          )}
          <div className="p-4 sm:p-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
