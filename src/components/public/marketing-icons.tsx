"use client";

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Syringe,
  Truck,
  Receipt,
  Wallet,
  BookOpen,
  Building2,
  GitBranch,
  ShieldCheck,
  Handshake,
  Sheet,
  UserCog,
  BarChart3,
  Bell,
  PieChart,
  Gift,
  ScrollText,
  Settings,
} from "lucide-react";
import type { ModuleIconKey } from "@/content/platform-marketing";

const MAP: Record<ModuleIconKey, LucideIcon> = {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Syringe,
  Truck,
  Receipt,
  Wallet,
  BookOpen,
  Building2,
  GitBranch,
  ShieldCheck,
  Handshake,
  Sheet,
  UserCog,
  BarChart3,
  Bell,
  PieChart,
  Gift,
  ScrollText,
  Settings,
};

export function MarketingIcon({
  name,
  className,
}: {
  name: ModuleIconKey;
  className?: string;
}) {
  const Icon = MAP[name];
  return <Icon className={className} aria-hidden />;
}
