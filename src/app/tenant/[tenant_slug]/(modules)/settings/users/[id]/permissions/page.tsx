"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useIdentityUserById, useIdentityUserPermissions } from "@/hooks/api/useIdentity";
import { useOrganization } from "@/context/OrganizationContext";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Skeleton, ErrorBanner } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

export default function UserPermissionsPage() {
  return (
    <ModuleGuard module="settings" requiredPermissions={[Permission.ROLES_READ]}>
      <UserPermissions />
    </ModuleGuard>
  );
}

function UserPermissions() {
  const params = useParams();
  const { buildPath: path } = useTenantPath();
  const id = (params?.id as string) ?? "";
  const { currentOrganization } = useOrganization();
  const orgId = currentOrganization?.id ?? "";
  const { data: user, isLoading: lu, error: eu } = useIdentityUserById(id);
  const { data: permsData, isLoading: lp, error: ep } = useIdentityUserPermissions(id, orgId);

  if (eu) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild><Link href={path(`/settings/users/${id}`)}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link></Button>
        <ErrorBanner title="Erreur" message="Impossible de charger l'utilisateur" />
      </div>
    );
  }

  if (lu || !user) return <Skeleton className="h-64 w-full" />;

  const u = user as { fullName?: string; email?: string };
  const perms = (permsData as { permissions?: string[]; roles?: string[] }) ?? {};
  const permissions = perms.permissions ?? [];
  const roles = perms.roles ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={path(`/settings/users/${id}`)}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Permissions · {u.fullName ?? u.email}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Permissions effectives pour l&apos;organisation courante</p>
        </div>
      </div>

      {ep && <ErrorBanner title="Erreur" message="Impossible de charger les permissions" />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Rôles</CardTitle></CardHeader>
          <CardContent>
            {lp ? <Skeleton className="h-20 w-full" /> : (
              <div className="flex flex-wrap gap-2">
                {roles.map((r) => <Badge key={r} variant="default" size="sm">{r}</Badge>)}
                {roles.length === 0 && <p className="text-sm text-slate-500">Aucun rôle dans cette organisation</p>}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Permissions ({permissions.length})</CardTitle></CardHeader>
          <CardContent>
            {lp ? <Skeleton className="h-32 w-full" /> : (
              <ul className="text-xs max-h-64 overflow-auto space-y-1">
                {permissions.map((p) => (
                  <li key={p} className="font-mono text-slate-600 dark:text-slate-400">{p}</li>
                ))}
                {permissions.length === 0 && <p className="text-sm text-slate-500">Aucune permission</p>}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
