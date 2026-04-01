"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import {
  useSupplierQuotesCompare,
  useCreateSupplierQuote,
  useDeleteSupplierQuote,
} from "@/hooks/api/useSupplyChain";
import { useProducts } from "@/hooks/api/useInventory";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Skeleton,
  ErrorBanner,
} from "@/components/ui";
import { ArrowLeft, Trash2 } from "lucide-react";
import type { SupplierProductQuote } from "@/types/suppliers";
import { formatCurrency, formatDate } from "@/utils/formatters";

function shortId(id: string) {
  return id.includes(":") ? id.split(":").pop() ?? id : id;
}

export default function SupplierQuotesPage() {
  return (
    <ModuleGuard
      module="supply-chain"
      requiredPermissions={[Permission.SUPPLY_CHAIN_READ, Permission.PURCHASE_ORDERS_READ]}
    >
      <Content />
    </ModuleGuard>
  );
}

function Content() {
  const { buildPath } = useTenantPath();
  const { data: productsRes } = useProducts({ limit: 400 });
  const products = productsRes?.data ?? [];
  const [productId, setProductId] = useState("");
  const { data: compareRaw, isLoading, error, refetch } = useSupplierQuotesCompare(
    productId || null,
  );
  const createMut = useCreateSupplierQuote();
  const deleteMut = useDeleteSupplierQuote();

  const compare = compareRaw as { quotes?: SupplierProductQuote[] } | undefined;
  const quotes = compare?.quotes ?? [];

  const [form, setForm] = useState({
    supplierId: "",
    unitPrice: "",
    currency: "MAD",
    leadTimeDays: "",
    minOrderQty: "",
    quoteReference: "",
    validUntil: "",
    notes: "",
  });

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !form.supplierId || !form.unitPrice) return;
    createMut.mutate(
      {
        supplierId: form.supplierId.trim(),
        productId,
        unitPrice: Number(form.unitPrice),
        currency: form.currency || "MAD",
        leadTimeDays: form.leadTimeDays !== "" ? Number(form.leadTimeDays) : undefined,
        minOrderQty: form.minOrderQty !== "" ? Number(form.minOrderQty) : undefined,
        quoteReference: form.quoteReference || undefined,
        validUntil: form.validUntil
          ? new Date(form.validUntil + "T12:00:00.000Z").toISOString()
          : undefined,
        notes: form.notes || undefined,
      },
      { onSuccess: () => refetch() },
    );
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={buildPath("/supply-chain")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Comparaison fournisseurs
          </h1>
          <p className="text-sm text-slate-500">Devis par produit — tri par prix croissant</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Produit à comparer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Produit</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full max-w-md rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            >
              <option value="">— Choisir un produit —</option>
              {products.map((p) => {
                const pid = shortId(p.id);
                return (
                  <option key={p.id} value={pid}>
                    {p.name} ({p.sku || p.barcode})
                  </option>
                );
              })}
            </select>
          </div>
          {error && productId && (
            <ErrorBanner message="Impossible de charger les devis" onRetry={() => refetch()} />
          )}
          {!productId ? (
            <p className="text-sm text-slate-500">Sélectionnez un produit pour afficher les offres.</p>
          ) : isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : quotes.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun devis enregistré pour ce produit.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-left dark:border-slate-700 dark:bg-slate-800/50">
                    <th className="px-3 py-2">Fournisseur</th>
                    <th className="px-3 py-2 text-right">Prix unit.</th>
                    <th className="px-3 py-2">Devise</th>
                    <th className="px-3 py-2 text-right">Délai (j)</th>
                    <th className="px-3 py-2">Valide jusqu&apos;au</th>
                    <th className="px-3 py-2 w-24" />
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((q) => (
                    <tr key={q.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="px-3 py-2">
                        {q.supplierName ?? (q.supplier_id ? shortId(q.supplier_id) : "—")}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums font-medium">
                        {formatCurrency(Number(q.unit_price ?? 0))}
                      </td>
                      <td className="px-3 py-2">{q.currency ?? "—"}</td>
                      <td className="px-3 py-2 text-right">{q.lead_time_days ?? "—"}</td>
                      <td className="px-3 py-2">{q.valid_until ? formatDate(q.valid_until) : "—"}</td>
                      <td className="px-3 py-2">
                        <ProtectedAction permission={Permission.PURCHASE_ORDERS_UPDATE} hideIfDenied>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              deleteMut.mutate(shortId(q.id), { onSuccess: () => refetch() })
                            }
                            disabled={deleteMut.isPending}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </ProtectedAction>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ProtectedAction permission={Permission.PURCHASE_ORDERS_CREATE} hideIfDenied>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ajouter un devis</CardTitle>
          </CardHeader>
          <CardContent>
            {!productId ? (
              <p className="text-sm text-slate-500">Choisissez d&apos;abord un produit ci-dessus.</p>
            ) : (
              <form onSubmit={onCreate} className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Fournisseur (UUID)"
                  value={form.supplierId}
                  onChange={(e) => setForm((f) => ({ ...f, supplierId: e.target.value }))}
                  required
                />
                <Input
                  label="Prix unitaire"
                  type="number"
                  step="0.01"
                  min={0}
                  value={form.unitPrice}
                  onChange={(e) => setForm((f) => ({ ...f, unitPrice: e.target.value }))}
                  required
                />
                <Input
                  label="Devise"
                  value={form.currency}
                  onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                />
                <Input
                  label="Délai (jours)"
                  type="number"
                  min={0}
                  value={form.leadTimeDays}
                  onChange={(e) => setForm((f) => ({ ...f, leadTimeDays: e.target.value }))}
                />
                <Input
                  label="MOQ"
                  type="number"
                  min={0}
                  value={form.minOrderQty}
                  onChange={(e) => setForm((f) => ({ ...f, minOrderQty: e.target.value }))}
                />
                <Input
                  label="Réf. devis"
                  value={form.quoteReference}
                  onChange={(e) => setForm((f) => ({ ...f, quoteReference: e.target.value }))}
                />
                <Input
                  label="Valide jusqu'au"
                  type="date"
                  value={form.validUntil}
                  onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))}
                />
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={2}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" loading={createMut.isPending}>
                    Enregistrer le devis
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </ProtectedAction>
    </div>
  );
}
