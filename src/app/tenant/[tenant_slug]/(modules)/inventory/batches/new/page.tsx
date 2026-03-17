"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useOrganization } from "@/context/OrganizationContext";
import apiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { ArrowLeft, Save, Package } from "lucide-react";
import { toast } from "react-hot-toast";
import { formatCurrency } from "@/utils/formatters";

const batchFormSchema = z.object({
  product_id: z.string().min(1, "Le produit est requis"),
  batch_number: z.string().min(1, "Le numéro de lot est requis"),
  quantity: z.number({ invalid_type_error: "La quantité est requise" }).int().min(1, "La quantité doit être au moins 1"),
  unit_cost: z.number().min(0, "Le coût unitaire doit être positif"),
  selling_price: z.number().min(0, "Le prix de vente doit être positif"),
  expiry_date: z.string().min(1, "La date d'expiration est requise"),
  manufacture_date: z.string().optional(),
  received_date: z.string().optional(),
  supplier_name: z.string().optional(),
  notes: z.string().optional(),
});

type BatchFormData = z.infer<typeof batchFormSchema>;

export default function NewBatchPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.PRODUCT_BATCHES_CREATE]}>
      <NewBatchContent />
    </ModuleGuard>
  );
}

function NewBatchContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { currentOrganization } = useOrganization();
  const pharmacyId = currentOrganization?.id ?? "";
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<BatchFormData>({
    resolver: zodResolver(batchFormSchema),
    defaultValues: {
      product_id: "",
      batch_number: "",
      quantity: undefined as unknown as number,
      unit_cost: 0,
      selling_price: 0,
      expiry_date: "",
      manufacture_date: "",
      received_date: new Date().toISOString().split("T")[0],
      supplier_name: "",
      notes: "",
    },
  });

  const createBatch = useMutation({
    mutationFn: (data: BatchFormData) =>
      apiService.post(`/pharmacies/${pharmacyId}/products/${data.product_id}/batches`, data),
    onSuccess: () => {
      toast.success("Lot créé avec succès");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push(buildPath("/inventory"));
    },
    onError: () => toast.error("Erreur lors de la création du lot"),
  });

  const onSubmit = (data: BatchFormData) => {
    createBatch.mutate(data);
  };

  const watchedQuantity = watch("quantity") ?? 0;
  const watchedUnitCost = watch("unit_cost") ?? 0;
  const totalValue = watchedQuantity > 0 && watchedUnitCost > 0 ? watchedQuantity * watchedUnitCost : 0;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/inventory"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nouveau lot</h1>
          <p className="text-sm text-slate-500 mt-1">Enregistrer un nouveau lot de produit</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              Informations du lot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input label="ID Produit" required {...register("product_id")} placeholder="product:xxx" helperText="L'ID SurrealDB du produit" />
                {errors.product_id && <p className="text-sm text-red-500 mt-1">{errors.product_id.message}</p>}
              </div>
              <div>
                <Input label="Numéro de lot" required {...register("batch_number")} placeholder="LOT-2026-001" />
                {errors.batch_number && <p className="text-sm text-red-500 mt-1">{errors.batch_number.message}</p>}
              </div>
              <div>
                <Input label="Quantité" type="number" required min="1" {...register("quantity", { valueAsNumber: true })} />
                {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity.message}</p>}
              </div>
              <div>
                <Input label="Date d'expiration" type="date" required {...register("expiry_date")} />
                {errors.expiry_date && <p className="text-sm text-red-500 mt-1">{errors.expiry_date.message}</p>}
              </div>
              <div>
                <Input label="Date de fabrication" type="date" {...register("manufacture_date")} />
              </div>
              <div>
                <Input label="Date de réception" type="date" {...register("received_date")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Prix & Fournisseur</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input label="Coût unitaire (XOF)" type="number" min="0" {...register("unit_cost", { setValueAs: (v) => v === "" ? 0 : parseFloat(v) || 0 })} />
                {errors.unit_cost && <p className="text-sm text-red-500 mt-1">{errors.unit_cost.message}</p>}
              </div>
              <div>
                <Input label="Prix de vente (XOF)" type="number" min="0" {...register("selling_price", { setValueAs: (v) => v === "" ? 0 : parseFloat(v) || 0 })} />
                {errors.selling_price && <p className="text-sm text-red-500 mt-1">{errors.selling_price.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <Input label="Fournisseur" {...register("supplier_name")} placeholder="Ex: Pharma Distribution" />
              </div>
            </div>

            {totalValue > 0 && (
              <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <p className="text-sm text-emerald-700 dark:text-emerald-400">Valeur totale du lot</p>
                <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                  {formatCurrency(totalValue)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
            <textarea {...register("notes")} rows={3} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500" placeholder="Notes sur le lot..." />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => router.push(buildPath("/inventory"))}>Annuler</Button>
          <Button type="submit" leftIcon={<Save className="w-4 h-4" />} loading={createBatch.isPending} disabled={isSubmitting}>Enregistrer le lot</Button>
        </div>
      </form>
    </div>
  );
}
