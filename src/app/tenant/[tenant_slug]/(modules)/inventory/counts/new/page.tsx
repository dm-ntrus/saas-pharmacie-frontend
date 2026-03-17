"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useLocations, useCreateInventoryCount } from "@/hooks/api/useInventory";
import { useAuth } from "@/context/AuthContext";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { ArrowLeft, ClipboardList } from "lucide-react";

type CountType = "full" | "partial" | "cycle" | "spot";

const TYPE_LABELS: Record<CountType, string> = {
  full: "Complet",
  partial: "Partiel",
  cycle: "Cyclique",
  spot: "Ponctuel",
};

export default function NewCountPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.INVENTORY_COUNTS_CREATE]}>
      <NewCountContent />
    </ModuleGuard>
  );
}

function NewCountContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { user } = useAuth();
  const [type, setType] = useState<CountType>("cycle");
  const [locationId, setLocationId] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [notes, setNotes] = useState("");

  const { data: locationsRaw } = useLocations();
  const createMutation = useCreateInventoryCount();
  const locations = Array.isArray(locationsRaw) ? locationsRaw : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = user?.id ?? "";
    createMutation.mutate(
      {
        type,
        locationId: locationId || undefined,
        scheduledDate: scheduledDate || undefined,
        countedBy: [userId],
        notes: notes || undefined,
      },
      { onSuccess: () => router.push(buildPath("/inventory/counts")) },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/inventory/counts"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nouveau comptage</h1>
          <p className="text-sm text-slate-500">Planifié → En cours → Complété → Ajustements appliqués</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-600" />
              Paramètres
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CountType)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              >
                {(Object.keys(TYPE_LABELS) as CountType[]).map((t) => (
                  <option key={t} value={t}>{TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            {type === "partial" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Emplacement</label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                >
                  <option value="">Tous</option>
                  {locations.map((loc: any) => (
                    <option key={loc.id} value={loc.id}>{loc.name ?? loc.code}</option>
                  ))}
                </select>
              </div>
            )}
            <Input
              label="Date planifiée"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
            <Input label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optionnel" />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={() => router.push(buildPath("/inventory/counts"))}>Annuler</Button>
          <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? "Création..." : "Créer"}</Button>
        </div>
      </form>
    </div>
  );
}
