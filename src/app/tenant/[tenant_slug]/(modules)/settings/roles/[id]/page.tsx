"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useCustomRoleById, useCustomRolePermissions } from "@/hooks/api/useCustomRoles";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Skeleton, ErrorBanner } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

export default function RoleDetailPage() {
  return (
    <ModuleGuard module="settings" requiredPermissions={[Permission.ROLES_READ]}>
      <RoleDetail />
    </ModuleGuard>
  );
}

function RoleDetail() {
  const params = useParams();
  const { buildPath: path } = useTenantPath();
  const id = (params?.id as string) ?? "";
  const { data: role, isLoading, error, refetch } = useCustomRoleById(id);
  const { data: perms } = useCustomRolePermissions(id);

  if (error) return (<div className="space-y-6"><Button variant="ghost" size="sm" asChild><Link href={path("/settings/roles")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link></Button><ErrorBanner title="Erreur" message="Impossible de charger le rôle" onRetry={() => refetch()} /></div>);
  if (isLoading || !role) return <Skeleton className="h-64 w-full" />;

  const r = role as { id: string; name: string; displayName?: string; description?: string; permissions?: string[]; status?: string };
  const permissions = (perms as { permissions?: string[] })?.permissions ?? r.permissions ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild><Link href={path("/settings/roles")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link></Button>
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{r.displayName ?? r.name}</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{r.name} <Badge variant="default" size="sm">{r.status ?? "—"}</Badge></p></div>
      </div>
      {r.description && <Card><CardContent className="pt-6"><p className="text-sm text-slate-600 dark:text-slate-400">{r.description}</p></CardContent></Card>}
      <Card><CardHeader><CardTitle>Permissions ({permissions.length})</CardTitle></CardHeader><CardContent><ul className="text-xs max-h-96 overflow-auto space-y-1 font-mono">{permissions.map((p) => (<li key={p} className="text-slate-600 dark:text-slate-400">{p}</li>))}</ul></CardContent></Card>
    </div>
  );
}
