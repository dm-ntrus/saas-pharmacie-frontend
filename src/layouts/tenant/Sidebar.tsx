"use client";

import React, { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/context/OrganizationContext";
import { useFeatureFlags } from "@/context/FeatureFlagContext";
import { usePermissions } from "@/hooks/usePermissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { PRODUCT_ENTITLEMENT_KEYS } from "@/constants/product-entitlement-keys";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Building2,
  MapPin,
  ChevronDown,
  Receipt,
  UserCog,
  TruckIcon,
  Shield,
  Syringe,
  Factory,
  ClipboardCheck,
  Bell,
  CreditCard,
  PieChart,
  Stethoscope,
  X,
  TrendingUp,
  ScrollText,
  Star,
  ClipboardList,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  moduleKey?: string;
  requiredPermissions?: Permission[];
  featureFlag?: string;
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
  return (
    <Link
      href={href}
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
        isActive
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-100"
      } ${isCollapsed ? "justify-center" : ""}`}
    >
      <item.icon
        className={`w-5 h-5 shrink-0 ${
          isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
        }`}
      />
      {!isCollapsed && <span className="ml-1 flex-1 truncate">{item.name}</span>}
      {isCollapsed && (
        <span className="absolute left-full ml-2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap bg-slate-800 dark:bg-slate-700 text-slate-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-[60] transition-all duration-150">
          {item.name}
        </span>
      )}
    </Link>
  );
}

const NAVIGATION: NavItem[] = [
  {
    name: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_DASHBOARD,
  },
  {
    name: "Point de Vente",
    href: "/sales",
    icon: ShoppingCart,
    moduleKey: "sales",
    requiredPermissions: [Permission.SALES_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_SALES,
  },
  {
    name: "Inventaire",
    href: "/inventory",
    icon: Package,
    moduleKey: "inventory",
    requiredPermissions: [Permission.INVENTORY_ITEMS_READ, Permission.PRODUCTS_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_INVENTORY,
  },
  {
    name: "Patients",
    href: "/patients",
    icon: Users,
    moduleKey: "patients",
    requiredPermissions: [Permission.PATIENTS_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_PATIENTS,
  },
  {
    name: "Prescriptions",
    href: "/prescriptions",
    icon: FileText,
    moduleKey: "prescriptions",
    requiredPermissions: [Permission.PRESCRIPTIONS_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_PRESCRIPTIONS,
  },
  {
    name: "Vaccination",
    href: "/vaccination",
    icon: Syringe,
    moduleKey: "vaccination",
    requiredPermissions: [Permission.VACCINATION_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_VACCINATION,
  },
  {
    name: "Livraisons",
    href: "/delivery",
    icon: TruckIcon,
    moduleKey: "delivery",
    requiredPermissions: [Permission.DELIVERY_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_DELIVERY,
  },
  {
    name: "Facturation",
    href: "/billing",
    icon: Receipt,
    moduleKey: "billing",
    requiredPermissions: [Permission.INVOICES_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_BILLING_OPERATIONS,
  },
  {
    name: "Paiements",
    href: "/billing/payments",
    icon: CreditCard,
    moduleKey: "billing",
    requiredPermissions: [Permission.PAYMENTS_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_BILLING_OPERATIONS,
  },
  {
    name: "Comptabilité",
    href: "/accounting",
    icon: PieChart,
    moduleKey: "accounting",
    requiredPermissions: [Permission.ACCOUNTING_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_ACCOUNTING,
  },
  {
    name: "Fournisseurs",
    href: "/suppliers",
    icon: Factory,
    moduleKey: "suppliers",
    requiredPermissions: [Permission.SUPPLIERS_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_SUPPLIERS,
  },
  {
    name: "Supply Chain",
    href: "/supply-chain",
    icon: Package,
    moduleKey: "supply-chain",
    requiredPermissions: [Permission.SUPPLY_CHAIN_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_SUPPLY_CHAIN,
  },
  {
    name: "Commandes d'achat",
    href: "/supply-chain/purchase-orders",
    icon: ShoppingCart,
    moduleKey: "supply-chain",
    requiredPermissions: [Permission.SUPPLY_CHAIN_READ, Permission.PURCHASE_ORDERS_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_SUPPLY_CHAIN,
  },
  {
    name: "Demandes d'achat",
    href: "/supply-chain/purchase-requests",
    icon: ClipboardList,
    moduleKey: "supply-chain",
    requiredPermissions: [Permission.SUPPLY_CHAIN_READ, Permission.PURCHASE_ORDERS_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_SUPPLY_CHAIN,
  },
  {
    name: "Devis fournisseurs",
    href: "/supply-chain/supplier-quotes",
    icon: ScrollText,
    moduleKey: "supply-chain",
    requiredPermissions: [Permission.SUPPLY_CHAIN_READ, Permission.PURCHASE_ORDERS_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_SUPPLY_CHAIN,
  },
  {
    name: "Prévisions",
    href: "/supply-chain/forecasts",
    icon: BarChart3,
    moduleKey: "supply-chain",
    requiredPermissions: [Permission.SUPPLY_CHAIN_READ, Permission.DEMAND_FORECASTS_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_SUPPLY_CHAIN,
  },
  {
    name: "Politiques stock",
    href: "/supply-chain/policies",
    icon: Shield,
    moduleKey: "supply-chain",
    requiredPermissions: [Permission.SUPPLY_CHAIN_READ, Permission.INVENTORY_POLICIES_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_SUPPLY_CHAIN,
  },
  {
    name: "Performance fournisseurs",
    href: "/supply-chain/performance",
    icon: TrendingUp,
    moduleKey: "supply-chain",
    requiredPermissions: [Permission.SUPPLY_CHAIN_READ, Permission.SUPPLIER_PERFORMANCE_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_SUPPLY_CHAIN,
  },
  {
    name: "Alertes Supply Chain",
    href: "/supply-chain/alerts",
    icon: Bell,
    moduleKey: "supply-chain",
    requiredPermissions: [Permission.SUPPLY_CHAIN_READ, Permission.SUPPLY_CHAIN_ALERTS_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_SUPPLY_CHAIN,
  },
  {
    name: "Qualité",
    href: "/quality",
    icon: ClipboardCheck,
    moduleKey: "quality",
    requiredPermissions: [Permission.QUALITY_EVENTS_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_QUALITY,
  },
  {
    name: "Assurance",
    href: "/insurance",
    icon: Shield,
    moduleKey: "insurance",
    requiredPermissions: [Permission.INSURANCE_PROVIDERS_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_INSURANCE,
  },
  {
    name: "E-Facture",
    href: "/e-invoice",
    icon: FileText,
    moduleKey: "e-invoice",
    requiredPermissions: [Permission.FISCAL_INVOICES_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_E_INVOICE,
  },
  {
    name: "Ressources Humaines",
    href: "/hr",
    icon: UserCog,
    moduleKey: "hr",
    requiredPermissions: [Permission.EMPLOYEES_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_HR,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    moduleKey: "analytics",
    requiredPermissions: [Permission.BI_READ, Permission.ANALYTICS_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_ANALYTICS,
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
    moduleKey: "notifications",
    requiredPermissions: [Permission.NOTIFICATIONS_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_NOTIFICATIONS,
  },
  {
    name: "Rapports",
    href: "/reports",
    icon: Stethoscope,
    moduleKey: "analytics",
    requiredPermissions: [Permission.BI_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_REPORTS,
  },
  {
    name: "Fidélité",
    href: "/loyalty",
    icon: Star,
    moduleKey: "loyalty",
    requiredPermissions: [Permission.LOYALTY_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_LOYALTY,
  },
  {
    name: "Journal métier",
    href: "/compliance/business-audit",
    icon: ScrollText,
    moduleKey: "audit-events",
    requiredPermissions: [Permission.TENANT_AUDIT_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_COMPLIANCE_AUDIT,
  },
  {
    name: "Paramètres",
    href: "/settings",
    icon: Settings,
    moduleKey: "settings",
    requiredPermissions: [Permission.ROLES_READ],
    featureFlag: PRODUCT_ENTITLEMENT_KEYS.MODULE_SETTINGS,
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  isMobileOverlay,
  onCloseOverlay,
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { currentOrganization, organizations, switchOrganization } =
    useOrganization();
  const { isFeatureEnabled } = useFeatureFlags();
  const { hasAnyPermission } = usePermissions();
  const { basePath } = useTenantPath();
  const [isOrgMenuOpen, setIsOrgMenuOpen] = useState(false);

  const isItemVisible = (item: NavItem) => {
    if (item.requiredPermissions && item.requiredPermissions.length > 0) {
      if (!hasAnyPermission(item.requiredPermissions)) return false;
    }
    if (item.featureFlag && !isFeatureEnabled(item.featureFlag)) return false;
    return true;
  };

  const showLabel = !isCollapsed;

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700/50">
      {/* Header */}
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
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Organization Switcher */}
      <div className="relative shrink-0 px-2 pt-2">
        <button
          onClick={() => setIsOrgMenuOpen(!isOrgMenuOpen)}
          className={`w-full flex items-center gap-2 rounded-lg px-2 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          {showLabel && (
            <>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  {currentOrganization?.name || "Sélectionner"}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
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
              <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 mb-1">
                Vos pharmacies
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
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <MapPin
                    className={`w-4 h-4 shrink-0 ${
                      currentOrganization?.id === org.id
                        ? "text-emerald-600"
                        : "text-slate-400"
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
        {NAVIGATION.filter(isItemVisible).map((item) => {
          const safePathname = pathname ?? "";
          const href = `${basePath}${item.href}`;
          const isActive =
            safePathname === href ||
            (item.href !== "/dashboard" && safePathname.startsWith(href));
          return (
            <NavLinkWithTooltip
              key={item.href}
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
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 text-xs font-bold shrink-0">
                {user?.given_name?.[0]}
                {user?.family_name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {user?.given_name} {user?.family_name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
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
              className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 text-xs font-bold"
              title={user ? `${user.given_name} ${user.family_name}` : ""}
            >
              {user?.given_name?.[0]}
              {user?.family_name?.[0]}
            </div>
            <button
              onClick={logout}
              className="relative group p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              aria-label="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
              <span className="absolute left-full ml-2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap bg-slate-800 text-slate-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-[60]">
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
