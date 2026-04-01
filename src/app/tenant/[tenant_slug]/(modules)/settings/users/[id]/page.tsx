"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useIdentityUserById, useEnableIdentityUser, useDisableIdentityUser } from "@/hooks/api/useIdentity";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Skeleton, ErrorBanner } from "@/components/ui";
import { formatDateTime } from "@/utils/formatters";
import { ArrowLeft, Shield, Lock } from "lucide-react";

const STATUS_LABELS: Record<string, string> = { active: "Actif", inactive: "Inactif", suspended: "Suspendu", pending_verification: "En attente", archived: "Archivé" };

export default function UserDetailPage() {
  return (
    <ModuleGuard module="settings" requiredPermissions={[Permission.ROLES_READ]}>
      <UserDetail />
    </ModuleGuard>
  );
}

function UserDetail() {
  const params = useParams();
  const { buildPath: path } = useTenantPath();
  const id = (params?.id as string) ?? "";
  const { data: user, isLoading, error, refetch } = useIdentityUserById(id);
  const enableUser = useEnableIdentityUser();
  const disableUser = useDisableIdentityUser();

  if (error) return (<div className="space-y-6"><Button variant="ghost" size="sm" asChild><Link href={path("/settings/users")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link></Button><ErrorBanner title="Erreur" message="Impossible de charger l'utilisateur" onRetry={() => refetch()} /></div>);
  if (isLoading || !user) return <Skeleton className="h-64 w-full" />;

  const u = user as { id: string; fullName?: string; email?: string; status?: string; roles?: string[]; organizations?: { id: string; name: string; roles: string[] }[]; activeSessions?: number; lastLoginAt?: string; mfaEnabled?: boolean };
  const isActive = u.status === "active";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild><Link href={path("/settings/users")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link></Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{u.fullName ?? u.email}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
              {u.email}{" "}
              <Badge variant={isActive ? "success" : "default"} size="sm">
                {STATUS_LABELS[u.status ?? ""] ?? u.status}
              </Badge>{" "}
              {u.mfaEnabled && (
                <span title="2FA activé">
                  <Lock className="w-4 h-4 text-emerald-600" />
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild><Link href={path(`/settings/users/${id}/permissions`)}><Shield className="w-4 h-4 mr-1" /> Permissions</Link></Button>
          {isActive ? <Button variant="outline" size="sm" onClick={() => disableUser.mutate(id)} disabled={disableUser.isPending}>Désactiver</Button> : <Button variant="outline" size="sm" onClick={() => enableUser.mutate(id)} disabled={enableUser.isPending}>Activer</Button>}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle>Informations</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><p><span className="text-slate-500">Dernière connexion :</span> {formatDateTime(u.lastLoginAt as string) || "—"}</p><p><span className="text-slate-500">Sessions actives :</span> {u.activeSessions ?? 0}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Rôles</CardTitle></CardHeader><CardContent><div className="flex flex-wrap gap-2">{(u.roles ?? []).map((r) => <Badge key={r} variant="default" size="sm">{r}</Badge>)} {(u.roles ?? []).length === 0 && <p className="text-sm text-slate-500">Aucun rôle</p>}</div></CardContent></Card>
      </div>
      {(u.organizations ?? []).length > 0 && (
        <Card><CardHeader><CardTitle>Organisations</CardTitle></CardHeader><CardContent><ul className="space-y-2">{(u.organizations ?? []).map((org) => (<li key={org.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"><span className="font-medium">{org.name}</span><div className="flex gap-1">{(org.roles ?? []).map((r) => <Badge key={r} variant="default" size="sm">{r}</Badge>)}</div></li>))}</ul></CardContent></Card>
      )}
    </div>
  );
}
