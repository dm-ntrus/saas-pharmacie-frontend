"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/context/OrganizationContext";
import { useFeatureFlags } from "@/context/FeatureFlagContext";
import {
  PlusCircle,
  LayoutDashboard,
  Package,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Building2,
  MapPin,
  ChevronDown,
} from "lucide-react";
import {
  BeakerIcon,
  TruckIcon,
  StarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  featureFlag?: string;
  badge?: string | number;
}

type SidebarProps = {
  isCollapsed: boolean;
  isMobileOverlay: boolean;
  onCloseOverlay: () => void;
};

function NavLinkWithTooltip({
  item,
  href,
  isActive,
  isCollapsed,
}: {
  item: NavItem;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
}) {
  const linkContent = (
    <>
      <item.icon
        className={`w-5 h-5 shrink-0 ${
          isActive ? "text-primary" : "text-slate-400 dark:text-slate-500"
        }`}
      />
      {!isCollapsed && (
        <span className="ml-2 flex-1 truncate">{item.name}</span>
      )}
      {isCollapsed && (
        <span className="absolute left-full ml-2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap bg-slate-800 dark:bg-slate-700 text-slate-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-[60] transition-all duration-150">
          {item.name}
        </span>
      )}
    </>
  );

  return (
    <Link
      href={href}
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
        isActive
          ? "bg-primary/10 text-primary dark:bg-primary/20"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-100"
      } ${isCollapsed ? "justify-center" : ""}`}
    >
      {linkContent}
    </Link>
  );
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  isMobileOverlay,
  onCloseOverlay,
}) => {
  const pathname = usePathname();
  const params = useParams();
  const tenant_slug = params?.tenant_slug;
  const { user, logout } = useAuth();
  const {
    currentOrganization,
    organizations,
    switchOrganization,
    hasRole,
    hasPermission,
  } = useOrganization();
  const { isFeatureEnabled } = useFeatureFlags();
  const [isOrgMenuOpen, setIsOrgMenuOpen] = useState(false);

  const basePath = tenant_slug ? `/tenant/${tenant_slug}` : "";

  const navigation: NavItem[] = [
    { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    {
      name: "Point de Vente",
      href: "/sales",
      icon: PlusCircle,
      requiredRoles: ["cashier", "pharmacist", "admin"],
    },
    {
      name: "Inventaire",
      href: "/inventory",
      icon: Package,
      requiredRoles: ["technician", "pharmacist", "admin"],
    },
    {
      name: "Patients",
      href: "/patients",
      icon: Users,
      requiredRoles: ["pharmacist", "admin"],
    },
    {
      name: "Prescriptions",
      href: "/prescriptions",
      icon: FileText,
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
      icon: BarChart3,
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
    {
      name: "Paramètres",
      href: "/settings",
      icon: Settings,
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

  const showLabel = !isCollapsed;

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700/50">
      {/* Header: logo + close (only on mobile overlay) */}
      <div className="flex items-center justify-between shrink-0 border-b border-slate-100 dark:border-slate-700/50 px-3 py-3">
        {showLabel && (
          <span className="font-display font-bold text-lg text-emerald-600 dark:text-emerald-400 tracking-tight truncate">
            Syntix<span className="text-slate-900 dark:text-slate-100">Pharma</span>
          </span>
        )}
        {isMobileOverlay && (
          <button
            onClick={onCloseOverlay}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Fermer le menu"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Organization Switcher */}
      <div className="relative shrink-0">
        <button
          onClick={() => setIsOrgMenuOpen(!isOrgMenuOpen)}
          className={`w-full flex items-center gap-2 rounded-lg px-2 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          {showLabel && (
            <>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  {currentOrganization?.name || "Sélectionner"}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 transition-transform ${
                  isOrgMenuOpen ? "rotate-180" : ""
                }`}
              />
            </>
          )}
        </button>

        {isOrgMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOrgMenuOpen(false)}
              aria-hidden="true"
            />
            <div
              className={`absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200 ${
                isCollapsed ? "left-full ml-2" : "w-full"
              }`}
              style={isCollapsed ? { minWidth: "12rem" } : undefined}
            >
              <p className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 mb-1">
                Vos Branches
              </p>
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    switchOrganization(org.id);
                    setIsOrgMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    currentOrganization?.id === org.id
                      ? "bg-primary/10 text-primary dark:bg-primary/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <MapPin
                    className={`w-4 h-4 shrink-0 ${
                      currentOrganization?.id === org.id
                        ? "text-primary"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  />
                  <span className="font-medium truncate">{org.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto min-h-0">
        {navigation.filter(isItemVisible).map((item) => {
          const href = `${basePath}${item.href}`;
          const isActive =
            pathname === href ||
            (item.href !== "/dashboard" && pathname.startsWith(href));
          return (
            <NavLinkWithTooltip
              key={item.name}
              item={item}
              href={href}
              isActive={isActive}
              isCollapsed={isCollapsed}
            />
          );
        })}
      </nav>

      {/* Bottom: user + logout */}
      <div className="p-2 border-t border-slate-100 dark:border-slate-700/50 shrink-0">
        {showLabel ? (
          <>
            <div className="flex items-center gap-3 px-2 py-1 mb-1">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-200 text-xs font-bold shrink-0">
                {user?.name?.[0]}
                {user?.family_name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {user?.name} {user?.family_name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              Déconnexion
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-200 text-xs font-bold"
              title={user ? `${user.name} ${user.family_name}` : ""}
            >
              {user?.name?.[0]}
              {user?.family_name?.[0]}
            </div>
            <button
              onClick={logout}
              className="relative group p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              aria-label="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
              <span className="absolute left-full ml-2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap bg-slate-800 dark:bg-slate-700 text-slate-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-[60]">
                Déconnexion
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
