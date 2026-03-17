"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { Card, CardContent } from "@/components/ui";
import {
  Settings,
  Users,
  Building2,
  Shield,
  Sliders,
  ChevronRight,
} from "lucide-react";

const LINKS = [
  {
    href: "/settings/pharmacy-config",
    label: "Configuration pharmacie",
    description: "Paramètres par catégorie (inventaire, facturation, workflow, etc.)",
    icon: Sliders,
  },
  {
    href: "/settings/users",
    label: "Utilisateurs",
    description: "Gestion des comptes et invitations",
    icon: Users,
  },
  {
    href: "/settings/organizations",
    label: "Branches / Organisations",
    description: "Gestion des pharmacies et membres",
    icon: Building2,
  },
  {
    href: "/settings/roles",
    label: "Rôles et permissions",
    description: "Rôles personnalisés et matrice des permissions",
    icon: Shield,
  },
];

export default function SettingsPage() {
  return (
    <ModuleGuard
      module="settings"
      requiredPermissions={[Permission.ROLES_READ]}
    >
      <SettingsContent />
    </ModuleGuard>
  );
}

function SettingsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Paramètres
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Gestion des utilisateurs, rôles, configuration et sécurité
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {LINKS.map((item) => (
          <Card
            key={item.href}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(buildPath(item.href))}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {item.label}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {item.description}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
