"use client";

import React, { useState } from "react";
import { useAppStore, useNotificationCount } from "@/store/appStore";
import { usePermissions } from "@/hooks/usePermissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "@/lib/i18n-simple";
import {
  PlusCircle,
  Search,
  Bell,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
} from "lucide-react";

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
  const tCommon = useTranslations("common");
  const tSales = useTranslations("sales");
  const tNotifications = useTranslations("notifications");
  const tTenant = useTranslations("tenantLayout");
  const { theme, setTheme } = useAppStore();
  const unreadCount = useNotificationCount();
  const { hasPermission } = usePermissions();
  const { buildPath } = useTenantPath();
  const [searchQuery, setSearchQuery] = useState("");

  const isDark = theme === "dark";

  return (
    <header className="h-14 sm:h-16 shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 gap-2">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        <button
          onClick={isMobile ? onMenuClick : onCollapseClick}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400 transition-colors shrink-0"
          aria-label={isMobile ? tCommon("actions") : tCommon("actions")}
        >
          {isMobile ? (
            <Menu className="h-5 w-5" />
          ) : sidebarCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>

        <div className="relative flex-1 max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={tCommon("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-transparent rounded-full text-sm focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400 transition-colors"
          aria-label={isDark ? tTenant("lightMode") : tTenant("darkMode")}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <Link
          href={buildPath("/notifications")}
          className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 relative transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label={tNotifications("title")}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
          )}
        </Link>

        {hasPermission(Permission.SALES_CREATE) && (
          <>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-600 mx-1 hidden sm:block" />
            <Link
              href={buildPath("/sales/new")}
              className="flex items-center gap-2 px-3 py-1.5 sm:py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shrink-0"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{tSales("newSale")}</span>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default TopBar;
