"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useProductById } from "@/hooks/api/useInventory";
import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_STATUS_LABELS,
  PRODUCT_TYPE_LABELS,
  ProductStatus,
} from "@/types/inventory";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  ErrorBanner,
  Skeleton,
} from "@/components/ui";
import {
  ArrowLeft,
  Edit,
  Package,
  Pill,
  Thermometer,
  Shield,
  Tag,
} from "lucide-react";

const STATUS_BADGE: Record<string, "success" | "danger" | "warning" | "default"> = {
  [ProductStatus.ACTIVE]: "success",
  [ProductStatus.DISCONTINUED]: "danger",
  [ProductStatus.PENDING_APPROVAL]: "warning",
};

export default function ProductDetailPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.INVENTORY_ITEMS_READ]}>
      <ProductDetailContent />
    </ModuleGuard>
  );
}

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const id = params?.id as string;

  const { data: product, isLoading, error, refetch } = useProductById(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <ErrorBanner
        message="Impossible de charger les détails du produit"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/inventory"))}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {product.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {product.sku && `SKU: ${product.sku}`}
              {product.sku && product.barcode && " • "}
              {product.barcode}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={STATUS_BADGE[product.status] ?? "default"}>
            {PRODUCT_STATUS_LABELS[product.status]}
          </Badge>
          <ProtectedAction permission={Permission.PRODUCTS_UPDATE}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit className="w-4 h-4" />}
            >
              Modifier
            </Button>
          </ProtectedAction>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                Identification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoField label="Nom" value={product.name} />
                <InfoField label="SKU" value={product.sku} />
                <InfoField label="Code-barres" value={product.barcode} />
                <InfoField label="Code interne" value={product.internal_code} />
                <InfoField label="Fabricant" value={product.manufacturer} />
                <InfoField label="Marque" value={product.brand} />
                {product.description && (
                  <div className="sm:col-span-2">
                    <InfoField label="Description" value={product.description} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Composition */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-blue-600" />
                Composition pharmaceutique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoField label="Principe actif" value={product.active_ingredient} />
                <InfoField label="Dosage" value={product.strength} />
                <InfoField label="Forme galénique" value={product.dosage_form} />
                <InfoField label="Unité de mesure" value={product.unit_of_measure} />
                {product.packaging_size && (
                  <InfoField
                    label="Conditionnement"
                    value={`${product.packaging_size} unités`}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Classification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-600" />
                Classification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoField
                label="Catégorie"
                value={PRODUCT_CATEGORY_LABELS[product.category]}
              />
              <InfoField
                label="Type"
                value={PRODUCT_TYPE_LABELS[product.type]}
              />
              <div className="flex flex-wrap gap-2 pt-2">
                {product.requires_prescription && (
                  <Badge variant="info">Ordonnance requise</Badge>
                )}
                {product.is_narcotic && (
                  <Badge variant="danger">Substance contrôlée</Badge>
                )}
                {product.is_cold_chain && (
                  <Badge variant="warning">
                    <Thermometer className="w-3 h-3 mr-1" />
                    Chaîne du froid
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Storage & Regulatory */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                Stockage & Réglementation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoField
                label="Conditions de stockage"
                value={product.storage_conditions}
              />
              {product.dea_schedule && (
                <InfoField label="Classe DEA" value={product.dea_schedule} />
              )}
              {product.reference_price && (
                <InfoField
                  label="Prix de référence"
                  value={`${parseFloat(product.reference_price).toLocaleString("fr-FR")} XOF`}
                />
              )}
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardContent className="p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Créé le</span>
                <span className="text-slate-900 dark:text-slate-100">
                  {new Date(product.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Modifié le</span>
                <span className="text-slate-900 dark:text-slate-100">
                  {new Date(product.updated_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">
        {value || "—"}
      </p>
    </div>
  );
}
