"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useCreateVial } from "@/hooks/api/useVaccination";
import { Button, Card, CardContent, ErrorBanner } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
const createVialSchema = z.object({
  vialNumber: z.string().min(1, "Requis"),
  gs1Datamatrix: z.string().optional(),
  lotNumber: z.string().min(1, "Requis"),
  productId: z.string().min(1, "Requis"),
  vaccineName: z.string().min(1, "Requis"),
  vaccineType: z.string().min(1, "Requis"),
  manufacturer: z.string().min(1, "Requis"),
  totalDoses: z.coerce.number().min(1),
  doseVolumeMl: z.coerce.number().min(0),
  sealedExpiryDate: z.string().min(1, "Requis"),
  stabilityHoursAfterOpening: z.coerce.number().min(0),
  unitCost: z.string().min(1, "Requis"),
});

type CreateVialForm = z.infer<typeof createVialSchema>;

export default function NewVialPage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ, Permission.VACCINATION_WRITE]}
    >
      <NewVialContent />
    </ModuleGuard>
  );
}

function NewVialContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const createVial = useCreateVial();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateVialForm>({
    resolver: zodResolver(createVialSchema),
    defaultValues: {
      totalDoses: 1,
      doseVolumeMl: 0.5,
      stabilityHoursAfterOpening: 6,
    },
  });

  const onSubmit = (data: CreateVialForm) => {
    createVial.mutate(
      {
        ...data,
        sealedExpiryDate: data.sealedExpiryDate,
      },
      {
        onSuccess: () => router.push(buildPath("/vaccination/vials")),
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push(buildPath("/vaccination/vials"))}
        >
          Retour
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Enregistrer un flacon
      </h1>

      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">N° flacon</label>
                <input
                  {...register("vialNumber")}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
                {errors.vialNumber && (
                  <p className="text-xs text-red-500">{errors.vialNumber.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">DataMatrix GS1</label>
                <input
                  {...register("gs1Datamatrix")}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">N° de lot</label>
                <input
                  {...register("lotNumber")}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
                {errors.lotNumber && (
                  <p className="text-xs text-red-500">{errors.lotNumber.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ID produit</label>
                <input
                  {...register("productId")}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
                {errors.productId && (
                  <p className="text-xs text-red-500">{errors.productId.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nom du vaccin</label>
                <input
                  {...register("vaccineName")}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
                {errors.vaccineName && (
                  <p className="text-xs text-red-500">{errors.vaccineName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type de vaccin</label>
                <input
                  {...register("vaccineType")}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
                {errors.vaccineType && (
                  <p className="text-xs text-red-500">{errors.vaccineType.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fabricant</label>
                <input
                  {...register("manufacturer")}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
                {errors.manufacturer && (
                  <p className="text-xs text-red-500">{errors.manufacturer.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nombre de doses</label>
                <input
                  type="number"
                  {...register("totalDoses")}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
                {errors.totalDoses && (
                  <p className="text-xs text-red-500">{errors.totalDoses.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Volume par dose (ml)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("doseVolumeMl")}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
                {errors.doseVolumeMl && (
                  <p className="text-xs text-red-500">{errors.doseVolumeMl.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date d’expiration (scellé)</label>
                <input
                  type="date"
                  {...register("sealedExpiryDate")}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
                {errors.sealedExpiryDate && (
                  <p className="text-xs text-red-500">{errors.sealedExpiryDate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Stabilité après ouverture (heures)
                </label>
                <input
                  type="number"
                  {...register("stabilityHoursAfterOpening")}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
                {errors.stabilityHoursAfterOpening && (
                  <p className="text-xs text-red-500">
                    {errors.stabilityHoursAfterOpening.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Coût unitaire</label>
                <input
                  {...register("unitCost")}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
                {errors.unitCost && (
                  <p className="text-xs text-red-500">{errors.unitCost.message}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={createVial.isPending}>
                {createVial.isPending ? "Enregistrement…" : "Enregistrer"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(buildPath("/vaccination/vials"))}
              >
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
