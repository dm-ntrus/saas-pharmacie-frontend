"use client";

import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import useIsMobile from "@/hooks/useIsMobile";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface TenantLayoutProps {
  children: ReactNode;
}

export default function TenantLayout({ children }: TenantLayoutProps) {
  const isMobile = useIsMobile(1024);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Auto-close sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex h-screen">
        {/* Sidebar for Desktop - Fixed width transition */}
        <aside
          className={`hidden lg:block bg-gray-900 transition-all duration-300 ease-in-out ${
            sidebarOpen ? "w-64" : "w-[4.5rem]"
          }`}
        >
          <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
        </aside>

        {/* Mobile Sidebar - Overlay */}
        {isMobile && sidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
              onClick={closeSidebar}
            />

            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden">
              <Sidebar isOpen={true} onClose={closeSidebar} />
            </aside>
          </>
        )}

        {/* Contenu principal */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopBar onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />

          <main className="flex-1 overflow-y-auto">
            <div className="py-6">
              <div className="mx-auto px-4 sm:px-6">{children}</div>
            </div>
          </main>
        </div>
      </div>

      {/* Indicateur de statut WebSocket (en développement) */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            WS: Connecté
          </div>
        </div>
      )}
    </div>
  );
}
