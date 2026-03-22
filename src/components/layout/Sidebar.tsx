"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Home, Users, Store, UserRound, ClipboardList, DollarSign,
  BarChart2, Settings, FlaskConical, Truck, FileText, Shield,
  Landmark, Star, User, Menu, X, ChevronLeft,
} from "lucide-react";

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
  const { user, hasRole, hasPermission } = useAuth();

  const navigation: NavItem[] = [
    { name: "Tableau de bord", href: "/dashboard", icon: Home },
    { name: "Point de Vente", href: "/sales", icon: DollarSign, requiredRoles: ["cashier", "pharmacist", "admin"] },
    { name: "Inventaire", href: "/inventory", icon: Store, requiredRoles: ["technician", "pharmacist", "admin"] },
    { name: "Patients", href: "/patients", icon: UserRound, requiredRoles: ["pharmacist", "admin"] },
    { name: "Prescriptions", href: "/prescriptions", icon: ClipboardList, requiredRoles: ["pharmacist", "admin"] },
    { name: "Laboratoire", href: "/laboratory", icon: FlaskConical, requiredRoles: ["lab_technician", "pharmacist", "admin"] },
    { name: "Livraisons", href: "/delivery", icon: Truck, requiredRoles: ["delivery_manager", "admin"] },
    { name: "Rapports", href: "/reports", icon: BarChart2, requiredRoles: ["admin", "pharmacist"] },
    { name: "Facturation", href: "/billing", icon: FileText, requiredRoles: ["admin", "accountant"] },
    { name: "Ressources Humaines", href: "/hr", icon: Users, requiredRoles: ["hr_manager", "admin"] },
    { name: "Fidélité", href: "/loyalty", icon: Star, requiredRoles: ["marketing_manager", "admin"] },
    { name: "Assurance", href: "/insurance", icon: Shield, requiredRoles: ["insurance_manager", "admin"] },
    { name: "Comptabilité", href: "/accounting", icon: Landmark, requiredRoles: ["accountant", "admin"] },
  ];

  const bottomNavigation: NavItem[] = [
    { name: "Profil", href: "/profile", icon: User },
    { name: "Paramètres", href: "/modules/settings", icon: Settings, requiredRoles: ["admin"] },
  ];

  const isItemVisible = (item: NavItem) => {
    if (item.requiredRoles && !item.requiredRoles.some((role) => hasRole(role))) return false;
    if (item.requiredPermissions && !item.requiredPermissions.some((p) => hasPermission(p))) return false;
    return true;
  };

  const isCurrentPath = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname === "/dashboard/tenant";
    return pathname?.startsWith(href) ?? false;
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        {isOpen && (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-sky-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-xl font-bold">PharmaSaaS</span>
          </div>
        )}
        <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-800 transition-colors">
          {isOpen ? (
            <>
              <ChevronLeft className="h-5 w-5 hidden lg:flex" />
              <X className="h-5 w-5 flex lg:hidden" />
            </>
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {isOpen && user && (
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-sky-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </span>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-400 truncate">{user.roles?.[0]?.replace("_", " ")}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.filter(isItemVisible).map((item) => {
          const isActive = isCurrentPath(item.href);
          return (
            <Link key={item.name} href={item.href}>
              <div className={`group flex items-center pl-3 pr-2 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}>
                <item.icon className={`flex-shrink-0 h-6 w-6 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-300"}`} />
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

      <div className="border-t border-gray-700 p-2 space-y-1">
        {bottomNavigation.filter(isItemVisible).map((item) => {
          const isActive = isCurrentPath(item.href);
          return (
            <Link key={item.name} href={item.href}>
              <div className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}>
                <item.icon className={`mr-3 flex-shrink-0 h-6 w-6 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-300"}`} />
                {isOpen && <span>{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </div>

      {isOpen && (
        <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
          Version 1.0.0
        </div>
      )}
    </div>
  );
};

export default Sidebar;
