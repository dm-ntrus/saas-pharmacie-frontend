"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/context/OrganizationContext";
import { useFeatureFlags } from "@/context/FeatureFlagContext";
import { motion } from 'motion/react';
import { 
  PlusCircle, 
  LayoutDashboard, 
  Package, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronRight,
  Search,
  Bell,
  Building2,
  MapPin,
  ChevronDown
} from 'lucide-react';
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
  const { user, logout } = useAuth();
  const { currentOrganization, organizations, switchOrganization, hasRole, hasPermission } = useOrganization();
  const { isFeatureEnabled } = useFeatureFlags();
  const [sidebarOpen, setSidebarOpen] = useState(isOpen);
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

  const bottomNavigation: NavItem[] = [
    { name: "Profil", href: "/profile", icon: UserIcon },
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

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        {sidebarOpen && (
          <div className="flex items-center space-x-3">
            <span className="font-display font-bold text-xl text-emerald-600 tracking-tight">
              Syntix<span className="text-slate-900">Pharma</span>
            </span>
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

      {/* organization Switcher */}
      <div className="relative">
            <button 
              onClick={() => setIsOrgMenuOpen(!isOrgMenuOpen)}
              className="w-full flex items-center gap-2 px-2 py-2 bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-100 group-hover:text-primary transition-colors">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left min-w-0">
                {/* <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Branche</p> */}
                <p className="text-sm font-bold text-slate-900 truncate">{currentOrganization?.name || 'Sélectionner'}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOrgMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOrgMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsOrgMenuOpen(false)}
                ></div>
                <div className="absolute top-full left-0 w-full mt-0 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <p className="px-2 py-1 text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">
                    Vos Branches
                  </p>
                  {organizations.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => {
                        switchOrganization(org.id);
                        setIsOrgMenuOpen(false);
                      }}
                      className={`w-full cursor-pointer flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                        currentOrganization?.id === org.id 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <MapPin className={`w-4 h-4 ${currentOrganization?.id === org.id ? 'text-primary' : 'text-slate-400'}`} />
                      <div className="text-left">
                        <p className="font-bold">{org.name}</p>
                        {/* <p className="text-[10px] opacity-70">{org.city}</p> */}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
        {navigation.filter(isItemVisible).map((item) => {
          const href = `${basePath}${item.href}`;
          const isActive = pathname === href || (item.href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link key={item.name}
            href={href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-primary/10 text-primary' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}>
                 <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                 {sidebarOpen && <span className="ml-2 flex-1">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-2 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 py-1 mb-1">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">
              {user?.name?.[0]}{user?.family_name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.name} {user?.family_name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
    </div>
  );
};

export default Sidebar;
