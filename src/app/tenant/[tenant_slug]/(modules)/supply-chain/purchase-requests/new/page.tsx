"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useCreatePurchaseRequest } from "@/hooks/api/useSupplyChain";
import { useProducts } from "@/hooks/api/useInventory";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Skeleton } from "@/components/ui";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

type Line = {
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  estimatedUnitCost: string;
};

export default function NewPurchaseRequestPage() {
  return (
    <ModuleGuard
      module="supply-chain"
      requiredPermissions={[Permission.SUPPLY_CHAIN_READ, Permission.PURCHASE_ORDERS_CREATE]}
    >
      <Form />
    </ModuleGuard>
  );
}

function Form() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const createMut = useCreatePurchaseRequest();
  const { data: productsRes, isLoading: prodLoading } = useProducts({ limit: 500 });
  const products = productsRes?.data ?? [];
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [preferredSupplierId, setPreferredSupplierId] = useState("");
  const [lines, setLines] = useState<Line[]>([
    { productId: "", productName: "", productSku: "", quantity: 1, estimatedUnitCost: "" },
  ]);

  const addLine = () =>
    setLines((l) => [
      ...l,
      { productId: "", productName: "", productSku: "", quantity: 1, estimatedUnitCost: "" },
    ]);
  const removeLine = (i: number) => setLines((l) => l.filter((_, idx) => idx !== i));

  const onPickProduct = (index: number, productId: string) => {
    const p = products.find((x) => x.id.replace(/^products:/, "") === productId || x.id === productId);
    if (!p) return;
    const pid = p.id.replace(/^products:/, "");
    setLines((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        productId: pid,
        productName: p.name,
        productSku: p.sku ?? p.barcode ?? "",
      };
      return next;
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = lines.filter((l) => l.productId && l.quantity > 0);
    if (!clean.length) return;
    createMut.mutate(
      {
        title: title.trim() || undefined,
        notes: notes.trim() || undefined,
        preferredSupplierId: preferredSupplierId.trim() || undefined,
        lines: clean.map((l) => ({
          productId: l.productId,
          productName: l.productName,
          productSku: l.productSku || "—",
          quantity: l.quantity,
          estimatedUnitCost: l.estimatedUnitCost ? Number(l.estimatedUnitCost) : undefined,
        })),
      },
      {
        onSuccess: (res: unknown) => {
          const r = res as { id?: string };
          const rid = r?.id ? String(r.id).replace(/^purchase_requests:/, "") : "";
          if (rid) router.push(buildPath(`/supply-chain/purchase-requests/${rid}`));
          else router.push(buildPath("/supply-chain/purchase-requests"));
        },
      },
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Button variant="ghost" size="sm" asChild>
        <Link href={buildPath("/supply-chain/purchase-requests")}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Retour
        </Link>
      </Button>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nouvelle demande d&apos;achat</h1>

      {prodLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <form onSubmit={submit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Entête</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Titre (optionnel)" value={title} onChange={(e) => setTitle(e.target.value)} />
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                />
              </div>
              <Input
                label="Fournisseur préféré (UUID, optionnel)"
                value={preferredSupplierId}
                onChange={(e) => setPreferredSupplierId(e.target.value)}
                placeholder="uuid"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lignes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lines.map((line, i) => (
                <div
                  key={i}
                  className="grid gap-3 sm:grid-cols-12 items-end border-b border-slate-100 dark:border-slate-800 pb-4"
                >
                  <div className="sm:col-span-5">
                    <label className="block text-xs text-slate-500 mb-1">Produit</label>
                    <select
                      value={line.productId}
                      onChange={(e) => onPickProduct(i, e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-2 text-sm"
                    >
                      <option value="">— Choisir —</option>
                      {products.map((p) => {
                        const pid = p.id.replace(/^products:/, "");
                        return (
                          <option key={p.id} value={pid}>
                            {p.name} ({p.sku || p.barcode || pid})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Qté"
                      type="number"
                      min={1}
                      value={line.quantity}
                      onChange={(e) =>
                        setLines((prev) => {
                          const n = [...prev];
                          n[i] = { ...n[i], quantity: Number(e.target.value) || 1 };
                          return n;
                        })
                      }
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <Input
                      label="Coût unit. est."
                      type="number"
                      step="0.01"
                      min={0}
                      value={line.estimatedUnitCost}
                      onChange={(e) =>
                        setLines((prev) => {
                          const n = [...prev];
                          n[i] = { ...n[i], estimatedUnitCost: e.target.value };
                          return n;
                        })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLine(i)}
                      disabled={lines.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addLine} leftIcon={<Plus className="w-4 h-4" />}>
                Ligne
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" asChild>
              <Link href={buildPath("/supply-chain/purchase-requests")}>Annuler</Link>
            </Button>
            <Button type="submit" loading={createMut.isPending}>
              Créer (brouillon)
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
