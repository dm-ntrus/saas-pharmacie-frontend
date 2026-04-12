"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useCreateProximityAlert, useVaccinationVials } from "@/hooks/api/useVaccination";
import { Button, Card, CardContent } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  vialId: z.string().min(1, "Sélectionnez un flacon"),
  ageMin: z.coerce.number().optional(),
  ageMax: z.coerce.number().optional(),
  withinDistanceKm: z.coerce.number().min(0).optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewProximityAlertPage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ, Permission.VACCINATION_WRITE]}
    >
      <NewProximityAlertContent />
    </ModuleGuard>
  );
}

function NewProximityAlertContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: vials } = useVaccinationVials();
  const create = useCreateProximityAlert();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const list = Array.isArray(vials) ? vials.filter((v) => v.status === "opened" && v.doses_remaining > 0) : [];

  const onSubmit = (data: FormData) => {
    create.mutate(
      {
        vialId: data.vialId,
        ageMin: data.ageMin,
        ageMax: data.ageMax,
        withinDistanceKm: data.withinDistanceKm,
      },
      { onSuccess: () => router.push(buildPath("/vaccination/proximity-alerts")) }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push(buildPath("/vaccination/proximity-alerts"))}
        >
          Retour
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Nouvelle alerte de proximité
      </h1>

      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Flacon à écouler</label>
              <select
                {...register("vialId")}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              >
                <option value="">Sélectionner</option>
                {list.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.vaccine_name} — {v.doses_remaining} doses
                  </option>
                ))}
              </select>
              {errors.vialId && (
                <p className="text-xs text-red-500">{errors.vialId.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Âge min (optionnel)</label>
                <input
                  type="number"
                  {...register("ageMin")}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Âge max (optionnel)</label>
                <input
                  type="number"
                  {...register("ageMax")}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rayon (km, optionnel)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("withinDistanceKm")}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={create.isPending}>
                {create.isPending ? "Création…" : "Créer l’alerte"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(buildPath("/vaccination/proximity-alerts"))}
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
