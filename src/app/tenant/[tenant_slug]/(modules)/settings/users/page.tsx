"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useIdentityUsers } from "@/hooks/api/useIdentity";
import {
  Card,
  Button,
  Badge,
  Input,
  DataTable,
  type Column,
  Skeleton,
  EmptyState,
  ErrorBanner,
} from "@/components/ui";
import { formatDateTime } from "@/utils/formatters";
import { Plus, Search, Shield } from "lucide-react";
import type { UserResponseDto } from "@/types/identity";

const STATUS_LABELS: Record<string, string> = {
  active: "Actif",
  inactive: "Inactif",
  suspended: "Suspendu",
  pending_verification: "En attente",
  archived: "Archivé",
};

export default function SettingsUsersPage() {
  return (
    <ModuleGuard module="settings" requiredPermissions={[Permission.ROLES_READ]}>
      <UsersList />
    </ModuleGuard>
  );
}

function UsersList() {
  const { buildPath: path } = useTenantPath();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { data, isLoading, error, refetch } = useIdentityUsers({
    search: search.trim() || undefined,
    status: statusFilter || undefined,
    limit: 50,
    offset: 0,
  });

  const raw = data as { data?: UserResponseDto[]; total?: number } | UserResponseDto[] | undefined;
  const list: UserResponseDto[] = Array.isArray(raw) ? raw : (raw?.data ?? []);
  const totalCount = (raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as { total?: number }).total : undefined) ?? list.length;

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "fullName",
      title: "Utilisateur",
      render: (_, row) => {
        const u = row as unknown as UserResponseDto;
        return (
          <Link href={path(`/settings/users/${u.id}`)} className="font-medium text-emerald-600 hover:underline">
            {u.fullName ? u.fullName : (`${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email)}
          </Link>
        );
      },
    },
    { key: "email", title: "Email", render: (_, row) => (row as unknown as UserResponseDto).email },
    {
      key: "roles",
      title: "Rôles",
      render: (_, row) => (
        <div className="flex flex-wrap gap-1">
          {((row as unknown as UserResponseDto).roles ?? []).slice(0, 3).map((r) => (
            <Badge key={r} variant="default" size="sm">{r}</Badge>
          ))}
          {((row as unknown as UserResponseDto).roles ?? []).length > 3 && (
            <Badge variant="default" size="sm">+{((row as unknown as UserResponseDto).roles ?? []).length - 3}</Badge>
          )}
        </div>
      ),
    },
    {
      key: "status",
      title: "Statut",
      render: (_, row) => (
        <Badge variant={(row as unknown as UserResponseDto).status === "active" ? "success" : "default"} size="sm">
          {STATUS_LABELS[(row as unknown as UserResponseDto).status ?? ""] ?? (row as unknown as UserResponseDto).status}
        </Badge>
      ),
    },
    {
      key: "lastLoginAt",
      title: "Dernière connexion",
      render: (_, row) => formatDateTime((row as unknown as UserResponseDto).lastLoginAt as string) || "—",
    },
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <ErrorBanner title="Erreur" message="Impossible de charger les utilisateurs" onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Utilisateurs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{totalCount} utilisateur(s)</p>
        </div>
        <ProtectedAction permission={Permission.ROLES_ASSIGN}>
          <Button asChild>
            <Link href={path("/settings/users/new")}>
              <Plus className="w-4 h-4 mr-2" /> Inviter / Créer
            </Link>
          </Button>
        </ProtectedAction>
      </div>
      <Card>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-4">
          <Input
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="max-w-md"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-w-[140px]"
          >
            <option value="">Tous les statuts</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : list.length === 0 ? (
          <EmptyState
            icon={<Shield className="w-8 h-8 text-slate-400" />}
            title="Aucun utilisateur"
            description="Invitez ou créez un utilisateur pour commencer."
          />
        ) : (
          <DataTable
            columns={columns}
            data={list as unknown as Record<string, unknown>[]}
            loading={false}
            rowKey={(row) => (row as unknown as UserResponseDto).id}
          />
        )}
      </Card>
    </div>
  );
}
