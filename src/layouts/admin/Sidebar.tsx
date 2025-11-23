"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import {
  UsersIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  CogIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  badge?: string | number;
}

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { hasAdminPermission } = useAdmin();

  const navigation: NavItem[] = [
    {
      name: "Utilisateurs",
      href: "/admin/users",
      icon: UsersIcon,
      requiredPermissions: ["manage_users"],
    },
    {
      name: "Tenants",
      href: "/admin/tenants",
      icon: BuildingStorefrontIcon,
      requiredPermissions: ["manage_tenants"],
    },
    {
      name: "Rapports",
      href: "/admin/reports",
      icon: ChartBarIcon,
      requiredPermissions: ["view_reports"],
    },
  ];

  const bottomNavigation: NavItem[] = [
    { name: "Profil", href: "/admin/profile", icon: UserIcon },
    {
      name: "Paramètres",
      href: "/admin/settings",
      icon: CogIcon,
      requiredPermissions: ["manage_settings"],
    },
  ];

  const isItemVisible = (item: NavItem) => {
    if (
      item.requiredPermissions &&
      !item.requiredPermissions.some((p) => hasAdminPermission(p))
    ) {
      return false;
    }
    return true;
  };

  const isCurrentPath = (href: string) =>
    href === "/dashboard"
      ? pathname.startsWith("/dashboard")
      : pathname.startsWith(href);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        {isOpen && (
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold">MEDPharma</span>
          </div>
        )}
        <button
          onClick={onClose}
          className="p-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          {isOpen ? (
            <>
              <ChevronLeftIcon className="h-5 w-5 hidden lg:flex" />
              <XMarkIcon className="h-5 w-5 flex lg:hidden" />
            </>
          ) : (
            <Bars3Icon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.filter(isItemVisible).map((item) => {
          const isActive = isCurrentPath(item.href);
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`group flex items-center pl-3 pr-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <item.icon
                  className={`flex-shrink-0 h-6 w-6 ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gray-300"
                  }`}
                />
                {isOpen && <span className="ml-3 flex-1">{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-700 p-2 space-y-1">
        {bottomNavigation.filter(isItemVisible).map((item) => {
          const isActive = isCurrentPath(item.href);
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-6 w-6 ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gray-300"
                  }`}
                />
                {isOpen && <span>{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Version */}
      {isOpen && (
        <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
          Version 1.0.0
        </div>
      )}
    </div>
  );
};

export default Sidebar;
