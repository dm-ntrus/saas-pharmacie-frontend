"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useSuppliers } from "@/hooks/api/useSuppliers";
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
import { formatCurrency } from "@/utils/formatters";
import { Plus, Search, Factory } from "lucide-react";
import type { Supplier } from "@/types/suppliers";
import { SUPPLIER_TYPE_LABELS } from "@/types/suppliers";

export default function SuppliersPage() {
  return (
    <ModuleGuard module="suppliers" requiredPermissions={[Permission.SUPPLIERS_READ]}>
      <SuppliersList />
    </ModuleGuard>
  );
}

function SuppliersList() {
  const { buildPath } = useTenantPath();
  const [search, setSearch] = useState("");
  const { data: suppliers, isLoading, error } = useSuppliers();

  const list = (suppliers ?? []) as Supplier[];
  const filtered = useMemo(() => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        (s.supplier_code ?? s.supplierCode ?? "").toLowerCase().includes(q) ||
        (s.contact_person ?? s.contactPerson ?? "").toLowerCase().includes(q),
    );
  }, [list, search]);

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "name",
      title: "Fournisseur",
      sortable: true,
      render: (_, row) => {
        const s = row as unknown as Supplier;
        return (
          <Link
            href={buildPath(`/suppliers/${s.id}`)}
            className="font-medium text-emerald-600 hover:underline"
          >
            {s.name}
          </Link>
        );
      },
    },
    {
      key: "supplier_code",
      title: "Code",
      width: "120px",
      render: (_, row) => (row as unknown as Supplier).supplier_code ?? (row as unknown as Supplier).supplierCode ?? "—",
    },
    {
      key: "type",
      title: "Type",
      render: (_, row) => {
        const t = (row as unknown as Supplier).type;
        return <Badge variant="default" size="sm">{SUPPLIER_TYPE_LABELS[t ?? ""] ?? t ?? "—"}</Badge>;
      },
    },
    {
      key: "contact_person",
      title: "Contact",
      render: (_, row) => (row as unknown as Supplier).contact_person ?? (row as unknown as Supplier).contactPerson ?? "—",
    },
    {
      key: "phone",
      title: "Téléphone",
      hideOnMobile: true,
      render: (_, row) => (row as unknown as Supplier).phone ?? "—",
    },
    {
      key: "rating",
      title: "Note",
      align: "right",
      render: (_, row) => {
        const r = (row as unknown as Supplier).rating;
        if (r == null) return "—";
        return <span className="font-medium">{Number(r)}/5</span>;
      },
    },
  ];

  if (error) {
    return <ErrorBanner title="Erreur" message="Impossible de charger les fournisseurs" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Fournisseurs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Liste des fournisseurs avec scoring</p>
        </div>
        <ProtectedAction permission={Permission.SUPPLIERS_CREATE}>
          <Button asChild>
            <Link href={buildPath("/suppliers/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau fournisseur
            </Link>
          </Button>
        </ProtectedAction>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher (nom, code, contact)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filtered as unknown as Record<string, unknown>[]}
          loading={isLoading}
          emptyTitle="Aucun fournisseur"
          emptyDescription="Créez un fournisseur pour commencer"
          rowKey={(row) => (row as unknown as Supplier).id}
        />
      </Card>

      <div className="flex flex-wrap gap-2 text-sm text-slate-500">
        <Link href={buildPath("/supply-chain")} className="text-emerald-600 hover:underline">
          Dashboard Supply Chain
        </Link>
        <span>·</span>
        <Link href={buildPath("/supply-chain/purchase-orders")} className="text-emerald-600 hover:underline">
          Commandes d&apos;achat
        </Link>
      </div>
    </div>
  );
}
