"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useDemandForecasts, useCreateDemandForecast } from "@/hooks/api/useSupplyChain";
import { Card, CardContent, Button, Input, Modal, Select, Skeleton, EmptyState, ErrorBanner } from "@/components/ui";
import { formatDate, formatNumber } from "@/utils/formatters";
import { ArrowLeft, Plus, TrendingUp } from "lucide-react";

const forecastSchema = z.object({ product_name: z.string().min(2), period_start: z.string().min(1), period_end: z.string().min(1), predicted_quantity: z.string().min(1), method: z.string().optional() });
type ForecastFormData = z.infer<typeof forecastSchema>;

export default function SupplyChainForecastsPage() {
  return (
    <ModuleGuard module="supply-chain" requiredPermissions={[Permission.SUPPLY_CHAIN_READ, Permission.DEMAND_FORECASTS_READ]}>
      <ForecastsContent />
    </ModuleGuard>
  );
}

function ForecastsContent() {
  const { buildPath } = useTenantPath();
  const { data: forecastsData, isLoading, error, refetch } = useDemandForecasts();
  const createForecast = useCreateDemandForecast();
  const [createOpen, setCreateOpen] = useState(false);
  const raw = forecastsData?.data ?? forecastsData;
  const forecasts = Array.isArray(raw) ? raw : [];
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ForecastFormData>({ resolver: zodResolver(forecastSchema), defaultValues: { product_name: "", period_start: "", period_end: "", predicted_quantity: "", method: "moving_average" } });
  const onSubmit = (data: ForecastFormData) => {
    createForecast.mutate({ ...data, predicted_quantity: parseInt(data.predicted_quantity, 10) } as unknown as Record<string, unknown>, { onSuccess: () => { setCreateOpen(false); reset(); } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild><Link href={buildPath("/supply-chain")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link></Button>
          <div><h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Prévisions de demande</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{forecasts.length} prévision(s)</p></div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild><Link href={buildPath("/supply-chain/forecasts/generate")}>Générer</Link></Button>
          <ProtectedAction permission={Permission.DEMAND_FORECASTS_CREATE}><Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>Nouvelle prévision</Button></ProtectedAction>
        </div>
      </div>
      {isLoading ? <Skeleton className="h-48 w-full" /> : error ? <ErrorBanner title="Erreur" message="Impossible de charger les prévisions" onRetry={() => refetch()} /> : forecasts.length === 0 ? <EmptyState icon={<TrendingUp className="w-8 h-8 text-slate-400" />} title="Aucune prévision" description="Créez des prévisions ou générez-en." /> : (
        <Card><CardContent className="p-0"><div className="divide-y divide-slate-100 dark:divide-slate-800">
          {forecasts.map((f: Record<string, unknown>) => (
            <div key={String(f.id)} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0"><TrendingUp className="w-5 h-5 text-indigo-600" /></div>
                <div className="min-w-0"><p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{String(f.product_name ?? "Produit")}</p><p className="text-xs text-slate-500">{formatDate(f.period_start as string)} — {formatDate(f.period_end as string)} • {String(f.method ?? "—")}</p></div>
              </div>
              <div className="shrink-0 text-right"><p className="text-sm font-semibold">Prévu: {formatNumber(Number(f.predicted_quantity ?? 0))}</p>{f.actual_quantity != null && <p className="text-xs text-slate-500">Réel: {formatNumber(Number(f.actual_quantity))}</p>}</div>
            </div>
          ))}
        </div></CardContent></Card>
      )}
      <Modal open={createOpen} onOpenChange={setCreateOpen} title="Nouvelle prévision" size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Produit" {...register("product_name")} error={errors.product_name?.message} />
          <div className="grid grid-cols-2 gap-4"><Input label="Période début" type="date" {...register("period_start")} error={errors.period_start?.message} /><Input label="Période fin" type="date" {...register("period_end")} error={errors.period_end?.message} /></div>
          <Input label="Quantité prévue" type="number" {...register("predicted_quantity")} error={errors.predicted_quantity?.message} />
          <Controller name="method" control={control} render={({ field }) => <Select label="Méthode" value={field.value ?? "moving_average"} onChange={field.onChange} options={[{ value: "moving_average", label: "Moyenne mobile" }, { value: "exponential_smoothing", label: "Lissage exponentiel" }, { value: "linear_regression", label: "Régression linéaire" }, { value: "seasonal", label: "Saisonnier" }, { value: "manual", label: "Manuel" }]} />} />
          <div className="flex justify-end gap-2 pt-2"><Button variant="outline" type="button" onClick={() => { setCreateOpen(false); reset(); }}>Annuler</Button><Button type="submit" loading={createForecast.isPending}>Créer</Button></div>
        </form>
      </Modal>
    </div>
  );
}
