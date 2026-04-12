"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useSupplierById, useSupplierProducts } from "@/hooks/api/useSuppliers";
import { Card, Button, DataTable, type Column, Skeleton, EmptyState } from "@/components/ui";
import { formatCurrency } from "@/utils/formatters";
import { ArrowLeft } from "lucide-react";
import type { SupplierProduct } from "@/types/suppliers";

export default function SupplierProductsPage() {
  return (
    <ModuleGuard module="suppliers" requiredPermissions={[Permission.SUPPLIERS_READ]}>
      <SupplierProducts />
    </ModuleGuard>
  );
}

function SupplierProducts() {
  const params = useParams();
  const { buildPath } = useTenantPath();
  const id = (params?.id as string) ?? "";
  const { data: supplier, isLoading: ls } = useSupplierById(id);
  const { data: products, isLoading: lp } = useSupplierProducts(id);
  const s = supplier as { name?: string } | undefined;
  const list = (products ?? []) as SupplierProduct[];

  const columns: Column<Record<string, unknown>>[] = [
    { key: "product_name", title: "Produit", render: (_, row) => (row as unknown as SupplierProduct).product_name ?? "—" },
    { key: "supplier_sku", title: "Réf. fournisseur", render: (_, row) => (row as unknown as SupplierProduct).supplier_sku ?? "—" },
    { key: "unit_price", title: "Prix unit.", align: "right", render: (_, row) => formatCurrency(Number((row as unknown as SupplierProduct).unit_price ?? 0)) },
  ];

  if (ls) return <Skeleton className="h-48 w-full" />;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={buildPath(`/suppliers/${id}`)}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Catalogue · {s?.name ?? ""}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Produits fournis par ce fournisseur</p>
        </div>
      </div>
      <Card>
        {lp ? <Skeleton className="h-48 w-full" /> : list.length === 0 ? (
          <EmptyState title="Aucun produit" description="Aucun produit associé à ce fournisseur" />
        ) : (
          <DataTable columns={columns} data={list as unknown as Record<string, unknown>[]} loading={false} rowKey={(row) => (row as unknown as SupplierProduct).id} />
        )}
      </Card>
    </div>
  );
}
