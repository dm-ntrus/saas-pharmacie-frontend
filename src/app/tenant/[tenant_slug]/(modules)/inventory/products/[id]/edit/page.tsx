"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useProductById, useUpdateProduct } from "@/hooks/api/useInventory";
import type { CreateProductPayload, ProductCategory, ProductType, ProductStatus } from "@/types/inventory";
import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_TYPE_LABELS,
  PRODUCT_STATUS_LABELS,
} from "@/types/inventory";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, ErrorBanner, Skeleton } from "@/components/ui";
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

export default function EditProductPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.PRODUCTS_UPDATE]}>
      <EditProductContent />
    </ModuleGuard>
  );
}

function toPayload(p: any): Partial<CreateProductPayload> & { status?: ProductStatus } {
  return {
    name: p.name ?? "",
    barcode: p.barcode ?? "",
    sku: p.sku ?? "",
    manufacturer: p.manufacturer ?? "",
    brand: p.brand ?? "",
    description: p.description ?? "",
    activeIngredient: p.active_ingredient ?? p.activeIngredient ?? "",
    strength: p.strength ?? "",
    dosageForm: p.dosage_form ?? p.dosageForm ?? "comprimé",
    unitOfMeasure: p.unit_of_measure ?? p.unitOfMeasure ?? "boîte",
    packagingSize: p.packaging_size ?? p.packagingSize,
    deaSchedule: p.dea_schedule ?? p.deaSchedule ?? "",
    category: (p.category as ProductCategory) ?? "medicine",
    type: (p.type as ProductType) ?? "otc",
    internalCode: p.internal_code ?? p.internalCode ?? "",
    requiresPrescription: p.requires_prescription ?? p.requiresPrescription ?? false,
    isNarcotic: p.is_narcotic ?? p.isNarcotic ?? false,
    isColdChain: p.is_cold_chain ?? p.isColdChain ?? false,
    storageConditions: p.storage_conditions ?? p.storageConditions ?? "",
    referencePrice: p.reference_price ?? p.referencePrice,
    status: p.status as ProductStatus,
    primaryImageUrl: p.primary_image_url ?? p.primaryImageUrl ?? "",
    atcCode: p.atc_code ?? p.atcCode ?? "",
    therapeuticClass: p.therapeutic_class ?? p.therapeuticClass ?? "",
  };
}

function EditProductContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { buildPath } = useTenantPath();
  const { data: product, isLoading, error, refetch } = useProductById(id);
  const updateMutation = useUpdateProduct();
  const [form, setForm] = useState<Partial<CreateProductPayload> & { status?: ProductStatus }>({});

  useEffect(() => {
    if (product) setForm(toPayload(product));
  }, [product]);

  const update = (key: keyof CreateProductPayload | "status", value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<CreateProductPayload> & { status?: ProductStatus } = { ...form };
    updateMutation.mutate(
      { id, data: payload },
      { onSuccess: () => router.push(buildPath(`/inventory/products/${id}`)) },
    );
  };

  if (isLoading || !product) return <Skeleton className="h-64 w-full" />;
  if (error) return <ErrorBanner message="Produit introuvable" onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath(`/inventory/products/${id}`))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Modifier le produit</h1>
          <p className="text-sm text-slate-500">{form.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Nom *" value={form.name ?? ""} onChange={(e) => update("name", e.target.value)} required />
            <Input label="Code-barres *" value={form.barcode ?? ""} onChange={(e) => update("barcode", e.target.value)} required />
            <Input label="SKU" value={form.sku ?? ""} onChange={(e) => update("sku", e.target.value)} />
            <Input label="Fabricant *" value={form.manufacturer ?? ""} onChange={(e) => update("manufacturer", e.target.value)} required />
            <Input label="Marque" value={form.brand ?? ""} onChange={(e) => update("brand", e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea value={form.description ?? ""} onChange={(e) => update("description", e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Statut</label>
              <select value={form.status ?? "active"} onChange={(e) => update("status", e.target.value as ProductStatus)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm">
                {(Object.keys(PRODUCT_STATUS_LABELS) as ProductStatus[]).map((s) => (
                  <option key={s} value={s}>{PRODUCT_STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Caractéristiques pharmaceutiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="DCI *" value={form.activeIngredient ?? ""} onChange={(e) => update("activeIngredient", e.target.value)} required />
            <Input label="Dosage *" value={form.strength ?? ""} onChange={(e) => update("strength", e.target.value)} required />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Forme pharmaceutique</label>
              <select value={form.dosageForm ?? "comprimé"} onChange={(e) => update("dosageForm", e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm">
                {DOSAGE_FORMS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unité de mesure</label>
              <select value={form.unitOfMeasure ?? "boîte"} onChange={(e) => update("unitOfMeasure", e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm">
                {UNITS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </select>
            </div>
            <Input label="Code ATC (OMS)" placeholder="ex. N02BE01" value={form.atcCode ?? ""} onChange={(e) => update("atcCode", e.target.value)} />
            <Input label="Classe thérapeutique" placeholder="Libellé ou hiérarchie" value={form.therapeuticClass ?? ""} onChange={(e) => update("therapeuticClass", e.target.value)} />
            <Input label="Conditionnement (nb unités)" type="number" min={0} value={form.packagingSize ?? ""} onChange={(e) => update("packagingSize", e.target.value === "" ? undefined : e.target.value)} />
            {form.isNarcotic && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Classification DEA</label>
                <select value={form.deaSchedule ?? ""} onChange={(e) => update("deaSchedule", e.target.value || undefined)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm">
                  {DEA_SCHEDULES.map((o) => (<option key={o.value || "n"} value={o.value}>{o.label}</option>))}
                </select>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Classification & stockage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Catégorie</label>
              <select value={form.category ?? "medicine"} onChange={(e) => update("category", e.target.value as ProductCategory)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm">
                {(Object.keys(PRODUCT_CATEGORY_LABELS) as ProductCategory[]).map((c) => (<option key={c} value={c}>{PRODUCT_CATEGORY_LABELS[c]}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
              <select value={form.type ?? "otc"} onChange={(e) => update("type", e.target.value as ProductType)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm">
                {(Object.keys(PRODUCT_TYPE_LABELS) as ProductType[]).map((t) => (<option key={t} value={t}>{PRODUCT_TYPE_LABELS[t]}</option>))}
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
                <span className="text-sm">Narcotique</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isColdChain ?? false} onChange={(e) => update("isColdChain", e.target.checked)} className="rounded" />
                <span className="text-sm">Chaîne du froid</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Conditions de stockage</label>
              <textarea value={form.storageConditions ?? ""} onChange={(e) => update("storageConditions", e.target.value)} rows={2} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm" />
            </div>
            <Input label="Prix de référence" type="number" min={0} step="0.01" value={form.referencePrice ?? ""} onChange={(e) => update("referencePrice", e.target.value === "" ? undefined : e.target.value)} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(buildPath(`/inventory/products/${id}`))}>Annuler</Button>
          <Button type="submit" disabled={updateMutation.isPending || !form.name?.trim() || !form.barcode?.trim()}>{updateMutation.isPending ? "Enregistrement..." : "Enregistrer"}</Button>
        </div>
      </form>
    </div>
  );
}
