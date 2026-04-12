"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useLocations, useCreateStockTransfer } from "@/hooks/api/useInventory";
import { useProducts } from "@/hooks/api/useInventory";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  ErrorBanner,
  Skeleton,
} from "@/components/ui";
import { ArrowLeft, Plus, Trash2, MapPin, Package } from "lucide-react";
import { toast } from "react-hot-toast";

interface TransferLine {
  productId: string;
  batchId?: string;
  quantity: number;
  notes?: string;
}

export default function NewTransferPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.STOCK_TRANSFERS_CREATE]}>
      <NewTransferContent />
    </ModuleGuard>
  );
}

function NewTransferContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [sourceLocationId, setSourceLocationId] = useState("");
  const [destinationLocationId, setDestinationLocationId] = useState("");
  const [notes, setNotes] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [lines, setLines] = useState<TransferLine[]>([{ productId: "", quantity: 1 }]);

  const { data: locationsRaw, isLoading: locLoading } = useLocations();
  const { data: productsData } = useProducts({ limit: 200 });
  const createMutation = useCreateStockTransfer();

  const locations = Array.isArray(locationsRaw) ? locationsRaw : [];
  const products = productsData?.data ?? [];

  const addLine = () => setLines((prev) => [...prev, { productId: "", quantity: 1 }]);
  const removeLine = (i: number) => setLines((prev) => prev.filter((_, idx) => idx !== i));
  const updateLine = (i: number, field: keyof TransferLine, value: string | number) => {
    setLines((prev) => {
      const next = [...prev];
      (next[i] as any)[field] = value;
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validLines = lines.filter((l) => l.productId && l.quantity >= 1);
    if (!sourceLocationId || !destinationLocationId) {
      toast.error("Source et destination requises");
      return;
    }
    if (sourceLocationId === destinationLocationId) {
      toast.error("Source et destination doivent être différentes");
      return;
    }
    if (validLines.length === 0) {
      toast.error("Au moins une ligne avec produit et quantité");
      return;
    }
    createMutation.mutate(
      {
        sourceLocationId,
        destinationLocationId,
        requestedBy: "",
        transferLines: validLines.map((l) => ({
          productId: l.productId,
          batchId: l.batchId,
          quantity: l.quantity,
          notes: l.notes,
        })),
        notes: notes || undefined,
        trackingNumber: trackingNumber || undefined,
        carrier: carrier || undefined,
      },
      {
        onSuccess: () => router.push(buildPath("/inventory/transfers")),
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/inventory/transfers"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nouveau transfert</h1>
          <p className="text-sm text-slate-500">Demande → Approbation → Expédition → Réception</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Emplacements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {locLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Source *</label>
                  <select
                    value={sourceLocationId}
                    onChange={(e) => setSourceLocationId(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                    required
                  >
                    <option value="">Sélectionner...</option>
                    {locations.map((loc: any) => (
                      <option key={loc.id} value={loc.id}>{loc.name ?? loc.code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Destination *</label>
                  <select
                    value={destinationLocationId}
                    onChange={(e) => setDestinationLocationId(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                    required
                  >
                    <option value="">Sélectionner...</option>
                    {locations.map((loc: any) => (
                      <option key={loc.id} value={loc.id}>{loc.name ?? loc.code}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <Input label="N° suivi" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Optionnel" />
            <Input label="Transporteur" value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="Optionnel" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              Lignes de transfert (min. 1)
            </CardTitle>
            <Button type="button" variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={addLine}>
              Ajouter
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {lines.map((line, i) => (
              <div key={i} className="flex flex-wrap items-end gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Produit</label>
                  <select
                    value={line.productId}
                    onChange={(e) => updateLine(i, "productId", e.target.value)}
                    className="w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 text-sm"
                  >
                    <option value="">Sélectionner...</option>
                    {products.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name ?? p.barcode}</option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Quantité</label>
                  <input
                    type="number"
                    min={1}
                    value={line.quantity}
                    onChange={(e) => updateLine(i, "quantity", Number(e.target.value) || 0)}
                    className="w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 text-sm"
                  />
                </div>
                {lines.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeLine(i)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <Input label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optionnel" />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(buildPath("/inventory/transfers"))}>
            Annuler
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Création..." : "Créer le transfert"}
          </Button>
        </div>
      </form>
    </div>
  );
}
