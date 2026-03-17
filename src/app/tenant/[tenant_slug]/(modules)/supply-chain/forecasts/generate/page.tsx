"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useCreateDemandForecast } from "@/hooks/api/useSupplyChain";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

const schema = z.object({
  product_name: z.string().min(2),
  period_start: z.string().min(1),
  period_end: z.string().min(1),
  predicted_quantity: z.string().min(1),
  method: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function GenerateForecastPage() {
  return (
    <ModuleGuard module="supply-chain" requiredPermissions={[Permission.SUPPLY_CHAIN_READ, Permission.DEMAND_FORECASTS_CREATE]}>
      <GenerateForecastForm />
    </ModuleGuard>
  );
}

function GenerateForecastForm() {
  const router = useRouter();
  const path = useTenantPath();
  const createForecast = useCreateDemandForecast();
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { product_name: "", period_start: "", period_end: "", predicted_quantity: "", method: "moving_average" },
  });
  const onSubmit = (data: FormData) => {
    createForecast.mutate(
      { ...data, predicted_quantity: parseInt(data.predicted_quantity, 10) } as unknown as Record<string, unknown>,
      { onSuccess: () => router.push(path("/supply-chain/forecasts")) },
    );
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={path("/supply-chain/forecasts")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Générer une prévision</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Créer une prévision de demande</p>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle>Paramètres</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Produit" {...register("product_name")} error={errors.product_name?.message} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Période début" type="date" {...register("period_start")} error={errors.period_start?.message} />
              <Input label="Période fin" type="date" {...register("period_end")} error={errors.period_end?.message} />
            </div>
            <Input label="Quantité prévue" type="number" {...register("predicted_quantity")} error={errors.predicted_quantity?.message} />
            <Controller name="method" control={control} render={({ field }) => <Select label="Méthode" value={field.value ?? "moving_average"} onChange={field.onChange} options={[{ value: "moving_average", label: "Moyenne mobile" }, { value: "exponential_smoothing", label: "Lissage exponentiel" }, { value: "linear_regression", label: "Régression linéaire" }, { value: "seasonal", label: "Saisonnier" }, { value: "manual", label: "Manuel" }]} />} />
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" asChild><Link href={path("/supply-chain/forecasts")}>Annuler</Link></Button>
              <Button type="submit" loading={createForecast.isPending}>Générer</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
