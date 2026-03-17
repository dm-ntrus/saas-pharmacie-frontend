"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useSupplierById, useSupplierContracts } from "@/hooks/api/useSuppliers";
import {
  Card,
  Button,
  Badge,
  DataTable,
  type Column,
  Skeleton,
  EmptyState,
} from "@/components/ui";
import { formatDate } from "@/utils/formatters";
import { ArrowLeft } from "lucide-react";
import type { SupplierContract } from "@/types/suppliers";

export default function SupplierContractsPage() {
  return (
    <ModuleGuard module="suppliers" requiredPermissions={[Permission.SUPPLIERS_READ]}>
      <SupplierContracts />
    </ModuleGuard>
  );
}

function SupplierContracts() {
  const params = useParams();
  const path = useTenantPath();
  const id = (params?.id as string) ?? "";

  const { data: supplier, isLoading: ls } = useSupplierById(id);
  const { data: contracts, isLoading: lc } = useSupplierContracts(id);

  const s = supplier as { name?: string } | undefined;
  const list = (contracts ?? []) as SupplierContract[];

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "id",
      title: "Contrat",
      width: "120px",
      render: (_, row) => {
        const idVal = (row as unknown as SupplierContract).id;
        return typeof idVal === "string" ? idVal.slice(0, 8) : "—";
      },
    },
    {
      key: "start_date",
      title: "Début",
      render: (_, row) => formatDate((row as unknown as SupplierContract).start_date),
    },
    {
      key: "end_date",
      title: "Fin",
      render: (_, row) => formatDate((row as unknown as SupplierContract).end_date),
    },
    {
      key: "status",
      title: "Statut",
      render: (_, row) => (
        <Badge variant="default" size="sm">
          {(row as unknown as SupplierContract).status ?? "—"}
        </Badge>
      ),
    },
  ];

  if (ls) return <Skeleton className="h-48 w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={path(`/suppliers/${id}`)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Contrats · {s?.name ?? ""}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Contrats avec ce fournisseur
          </p>
        </div>
      </div>
      <Card>
        {lc ? (
          <Skeleton className="h-48 w-full" />
        ) : list.length === 0 ? (
          <EmptyState
            title="Aucun contrat"
            description="Aucun contrat enregistré pour ce fournisseur"
          />
        ) : (
          <DataTable
            columns={columns}
            data={list as unknown as Record<string, unknown>[]}
            loading={false}
            rowKey={(row) => (row as unknown as SupplierContract).id}
          />
        )}
      </Card>
    </div>
  );
}
