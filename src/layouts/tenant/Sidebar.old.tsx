"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useOrganization } from "@/context/OrganizationContext";
import { useFeatureFlags } from "@/context/FeatureFlagContext";
import {
  HomeIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CogIcon,
  BeakerIcon,
  TruckIcon,
  StarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  BanknotesIcon,
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
  featureFlag?: string; // optional feature flag
  badge?: string | number;
}

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const params = useParams();
  const tenant_slug = params?.tenant_slug;
  const { currentOrganization, hasRole, hasPermission } = useOrganization();
  const { isFeatureEnabled } = useFeatureFlags();
  const [sidebarOpen, setSidebarOpen] = useState(isOpen);

  const basePath = tenant_slug ? `/tenant/${tenant_slug}` : "";

  const navigation: NavItem[] = [
    { name: "Tableau de bord", href: "/dashboard", icon: HomeIcon },
    {
      name: "Point de Vente",
      href: "/sales",
      icon: CurrencyDollarIcon,
      requiredRoles: ["cashier", "pharmacist", "admin"],
    },
    {
      name: "Inventaire",
      href: "/inventory",
      icon: BuildingStorefrontIcon,
      requiredRoles: ["technician", "pharmacist", "admin"],
    },
    {
      name: "Patients",
      href: "/patients",
      icon: UserGroupIcon,
      requiredRoles: ["pharmacist", "admin"],
    },
    {
      name: "Prescriptions",
      href: "/prescriptions",
      icon: ClipboardDocumentListIcon,
      requiredRoles: ["pharmacist", "admin"],
    },
    {
      name: "Laboratoire",
      href: "/laboratory",
      icon: BeakerIcon,
      requiredRoles: ["lab_technician", "pharmacist", "admin"],
    },
    {
      name: "Livraisons",
      href: "/delivery",
      icon: TruckIcon,
      requiredRoles: ["delivery_manager", "admin"],
    },
    {
      name: "Rapports",
      href: "/reports",
      icon: ChartBarIcon,
      requiredRoles: ["admin", "pharmacist"],
    },
    {
      name: "Facturation",
      href: "/billing",
      icon: DocumentTextIcon,
      requiredRoles: ["admin", "accountant"],
    },
    {
      name: "Ressources Humaines",
      href: "/hr",
      icon: UsersIcon,
      requiredRoles: ["hr_manager", "admin"],
    },
    {
      name: "Fidélité",
      href: "/loyalty",
      icon: StarIcon,
      requiredRoles: ["marketing_manager", "admin"],
      featureFlag: "loyalty_program",
    },
    {
      name: "Assurance",
      href: "/insurance",
      icon: ShieldCheckIcon,
      requiredRoles: ["insurance_manager", "admin"],
    },
    {
      name: "Comptabilité",
      href: "/accounting",
      icon: BanknotesIcon,
      requiredRoles: ["accountant", "admin"],
    },
  ];

  const bottomNavigation: NavItem[] = [
    { name: "Profil", href: "/profile", icon: UserIcon },
    {
      name: "Paramètres",
      href: "/settings",
      icon: CogIcon,
      requiredRoles: ["admin"],
    },
  ];

  const isItemVisible = (item: NavItem) => {
    if (item.requiredRoles && !item.requiredRoles.some((r) => hasRole(r)))
      return false;
    if (
      item.requiredPermissions &&
      !item.requiredPermissions.some((p) => hasPermission(p))
    )
      return false;
    if (item.featureFlag && !isFeatureEnabled(item.featureFlag)) return false;
    return true;
  };

  const isCurrentPath = (href: string) => pathname.startsWith(`${basePath}${href}`);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        {sidebarOpen && (
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold">MEDPharma</span>
          </div>
        )}
        <button
          onClick={onClose}
          className="p-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          {sidebarOpen ? (
            <>
              <ChevronLeftIcon className="h-5 w-5 hidden lg:flex" />
              <XMarkIcon className="h-5 w-5 flex lg:hidden" />
            </>
          ) : (
            <Bars3Icon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* User Info */}
      {sidebarOpen && currentOrganization && (
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-sky-600 rounded-full flex items-center justify-center text-sm font-medium">
              {currentOrganization.name[0]}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {currentOrganization.name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {currentOrganization.roles.join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.filter(isItemVisible).map((item) => {
          const isActive = isCurrentPath(item.href);
          return (
            <Link key={item.name} href={`${basePath}${item.href}`}>
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
                {sidebarOpen && (
                  <span className="ml-3 flex-1">{item.name}</span>
                )}
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
            <Link key={item.name} href={`${basePath}${item.href}`}>
              <div
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <item.icon className="mr-3 h-6 w-6" />
                {sidebarOpen && <span>{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </div>

      {sidebarOpen && (
        <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
          Version 1.0.0
        </div>
      )}
    </div>
  );
};

export default Sidebar;
