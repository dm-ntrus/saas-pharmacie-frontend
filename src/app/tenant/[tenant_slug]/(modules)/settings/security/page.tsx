"use client";

import React from "react";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useAuth } from "@/context/AuthContext";
import { use2FAStatus } from "@/hooks/api/useIdentity";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { ArrowLeft, Lock, Shield } from "lucide-react";

export default function SettingsSecurityPage() {
  return (
    <ModuleGuard module="settings" requiredPermissions={[Permission.ROLES_READ]}>
      <SecurityContent />
    </ModuleGuard>
  );
}

function SecurityContent() {
  const { buildPath: path } = useTenantPath();
  const { user } = useAuth();
  const userId = (user as { id?: string; sub?: string })?.id ?? (user as { sub?: string })?.sub ?? "";
  const { data: status, isLoading } = use2FAStatus(userId || null);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild><Link href={path("/settings")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link></Button>
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sécurité</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">2FA et sessions</p></div>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5" /> 2FA</CardTitle></CardHeader>
        <CardContent>{isLoading ? <p className="text-sm text-slate-500">Chargement…</p> : status?.enabled ? <div className="flex items-center gap-2"><Badge variant="success">Activé</Badge></div> : <p className="text-sm text-slate-500">2FA non activée.</p>}</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" /> Sessions</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-slate-500">Gérez les sessions depuis le profil utilisateur.</p></CardContent>
      </Card>
    </div>
  );
}
