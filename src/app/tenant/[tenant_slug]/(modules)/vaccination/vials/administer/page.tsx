"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useVaccinationVials, useOpenVial, useWithdrawDoses } from "@/hooks/api/useVaccination";
import { Button, Card, CardContent, ErrorBanner, Skeleton, EmptyState } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const openVialSchema = z.object({
  vialId: z.string().min(1),
  openedAt: z.string().min(1),
  openedBy: z.string().min(1),
  expectedDoses: z.coerce.number().min(1),
});

const withdrawSchema = z.object({
  vialId: z.string().min(1),
  dosesToWithdraw: z.coerce.number().min(1),
  administeredBy: z.string().min(1),
  appointmentId: z.string().optional(),
  notes: z.string().optional(),
});

type OpenVialForm = z.infer<typeof openVialSchema>;
type WithdrawForm = z.infer<typeof withdrawSchema>;

export default function AdministerVialPage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ, Permission.VACCINATION_WRITE]}
    >
      <AdministerVialContent />
    </ModuleGuard>
  );
}

function AdministerVialContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: vials, isLoading, error } = useVaccinationVials();
  const openVial = useOpenVial();
  const withdrawDoses = useWithdrawDoses();
  const [mode, setMode] = useState<"open" | "withdraw">("withdraw");

  const openForm = useForm<OpenVialForm>({
    resolver: zodResolver(openVialSchema),
    defaultValues: {
      openedAt: new Date().toISOString().slice(0, 16),
      expectedDoses: 1,
    },
  });

  const withdrawForm = useForm<WithdrawForm>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      dosesToWithdraw: 1,
    },
  });

  const list = Array.isArray(vials) ? vials : [];
  const openable = list.filter((v) => v.status === "sealed");
  const withdrawable = list.filter((v) => v.status === "opened" && v.doses_remaining > 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error) {
    return <ErrorBanner message="Erreur de chargement des flacons" onRetry={() => {}} />;
  }

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
        Administrer des doses
      </h1>
      <p className="text-sm text-slate-500">
        Ouvrir un flacon scellé ou retirer des doses d’un flacon ouvert.
      </p>

      <div className="flex gap-2">
        <Button
          variant={mode === "open" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("open")}
        >
          Ouvrir un flacon
        </Button>
        <Button
          variant={mode === "withdraw" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("withdraw")}
        >
          Retirer des doses
        </Button>
      </div>

      {mode === "open" && (
        <Card>
          <CardContent className="p-4">
            {openable.length === 0 ? (
              <EmptyState
                title="Aucun flacon scellé"
                description="Tous les flacons sont déjà ouverts ou épuisés."
              />
            ) : (
              <form
                onSubmit={openForm.handleSubmit((data) => {
                  openVial.mutate(
                    {
                      vialId: data.vialId,
                      dto: {
                        vialId: data.vialId,
                        openedAt: new Date(data.openedAt).toISOString(),
                        openedBy: data.openedBy,
                        expectedDoses: data.expectedDoses,
                      },
                    },
                    { onSuccess: () => openForm.reset() }
                  );
                })}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">Flacon à ouvrir</label>
                  <select
                    {...openForm.register("vialId")}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                  >
                    <option value="">Sélectionner</option>
                    {openable.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.vaccine_name} — Lot {v.lot_number}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date/heure d’ouverture</label>
                  <input
                    type="datetime-local"
                    {...openForm.register("openedAt")}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ouvert par</label>
                  <input
                    {...openForm.register("openedBy")}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Doses attendues</label>
                  <input
                    type="number"
                    {...openForm.register("expectedDoses")}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                  />
                </div>
                <Button type="submit" disabled={openVial.isPending}>
                  Ouvrir le flacon
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {mode === "withdraw" && (
        <Card>
          <CardContent className="p-4">
            {withdrawable.length === 0 ? (
              <EmptyState
                title="Aucun flacon à retrait"
                description="Aucun flacon ouvert avec des doses disponibles."
              />
            ) : (
              <form
                onSubmit={withdrawForm.handleSubmit((data) => {
                  withdrawDoses.mutate(
                    {
                      vialId: data.vialId,
                      dto: {
                        vialId: data.vialId,
                        dosesToWithdraw: data.dosesToWithdraw,
                        administeredBy: data.administeredBy,
                        appointmentId: data.appointmentId,
                        notes: data.notes,
                      },
                    },
                    { onSuccess: () => withdrawForm.reset() }
                  );
                })}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">Flacon</label>
                  <select
                    {...withdrawForm.register("vialId")}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                  >
                    <option value="">Sélectionner</option>
                    {withdrawable.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.vaccine_name} — {v.doses_remaining} doses restantes
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre de doses à retirer</label>
                  <input
                    type="number"
                    {...withdrawForm.register("dosesToWithdraw")}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Administré par</label>
                  <input
                    {...withdrawForm.register("administeredBy")}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ID RDV (optionnel)</label>
                  <input
                    {...withdrawForm.register("appointmentId")}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <input
                    {...withdrawForm.register("notes")}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                  />
                </div>
                <Button type="submit" disabled={withdrawDoses.isPending}>
                  Retirer les doses
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
