"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useProductById } from "@/hooks/api/useInventory";
import type { Product, ProductCategory, ProductType, ProductStatus } from "@/types/inventory";
import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_TYPE_LABELS,
  PRODUCT_STATUS_LABELS,
} from "@/types/inventory";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft, Package, Pencil } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

export default function ProductDetailPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.PRODUCTS_READ]}>
      <ProductDetailContent />
    </ModuleGuard>
  );
}

function ProductDetailContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { buildPath } = useTenantPath();
  const { data: product, isLoading, error, refetch } = useProductById(id);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (error || !product) return <ErrorBanner message="Produit introuvable" onRetry={() => refetch()} />;

  const p = product as any;
  const name = p.name ?? "";
  const barcode = p.barcode ?? "";
  const manufacturer = p.manufacturer ?? p.manufacturer ?? "";
  const activeIngredient = p.active_ingredient ?? p.activeIngredient ?? "";
  const strength = p.strength ?? "";
  const dosageForm = p.dosage_form ?? p.dosageForm ?? "";
  const unitOfMeasure = p.unit_of_measure ?? p.unitOfMeasure ?? "";
  const category = p.category as ProductCategory;
  const type = p.type as ProductType;
  const status = p.status as ProductStatus;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/inventory/products"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{name}</h1>
            <p className="text-sm text-slate-500">{activeIngredient} · {strength}</p>
          </div>
        </div>
        <ProtectedAction permission={Permission.PRODUCTS_UPDATE}>
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath(`/inventory/products/${id}/edit`))} leftIcon={<Pencil className="h-4 w-4" />}>
            Modifier
          </Button>
        </ProtectedAction>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Code-barres</span><span className="font-medium">{barcode}</span></div>
            {p.sku && <div className="flex justify-between"><span className="text-slate-500">SKU</span><span>{p.sku}</span></div>}
            <div className="flex justify-between"><span className="text-slate-500">Fabricant</span><span>{manufacturer}</span></div>
            {p.brand && <div className="flex justify-between"><span className="text-slate-500">Marque</span><span>{p.brand}</span></div>}
            <div className="flex justify-between"><span className="text-slate-500">Statut</span>
              <Badge variant={status === "active" ? "success" : status === "discontinued" ? "danger" : "default"}>{PRODUCT_STATUS_LABELS[status] ?? status}</Badge>
            </div>
            {p.description && <div><span className="text-slate-500">Description</span><p className="mt-1">{p.description}</p></div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Caractéristiques & classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">DCI</span><span>{activeIngredient}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Dosage</span><span>{strength}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Forme</span><span>{dosageForm}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Unité</span><span>{unitOfMeasure}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Catégorie</span><span>{PRODUCT_CATEGORY_LABELS[category] ?? category}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Type</span><span>{PRODUCT_TYPE_LABELS[type] ?? type}</span></div>
            {(p.requires_prescription ?? p.requiresPrescription) && <div className="flex justify-between"><span className="text-slate-500">Ordonnance</span><span>Requis</span></div>}
            {(p.reference_price ?? p.referencePrice) != null && (
              <div className="flex justify-between"><span className="text-slate-500">Prix de référence</span><span>{formatCurrency(p.reference_price ?? p.referencePrice)}</span></div>
            )}
            {p.storage_conditions ?? p.storageConditions ? <div><span className="text-slate-500">Stockage</span><p className="mt-1">{p.storage_conditions ?? p.storageConditions}</p></div> : null}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/inventory/batches/new"))}>Créer un lot</Button>
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/inventory/batches") + `?productId=${id}`)}>Voir les lots</Button>
      </div>
    </div>
  );
}
