import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
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
  HeartIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  UserIcon,
  StarIcon,
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
  const router = useRouter();
  const { user, hasRole, hasPermission } = useAuth();
  // Temporary static notifications for demo
  const notifications: any[] = [];

  const navigation: NavItem[] = [
    {
      name: "Tableau de bord",
      href: "/dashboard",
      icon: HomeIcon,
    },
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
      badge: undefined, // notifications.filter((n: any) => n.type === 'prescription').length || undefined,
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
    // {
    //   name: "Prescriptions",
    //   href: "/modules/prescriptions",
    //   icon: ClipboardDocumentListIcon,
    //   requiredRoles: ["pharmacist", "admin"],
    //   badge: undefined, // notifications.filter((n: any) => n.type === 'prescription').length || undefined,
    // },
    // {
    //   name: "Rapports",
    //   href: "/modules/reports",
    //   icon: ChartBarIcon,
    //   requiredRoles: ["admin", "pharmacist"],
    // },
    // {
    //   name: "Facturation",
    //   href: "/modules/billing",
    //   icon: DocumentTextIcon,
    //   requiredRoles: ["admin", "accountant"],
    // },
    // {
    //   name: "Ressources Humaines",
    //   href: "/modules/hr",
    //   icon: UsersIcon,
    //   requiredRoles: ["hr_manager", "admin"],
    // },
    // {
    //   name: "Fidélité",
    //   href: "/modules/loyalty",
    //   icon: StarIcon,
    //   requiredRoles: ["marketing_manager", "admin"],
    // },
    // {
    //   name: "Assurance",
    //   href: "/modules/insurance",
    //   icon: ShieldCheckIcon,
    //   requiredRoles: ["insurance_manager", "admin"],
    // },
  ];

  const bottomNavigation: NavItem[] = [
    {
      name: "Profil",
      href: "/profile",
      icon: UserIcon,
    },
    {
      name: "Paramètres",
      href: "/modules/settings",
      icon: CogIcon,
      requiredRoles: ["admin"],
    },
  ];

  const isItemVisible = (item: NavItem) => {
    if (
      item.requiredRoles &&
      !item.requiredRoles.some((role) => hasRole(role))
    ) {
      return false;
    }
    if (
      item.requiredPermissions &&
      !item.requiredPermissions.some((permission) => hasPermission(permission))
    ) {
      return false;
    }
    return true;
  };

  const isCurrentPath = (href: string) => {
    if (href === "/dashboard") {
      return (
        router.pathname === "/dashboard" ||
        router.pathname === "/dashboard/tenant"
      );
    }
    return router.pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        {isOpen && (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-sky-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-xl font-bold">PharmaSaaS</span>
          </div>
        )}
         <button
          onClick={onClose}
          className="p-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          {isOpen ? (
            <>
              <ChevronLeftIcon className="h-5 w-5 hidden lg:flex" />
              <XMarkIcon className="h-5 w-5 flex lg:hidden"/>
            </>
          ) : (
            <Bars3Icon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* User Info */}
      {isOpen && user && (
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-sky-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </span>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user.roles?.[0]?.replace("_", " ")}
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
                {isOpen && (
                  <>
                    <span className="flex-1 ml-3">{item.name}</span>
                    {item.badge && (
                      <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600 text-white">
                        {item.badge}
                      </span>
                    )}
                  </>
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
