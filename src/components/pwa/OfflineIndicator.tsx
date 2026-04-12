"use client";

import React, { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { useTranslations } from "@/lib/i18n-simple";

export function OfflineIndicator() {
  const t = useTranslations("layout.pwa");
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnect, setShowReconnect] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnect(true);
      setTimeout(() => setShowReconnect(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnect(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline && !showReconnect) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[60] py-2 px-4 text-center text-sm font-medium transition-colors ${
        isOnline
          ? "bg-emerald-500 text-white"
          : "bg-amber-500 text-white"
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>{t("reconnected")}</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>{t("offlineMessage")}</span>
          </>
        )}
      </div>
    </div>
  );
}
