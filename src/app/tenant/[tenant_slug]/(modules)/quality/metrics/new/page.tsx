"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useCreateQualityMetric } from "@/hooks/api/useQuality";
import { createQualityMetricSchema, type CreateQualityMetricFormData } from "@/schemas/quality.schema";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

export default function NewQualityMetricPage() {
  return (
    <ModuleGuard module="quality" requiredPermissions={[Permission.QUALITY_METRICS_CREATE]}>
      <NewQualityMetricContent />
    </ModuleGuard>
  );
}

function NewQualityMetricContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const createMetric = useCreateQualityMetric();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateQualityMetricFormData>({
    resolver: zodResolver(createQualityMetricSchema),
    defaultValues: {
      metricType: "",
      metricName: "",
      description: "",
      targetValue: 0,
      measurementDate: new Date().toISOString().slice(0, 10),
      measurementPeriod: new Date().toISOString().slice(0, 7),
      notes: "",
      recordedBy: "",
    },
  });

  const onSubmit = (data: CreateQualityMetricFormData) => {
    createMetric.mutate(
      {
        metricType: data.metricType,
        metricName: data.metricName,
        description: data.description || undefined,
        targetValue: Number(data.targetValue),
        actualValue: data.actualValue != null ? Number(data.actualValue) : undefined,
        measurementDate: new Date(data.measurementDate).toISOString(),
        measurementPeriod: data.measurementPeriod,
        notes: data.notes || undefined,
        recordedBy: data.recordedBy,
      },
      { onSuccess: () => router.push(buildPath("/quality/metrics")) }
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/quality/metrics"))} leftIcon={<ArrowLeft />}>Retour</Button>
        <h1 className="text-2xl font-bold">Nouvelle métrique qualité</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Métrique</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Type" {...register("metricType")} error={errors.metricType?.message} />
            <Input label="Nom" {...register("metricName")} error={errors.metricName?.message} />
            <Input label="Description" {...register("description")} />
            <Input label="Valeur cible" type="number" step="any" {...register("targetValue", { valueAsNumber: true })} error={errors.targetValue?.message} />
            <Input label="Valeur réelle" type="number" step="any" {...register("actualValue", { valueAsNumber: true })} />
            <Input label="Date de mesure" type="date" {...register("measurementDate")} error={errors.measurementDate?.message} />
            <Input label="Période" {...register("measurementPeriod")} error={errors.measurementPeriod?.message} />
            <Input label="Enregistré par" {...register("recordedBy")} error={errors.recordedBy?.message} />
            <Input label="Notes" {...register("notes")} />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(buildPath("/quality/metrics"))}>Annuler</Button>
          <Button type="submit" disabled={createMetric.isPending}>Créer</Button>
        </div>
      </form>
    </div>
  );
}
