"use client";

import React from "react";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { ArrowLeft, FileText } from "lucide-react";

export default function SettingsAuditPage() {
  return (
    <ModuleGuard module="settings" requiredPermissions={[Permission.ROLES_READ]}>
      <AuditContent />
    </ModuleGuard>
  );
}

function AuditContent() {
  const { buildPath: path } = useTenantPath();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild><Link href={path("/settings")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link></Button>
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Audit des rôles</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Historique des modifications</p></div>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Historique</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-slate-500">Audit disponible via l&apos;API backend. Consultez les endpoints d&apos;audit des rôles.</p></CardContent>
      </Card>
    </div>
  );
}
