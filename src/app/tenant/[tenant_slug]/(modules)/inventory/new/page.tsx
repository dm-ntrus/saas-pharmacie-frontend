"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useCreateProduct } from "@/hooks/api/useInventory";
import {
  ProductCategory,
  ProductType,
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_TYPE_LABELS,
} from "@/types/inventory";
import { createProductSchema, type CreateProductFormData } from "@/schemas/inventory.schema";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/ui";
import { ArrowLeft, Save } from "lucide-react";

export default function NewProductPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.INVENTORY_ITEMS_CREATE]}>
      <NewProductContent />
    </ModuleGuard>
  );
}

function NewProductContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const createProduct = useCreateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      barcode: "",
      manufacturer: "",
      activeIngredient: "",
      strength: "",
      dosageForm: "",
      unitOfMeasure: "",
      category: "medicine" as CreateProductFormData["category"],
      type: "otc" as CreateProductFormData["type"],
      requiresPrescription: false,
      isNarcotic: false,
      isColdChain: false,
    },
  });

  const onSubmit = (data: CreateProductFormData) => {
    createProduct.mutate(data as any, {
      onSuccess: () => router.push(buildPath("/inventory")),
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
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
            Nouveau produit
          </h1>
          <p className="text-sm text-slate-500">
            Ajoutez un nouveau produit au catalogue
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Identification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Nom du produit"
                  required
                  {...register("name")}
                  placeholder="Ex: Paracétamol 500mg"
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Input
                  label="Code-barres (EAN/GTIN)"
                  required
                  {...register("barcode")}
                  placeholder="3400930001234"
                />
                {errors.barcode && <p className="text-sm text-red-500 mt-1">{errors.barcode.message}</p>}
              </div>
              <div>
                <Input
                  label="SKU (optionnel)"
                  {...register("sku")}
                  placeholder="PARA-500-001"
                />
              </div>
              <div>
                <Input
                  label="Code interne (optionnel)"
                  {...register("internalCode")}
                />
              </div>
              <div>
                <Input
                  label="Fabricant"
                  required
                  {...register("manufacturer")}
                />
                {errors.manufacturer && <p className="text-sm text-red-500 mt-1">{errors.manufacturer.message}</p>}
              </div>
              <div>
                <Input
                  label="Marque (optionnel)"
                  {...register("brand")}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description (optionnel)
                </label>
                <textarea
                  {...register("description")}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Composition pharmaceutique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Principe actif"
                  required
                  {...register("activeIngredient")}
                  placeholder="Paracétamol"
                />
                {errors.activeIngredient && <p className="text-sm text-red-500 mt-1">{errors.activeIngredient.message}</p>}
              </div>
              <div>
                <Input
                  label="Dosage"
                  required
                  {...register("strength")}
                  placeholder="500mg"
                />
                {errors.strength && <p className="text-sm text-red-500 mt-1">{errors.strength.message}</p>}
              </div>
              <div>
                <Input
                  label="Forme galénique"
                  required
                  {...register("dosageForm")}
                  placeholder="Comprimé"
                />
                {errors.dosageForm && <p className="text-sm text-red-500 mt-1">{errors.dosageForm.message}</p>}
              </div>
              <div>
                <Input
                  label="Unité de mesure"
                  required
                  {...register("unitOfMeasure")}
                  placeholder="Boîte de 16"
                />
                {errors.unitOfMeasure && <p className="text-sm text-red-500 mt-1">{errors.unitOfMeasure.message}</p>}
              </div>
              <div>
                <Input
                  label="Taille conditionnement"
                  type="number"
                  min="1"
                  {...register("packagingSize", { setValueAs: (v) => v === "" ? undefined : parseInt(v) })}
                  placeholder="30"
                />
                {errors.packagingSize && <p className="text-sm text-red-500 mt-1">{errors.packagingSize.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Classification & Réglementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Catégorie
                </label>
                <select
                  {...register("category")}
                  className="w-full h-10 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {Object.values(ProductCategory).map((cat) => (
                    <option key={cat} value={cat}>
                      {PRODUCT_CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Type
                </label>
                <select
                  {...register("type")}
                  className="w-full h-10 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {Object.values(ProductType).map((t) => (
                    <option key={t} value={t}>
                      {PRODUCT_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Input
                  label="Conditions de stockage"
                  {...register("storageConditions")}
                  placeholder="15-25°C"
                />
              </div>
              <div>
                <Input
                  label="Prix de référence"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("referencePrice", { setValueAs: (v) => v === "" ? undefined : parseFloat(v) })}
                />
                {errors.referencePrice && <p className="text-sm text-red-500 mt-1">{errors.referencePrice.message}</p>}
              </div>

              <div className="sm:col-span-2 flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("requiresPrescription")}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Ordonnance requise
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("isNarcotic")}
                    className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Substance contrôlée
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("isColdChain")}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Chaîne du froid (2-8°C)
                  </span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push(buildPath("/inventory"))}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            leftIcon={<Save className="w-4 h-4" />}
            loading={createProduct.isPending}
            disabled={isSubmitting}
          >
            Créer le produit
          </Button>
        </div>
      </form>
    </div>
  );
}
