"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useLocations, useCreateLocation } from "@/hooks/api/useInventory";
import type { CreateInventoryLocationPayload, LocationType, DisplayCategory, Coordinates3D } from "@/types/inventory";
import { LOCATION_TYPE_LABELS } from "@/types/inventory";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { ArrowLeft, MapPin } from "lucide-react";

const DISPLAY_CATEGORY_LABELS: Record<string, string> = {
  otc_medications: "Médicaments OTC",
  prescriptions: "Ordonnances",
  vitamins: "Vitamines",
  first_aid: "Premiers secours",
  personal_care: "Soins personnels",
  controlled_substances: "Substances contrôlées",
  seasonal: "Saisonnier",
  promotional: "Promotionnel",
};

const LOCATION_TYPES = Object.keys(LOCATION_TYPE_LABELS) as LocationType[];

export default function NewLocationPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.INVENTORY_LOCATIONS_CREATE]}>
      <NewLocationContent />
    </ModuleGuard>
  );
}

function NewLocationContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: locationsRaw } = useLocations();
  const createMutation = useCreateLocation();
  const locations = Array.isArray(locationsRaw) ? locationsRaw : [];

  const [form, setForm] = useState<Partial<CreateInventoryLocationPayload>>({
    code: "",
    name: "",
    description: "",
    location_type: "shelf",
    parent_location_id: "",
    zone_code: "",
    aisle_number: "",
    shelf_level: "",
    position_code: "",
    is_secured: false,
    requires_badge: false,
    is_refrigerated: false,
    is_promotional: false,
    compliance_required: false,
    max_capacity: undefined,
    temperature_min: undefined,
    temperature_max: undefined,
    display_category: undefined,
    active: true,
  });

  const [coordX, setCoordX] = useState("");
  const [coordY, setCoordY] = useState("");
  const [coordZ, setCoordZ] = useState("");

  const update = (key: keyof CreateInventoryLocationPayload, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const getPayload = (): CreateInventoryLocationPayload => {
    const coord: Coordinates3D | undefined =
      coordX !== "" && coordY !== "" && coordZ !== ""
        ? { x: Number(coordX), y: Number(coordY), z: Number(coordZ) }
        : undefined;
    return {
      code: form.code ?? "",
      name: form.name ?? "",
      description: form.description || undefined,
      location_type: (form.location_type as LocationType) ?? "shelf",
      parent_location_id: form.parent_location_id || undefined,
      zone_code: form.zone_code || undefined,
      aisle_number: form.aisle_number || undefined,
      shelf_level: form.shelf_level || undefined,
      position_code: form.position_code || undefined,
      coordinates_3d: coord,
      is_secured: form.is_secured ?? false,
      requires_badge: form.requires_badge ?? false,
      is_refrigerated: form.is_refrigerated ?? false,
      is_promotional: form.is_promotional ?? false,
      compliance_required: form.compliance_required ?? false,
      max_capacity: form.max_capacity != null && form.max_capacity !== "" ? Number(form.max_capacity) : undefined,
      temperature_min: form.temperature_min != null && form.temperature_min !== "" ? Number(form.temperature_min) : undefined,
      temperature_max: form.temperature_max != null && form.temperature_max !== "" ? Number(form.temperature_max) : undefined,
      display_category: form.display_category as DisplayCategory | undefined,
      active: form.active ?? true,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = getPayload();
    if (!payload.code.trim() || !payload.name.trim()) return;
    createMutation.mutate(payload, {
      onSuccess: () => router.push(buildPath("/inventory/locations")),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/inventory/locations"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nouvel emplacement</h1>
          <p className="text-sm text-slate-500">Code unique, type, zone, capacité, température</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Identification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Code *"
              value={form.code}
              onChange={(e) => update("code", e.target.value)}
              placeholder="ex: A-01-02"
              required
            />
            <Input
              label="Nom *"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="ex: Étagère A1 niveau 2"
              required
            />
            <Input
              label="Description"
              value={form.description ?? ""}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Optionnel"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type *</label>
              <select
                value={form.location_type}
                onChange={(e) => update("location_type", e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              >
                {LOCATION_TYPES.map((t) => (
                  <option key={t} value={t}>{LOCATION_TYPE_LABELS[t as LocationType] ?? t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Emplacement parent</label>
              <select
                value={form.parent_location_id ?? ""}
                onChange={(e) => update("parent_location_id", e.target.value || undefined)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              >
                <option value="">Aucun</option>
                {locations.map((loc: any) => (
                  <option key={loc.id} value={loc.id}>{loc.name ?? loc.code}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Catégorie d’affichage</label>
              <select
                value={form.display_category ?? ""}
                onChange={(e) => update("display_category", e.target.value || undefined)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              >
                <option value="">Aucune</option>
                {Object.keys(DISPLAY_CATEGORY_LABELS).map((k) => (
                  <option key={k} value={k}>{DISPLAY_CATEGORY_LABELS[k]}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Adressage physique</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="Zone" value={form.zone_code ?? ""} onChange={(e) => update("zone_code", e.target.value)} placeholder="ex: A" />
              <Input label="Allée" value={form.aisle_number ?? ""} onChange={(e) => update("aisle_number", e.target.value)} placeholder="ex: 1" />
              <Input label="Niveau étagère" value={form.shelf_level ?? ""} onChange={(e) => update("shelf_level", e.target.value)} placeholder="bas, milieu, haut" />
            </div>
            <Input label="Position (code)" value={form.position_code ?? ""} onChange={(e) => update("position_code", e.target.value)} placeholder="ex: 01-02" />
            <div className="grid grid-cols-3 gap-4">
              <Input label="X" type="number" value={coordX} onChange={(e) => setCoordX(e.target.value)} placeholder="x" />
              <Input label="Y" type="number" value={coordY} onChange={(e) => setCoordY(e.target.value)} placeholder="y" />
              <Input label="Z" type="number" value={coordZ} onChange={(e) => setCoordZ(e.target.value)} placeholder="z" />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Sécurité et capacité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_secured ?? false} onChange={(e) => update("is_secured", e.target.checked)} className="rounded" />
                <span className="text-sm">Sécurisé</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.requires_badge ?? false} onChange={(e) => update("requires_badge", e.target.checked)} className="rounded" />
                <span className="text-sm">Badge requis</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_refrigerated ?? false} onChange={(e) => update("is_refrigerated", e.target.checked)} className="rounded" />
                <span className="text-sm">Réfrigéré</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_promotional ?? false} onChange={(e) => update("is_promotional", e.target.checked)} className="rounded" />
                <span className="text-sm">Promotionnel</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.compliance_required ?? false} onChange={(e) => update("compliance_required", e.target.checked)} className="rounded" />
                <span className="text-sm">Conformité requise</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.active ?? true} onChange={(e) => update("active", e.target.checked)} className="rounded" />
                <span className="text-sm">Actif</span>
              </label>
            </div>
            <Input
              label="Capacité max (nombre d’items)"
              type="number"
              min={0}
              value={form.max_capacity ?? ""}
              onChange={(e) => update("max_capacity", e.target.value === "" ? undefined : e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Température min (°C)"
                type="number"
                value={form.temperature_min ?? ""}
                onChange={(e) => update("temperature_min", e.target.value === "" ? undefined : e.target.value)}
              />
              <Input
                label="Température max (°C)"
                type="number"
                value={form.temperature_max ?? ""}
                onChange={(e) => update("temperature_max", e.target.value === "" ? undefined : e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={() => router.push(buildPath("/inventory/locations"))}>Annuler</Button>
          <Button type="submit" disabled={createMutation.isPending || !form.code?.trim() || !form.name?.trim()}>
            {createMutation.isPending ? "Création..." : "Créer"}
          </Button>
        </div>
      </form>
    </div>
  );
}
