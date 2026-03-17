"use client";

import React from "react";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useCustomRoles } from "@/hooks/api/useCustomRoles";
import { Card, Button, Badge, DataTable, type Column, Skeleton, EmptyState, ErrorBanner } from "@/components/ui";
import { Plus, Shield } from "lucide-react";
import type { CustomRoleDto } from "@/types/identity";

export default function SettingsRolesPage() {
  return (
    <ModuleGuard module="settings" requiredPermissions={[Permission.ROLES_READ]}>
      <RolesList />
    </ModuleGuard>
  );
}

function RolesList() {
  const { buildPath: path } = useTenantPath();
  const { data: roles, isLoading, error, refetch } = useCustomRoles();
  const list = (roles ?? []) as CustomRoleDto[];
  const columns: Column<Record<string, unknown>>[] = [
    { key: "displayName", title: "Rôle", render: (_, row) => { const r = row as unknown as CustomRoleDto; return <Link href={path(`/settings/roles/${r.id}`)} className="font-medium text-emerald-600 hover:underline">{r.displayName ?? r.name}</Link>; } },
    { key: "name", title: "Identifiant", render: (_, row) => (row as unknown as CustomRoleDto).name },
    { key: "permissions", title: "Permissions", render: (_, row) => ((row as unknown as CustomRoleDto).permissions ?? []).length },
    { key: "status", title: "Statut", render: (_, row) => <Badge variant="default" size="sm">{(row as unknown as CustomRoleDto).status ?? "—"}</Badge> },
  ];
  if (error) return (<div className="space-y-6"><ErrorBanner title="Erreur" message="Impossible de charger les rôles" onRetry={() => refetch()} /></div>);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Rôles</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{list.length} rôle(s)</p></div>
        <ProtectedAction permission={Permission.ROLES_CREATE}><Button asChild><Link href={path("/settings/roles/new")}><Plus className="w-4 h-4 mr-2" /> Nouveau rôle</Link></Button></ProtectedAction>
      </div>
      <Card>
        {isLoading ? <Skeleton className="h-48 w-full" /> : list.length === 0 ? <EmptyState icon={<Shield className="w-8 h-8 text-slate-400" />} title="Aucun rôle personnalisé" description="Créez un rôle." /> : <DataTable columns={columns} data={list as unknown as Record<string, unknown>[]} loading={false} rowKey={(row) => (row as unknown as CustomRoleDto).id} />}
      </Card>
    </div>
  );
}
