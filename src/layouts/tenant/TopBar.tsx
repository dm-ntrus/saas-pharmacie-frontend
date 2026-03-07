"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppStore } from "@/store/appStore";
import { PlusCircle, Search, Bell } from "lucide-react";
import { Bars3Icon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

type TopBarProps = {
  onMenuClick: () => void;
  onCollapseClick: () => void;
  sidebarCollapsed: boolean;
  isMobile: boolean;
};

const TopBar: React.FC<TopBarProps> = ({
  onMenuClick,
  onCollapseClick,
  sidebarCollapsed,
  isMobile,
}) => {
  const params = useParams();
  const tenant_slug = params?.tenant_slug;
  const { notifications, theme, setTheme } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");

  const unreadNotifications = notifications.filter((n) => !n.read);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isDark = theme === "dark";

  const basePath = tenant_slug ? `/tenant/${tenant_slug}` : "";

  return (
    <header className="h-14 sm:h-16 shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 gap-2">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        {/* Mobile: hamburger | Desktop: collapse/expand sidebar */}
        <button
          onClick={isMobile ? onMenuClick : onCollapseClick}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors shrink-0"
          aria-label={
            isMobile
              ? "Ouvrir le menu"
              : sidebarCollapsed
                ? "Agrandir la barre latérale"
                : "Réduire la barre latérale"
          }
        >
          {isMobile ? (
            <Bars3Icon className="h-6 w-6" />
          ) : sidebarCollapsed ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" />
          )}
        </button>

        <div className="relative flex-1 max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-transparent rounded-full text-sm focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          aria-label={isDark ? "Mode clair" : "Mode sombre"}
          title={isDark ? "Mode clair" : "Mode sombre"}
        >
          {isDark ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </button>

        <button
          className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 relative transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifications.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
          )}
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-600 mx-1 hidden sm:block" />

        <Link
          href={`${basePath}/sales/new`}
          className="flex items-center gap-2 px-3 py-1.5 sm:py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          <span className="hidden xs:inline sm:inline">Nouvelle Vente</span>
        </Link>
      </div>
    </header>
  );
};

export default TopBar;
