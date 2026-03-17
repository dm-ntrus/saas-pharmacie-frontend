"use client";

import React from "react";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { useOrganization } from "@/context/OrganizationContext";
import { ArrowLeft, Building2 } from "lucide-react";

export default function SettingsOrganizationsPage() {
  return (
    <ModuleGuard module="settings" requiredPermissions={[Permission.ROLES_READ]}>
      <OrganizationsContent />
    </ModuleGuard>
  );
}

function OrganizationsContent() {
  const { buildPath: path } = useTenantPath();
  const { organizations } = useOrganization();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild><Link href={path("/settings")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link></Button>
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Organisations</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Branches et pharmacies</p></div>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5" /> Liste</CardTitle></CardHeader>
        <CardContent>{organizations.length === 0 ? <p className="text-sm text-slate-500">Aucune organisation.</p> : <ul className="space-y-2">{organizations.map((org: { id: string; name: string }) => (<li key={org.id} className="py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"><span className="font-medium">{org.name}</span></li>))}</ul>}</CardContent>
      </Card>
    </div>
  );
}
