"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useCreateProduct } from "@/hooks/api/useInventory";
import type { CreateProductPayload, ProductCategory, ProductType } from "@/types/inventory";
import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_TYPE_LABELS,
} from "@/types/inventory";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { ArrowLeft, Package } from "lucide-react";

const DOSAGE_FORMS = [
  { value: "comprimé", label: "Comprimé" },
  { value: "gélule", label: "Gélule" },
  { value: "sirop", label: "Sirop" },
  { value: "solution", label: "Solution" },
  { value: "crème", label: "Crème" },
  { value: "gel", label: "Gel" },
  { value: "injectable", label: "Injectable" },
  { value: "suppositoire", label: "Suppositoire" },
  { value: "poudre", label: "Poudre" },
  { value: "autre", label: "Autre" },
];

const UNITS = [
  { value: "boîte", label: "Boîte" },
  { value: "flacon", label: "Flacon" },
  { value: "tube", label: "Tube" },
  { value: "unité", label: "Unité" },
  { value: "paquet", label: "Paquet" },
  { value: "ml", label: "ml" },
  { value: "g", label: "g" },
  { value: "autre", label: "Autre" },
];

const DEA_SCHEDULES = [
  { value: "", label: "—" },
  { value: "I", label: "Schedule I" },
  { value: "II", label: "Schedule II" },
  { value: "III", label: "Schedule III" },
  { value: "IV", label: "Schedule IV" },
  { value: "V", label: "Schedule V" },
];

export default function NewProductPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.PRODUCTS_CREATE]}>
      <NewProductContent />
    </ModuleGuard>
  );
}

function NewProductContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const createMutation = useCreateProduct();
  const [form, setForm] = useState<Partial<CreateProductPayload>>({
    name: "",
    barcode: "",
    sku: "",
    manufacturer: "",
    brand: "",
    description: "",
    activeIngredient: "",
    strength: "",
    dosageForm: "comprimé",
    unitOfMeasure: "boîte",
    packagingSize: undefined,
    deaSchedule: "",
    category: "medicine" as ProductCategory,
    type: "otc" as ProductType,
    internalCode: "",
    requiresPrescription: false,
    isNarcotic: false,
    isColdChain: false,
    storageConditions: "",
    referencePrice: undefined,
    primaryImageUrl: "",
    atcCode: "",
    therapeuticClass: "",
  });

  const update = (key: keyof CreateProductPayload, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const getPayload = (): CreateProductPayload => ({
    name: form.name ?? "",
    barcode: form.barcode ?? "",
    manufacturer: form.manufacturer ?? "",
    activeIngredient: form.activeIngredient ?? "",
    strength: form.strength ?? "",
    dosageForm: form.dosageForm ?? "comprimé",
    unitOfMeasure: form.unitOfMeasure ?? "boîte",
    category: (form.category as ProductCategory) ?? "medicine",
    type: (form.type as ProductType) ?? "otc",
    sku: form.sku || undefined,
    internalCode: form.internalCode || undefined,
    description: form.description || undefined,
    brand: form.brand || undefined,
    packagingSize: form.packagingSize != null ? Number(form.packagingSize) : undefined,
    isNarcotic: form.isNarcotic ?? false,
    isColdChain: form.isColdChain ?? false,
    requiresPrescription: form.requiresPrescription ?? false,
    deaSchedule: form.deaSchedule || undefined,
    storageConditions: form.storageConditions || undefined,
    referencePrice: form.referencePrice != null ? Number(form.referencePrice) : undefined,
    primaryImageUrl: form.primaryImageUrl?.trim() || undefined,
    atcCode: form.atcCode?.trim() || undefined,
    therapeuticClass: form.therapeuticClass?.trim() || undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = getPayload();
    if (!payload.name.trim() || !payload.barcode.trim() || !payload.manufacturer.trim() || !payload.activeIngredient.trim()) return;
    createMutation.mutate(payload, {
      onSuccess: (data: any) => {
        const id = data?.id?.replace?.("products:", "") ?? data?.id;
        if (id) router.push(buildPath(`/inventory/products/${id}`));
        else router.push(buildPath("/inventory/products"));
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/inventory/products"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nouveau produit</h1>
          <p className="text-sm text-slate-500">Informations générales, caractéristiques pharmaceutiques, classification, stockage</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section: Informations Générales §3.3 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Nom *" value={form.name ?? ""} onChange={(e) => update("name", e.target.value)} placeholder="ex: Paracétamol 500mg" required />
            <Input label="Code-barres *" value={form.barcode ?? ""} onChange={(e) => update("barcode", e.target.value)} placeholder="Code-barres" required />
            <Input label="SKU" value={form.sku ?? ""} onChange={(e) => update("sku", e.target.value)} placeholder="Optionnel, auto-généré" />
            <Input label="Fabricant *" value={form.manufacturer ?? ""} onChange={(e) => update("manufacturer", e.target.value)} required />
            <Input label="Marque" value={form.brand ?? ""} onChange={(e) => update("brand", e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea
                value={form.description ?? ""}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              />
            </div>
            <Input
              label="URL image produit"
              type="url"
              placeholder="https://cdn…/produit.jpg"
              value={form.primaryImageUrl ?? ""}
              onChange={(e) => update("primaryImageUrl", e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Section: Caractéristiques Pharmaceutiques §3.3 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Caractéristiques pharmaceutiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="DCI / Principe actif *" value={form.activeIngredient ?? ""} onChange={(e) => update("activeIngredient", e.target.value)} placeholder="ex: Paracétamol" required />
            <Input label="Dosage *" value={form.strength ?? ""} onChange={(e) => update("strength", e.target.value)} placeholder="ex: 500mg" required />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Forme pharmaceutique *</label>
              <select
                value={form.dosageForm ?? "comprimé"}
                onChange={(e) => update("dosageForm", e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              >
                {DOSAGE_FORMS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unité de mesure *</label>
              <select
                value={form.unitOfMeasure ?? "boîte"}
                onChange={(e) => update("unitOfMeasure", e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              >
                {UNITS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <Input label="Nombre d'unités par conditionnement" type="number" min={0} value={form.packagingSize ?? ""} onChange={(e) => update("packagingSize", e.target.value === "" ? undefined : e.target.value)} />
            <Input label="Code ATC (OMS)" placeholder="ex. N02BE01" value={form.atcCode ?? ""} onChange={(e) => update("atcCode", e.target.value)} />
            <Input label="Classe thérapeutique" placeholder="Libellé ou hiérarchie" value={form.therapeuticClass ?? ""} onChange={(e) => update("therapeuticClass", e.target.value)} />
            {form.isNarcotic && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Classification DEA</label>
                <select
                  value={form.deaSchedule ?? ""}
                  onChange={(e) => update("deaSchedule", e.target.value || undefined)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                >
                  {DEA_SCHEDULES.map((o) => (
                    <option key={o.value || "none"} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section: Classification §3.3 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Catégorie *</label>
              <select
                value={form.category ?? "medicine"}
                onChange={(e) => update("category", e.target.value as ProductCategory)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              >
                {(Object.keys(PRODUCT_CATEGORY_LABELS) as ProductCategory[]).map((c) => (
                  <option key={c} value={c}>{PRODUCT_CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type *</label>
              <select
                value={form.type ?? "otc"}
                onChange={(e) => update("type", e.target.value as ProductType)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              >
                {(Object.keys(PRODUCT_TYPE_LABELS) as ProductType[]).map((t) => (
                  <option key={t} value={t}>{PRODUCT_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <Input label="Code interne" value={form.internalCode ?? ""} onChange={(e) => update("internalCode", e.target.value)} />
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.requiresPrescription ?? false} onChange={(e) => update("requiresPrescription", e.target.checked)} className="rounded" />
                <span className="text-sm">Nécessite ordonnance</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isNarcotic ?? false} onChange={(e) => update("isNarcotic", e.target.checked)} className="rounded" />
                <span className="text-sm">Narcotique / substance contrôlée</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isColdChain ?? false} onChange={(e) => update("isColdChain", e.target.checked)} className="rounded" />
                <span className="text-sm">Chaîne du froid</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Section: Stockage & Prix §3.3 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stockage & Prix</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Conditions de stockage</label>
              <textarea
                value={form.storageConditions ?? ""}
                onChange={(e) => update("storageConditions", e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                placeholder="ex: À conserver à température ambiante, à l'abri de l'humidité"
              />
            </div>
            <Input label="Prix de référence" type="number" min={0} step="0.01" value={form.referencePrice ?? ""} onChange={(e) => update("referencePrice", e.target.value === "" ? undefined : e.target.value)} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(buildPath("/inventory/products"))}>Annuler</Button>
          <Button type="submit" disabled={createMutation.isPending || !form.name?.trim() || !form.barcode?.trim() || !form.manufacturer?.trim() || !form.activeIngredient?.trim()}>
            {createMutation.isPending ? "Création..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  );
}
