"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { normalizeToastMessage } from "@/lib/toast-safe";

export default function AppToaster() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure toast.error never receives non-renderable objects.
    const globalKey = "__toast_safe_patch_applied__";
    const w = window as unknown as Record<string, unknown>;
    if (!w[globalKey]) {
      const originalError = toast.error.bind(toast) as any;
      (toast as any).error = (message: unknown, ...rest: unknown[]) =>
        originalError(normalizeToastMessage(message), ...rest);
      w[globalKey] = true;
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#363636",
          color: "#fff",
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: "#4ade80",
            secondary: "#fff",
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
