"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  match: string;
}

interface MobileBottomNavProps {
  tenantSlug: string;
}

export default function MobileBottomNav({ tenantSlug }: MobileBottomNavProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const basePath = `/tenant/${tenantSlug}`;

  const items: NavItem[] = [
    { href: `${basePath}/dashboard`, label: t("dashboard"), icon: LayoutDashboard, match: "/dashboard" },
    { href: `${basePath}/sales/pos`, label: t("sales"), icon: ShoppingCart, match: "/sales" },
    { href: `${basePath}/inventory`, label: t("inventory"), icon: Package, match: "/inventory" },
    { href: `${basePath}/patients`, label: t("patients"), icon: Users, match: "/patients" },
    { href: `${basePath}/settings`, label: t("settings"), icon: MoreHorizontal, match: "/settings" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_6px_-1px_rgb(0_0_0_/_0.05)]"
      style={{ height: "var(--bottom-nav-height)" }}
      role="navigation"
      aria-label="Navigation mobile"
    >
      <div className="flex items-center justify-around h-full px-1 max-w-lg mx-auto">
        {items.map(({ href, label, icon: Icon, match }) => {
          const isActive = pathname?.includes(match);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full px-1 transition-colors",
                "active:scale-95 touch-manipulation",
                isActive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200",
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-all",
                  isActive && "scale-110",
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn(
                "text-[10px] leading-tight",
                isActive ? "font-semibold" : "font-medium",
              )}>
                {label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
