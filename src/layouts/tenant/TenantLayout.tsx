"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useParams } from "next/navigation";
import useIsMobile from "@/hooks/useIsMobile";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MobileBottomNav from "./MobileBottomNav";
import { PageTransition } from "@/components/ui";
import { useAppStore } from "@/store/appStore";

interface TenantLayoutProps {
  children: ReactNode;
}

export default function TenantLayout({ children }: TenantLayoutProps) {
  const isMobile = useIsMobile(1024);
  const { theme } = useAppStore();
  const params = useParams();
  const tenantSlug = (params?.tenant_slug as string) || "";
  const [sidebarOverlayOpen, setSidebarOverlayOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setSidebarOverlayOpen(false);
    }
  }, [isMobile]);

  const toggleSidebarOverlay = () => {
    setSidebarOverlayOpen((prev) => !prev);
  };

  const closeSidebarOverlay = () => {
    if (isMobile) setSidebarOverlayOpen(false);
  };

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDark
          ? "bg-slate-900 text-slate-100"
          : "bg-slate-50 text-slate-900"
      } ${isDark ? "dark" : ""}`}
    >
      <div className="flex h-screen">
        {/* Desktop sidebar */}
        <aside
          className={`hidden lg:block shrink-0 transition-[width] duration-300 ease-in-out ${
            sidebarCollapsed ? "w-[4.5rem]" : "w-64"
          }`}
        >
          <Sidebar
            isCollapsed={sidebarCollapsed}
            isMobileOverlay={false}
            onCloseOverlay={closeSidebarOverlay}
          />
        </aside>

        {/* Mobile sidebar overlay */}
        {isMobile && sidebarOverlayOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={closeSidebarOverlay}
              aria-hidden="true"
            />
            <aside className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden">
              <Sidebar
                isCollapsed={false}
                isMobileOverlay
                onCloseOverlay={closeSidebarOverlay}
              />
            </aside>
          </>
        )}

        {/* Main content */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopBar
            onMenuClick={toggleSidebarOverlay}
            onCollapseClick={toggleSidebarCollapsed}
            sidebarCollapsed={sidebarCollapsed}
            isMobile={isMobile}
          />

          <main className={`flex-1 overflow-y-auto ${isMobile ? "has-bottom-nav" : ""}`}>
            <div className="py-4 sm:py-6">
              <div className="mx-auto px-3 sm:px-4 md:px-6 max-w-[1600px]">
                <PageTransition>
                  {children}
                </PageTransition>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      {isMobile && tenantSlug && <MobileBottomNav tenantSlug={tenantSlug} />}
    </div>
  );
}
