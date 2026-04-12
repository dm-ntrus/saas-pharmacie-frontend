"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useCreateQualityEvent } from "@/hooks/api/useQuality";
import { createQualityEventSchema, type CreateQualityEventFormData } from "@/schemas/quality.schema";
import { QUALITY_EVENT_TYPE_LABELS, QUALITY_EVENT_SEVERITY_LABELS } from "@/types/quality";
import { QualityEventSeverity, QualityEventType } from "@/types/quality";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

export default function NewQualityEventPage() {
  return (
    <ModuleGuard
      module="quality"
      requiredPermissions={[Permission.QUALITY_EVENTS_CREATE]}
    >
      <NewQualityEventContent />
    </ModuleGuard>
  );
}

function NewQualityEventContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const createEvent = useCreateQualityEvent();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreateQualityEventFormData>({
    resolver: zodResolver(createQualityEventSchema),
    defaultValues: {
      type: QualityEventType.DEVIATION,
      severity: QualityEventSeverity.MEDIUM,
      title: "",
      description: "",
      reportedBy: "",
      assignedTo: "",
      occurredAt: new Date().toISOString().slice(0, 16),
    },
  });

  const onSubmit = (data: CreateQualityEventFormData) => {
    createEvent.mutate(
      {
        ...data,
        occurredAt: new Date(data.occurredAt).toISOString(),
        assignedTo: data.assignedTo || undefined,
      },
      {
        onSuccess: () => router.push(buildPath("/quality/events")),
      }
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(buildPath("/quality/events"))}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Retour
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Signaler un événement qualité
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Type et sévérité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Type"
              value={watch("type")}
              onChange={(v) => setValue("type", v as CreateQualityEventFormData["type"])}
              options={(Object.keys(QUALITY_EVENT_TYPE_LABELS) as CreateQualityEventFormData["type"][]).map((t) => ({
                value: t,
                label: QUALITY_EVENT_TYPE_LABELS[t],
              }))}
            />
            <Select
              label="Sévérité"
              value={watch("severity")}
              onChange={(v) => setValue("severity", v as CreateQualityEventFormData["severity"])}
              options={(Object.keys(QUALITY_EVENT_SEVERITY_LABELS) as CreateQualityEventFormData["severity"][]).map((s) => ({
                value: s,
                label: QUALITY_EVENT_SEVERITY_LABELS[s],
              }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Titre"
              {...register("title")}
              error={errors.title?.message}
              placeholder="Titre court"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[100px]"
                {...register("description")}
                placeholder="Description détaillée"
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>
            <Input
              label="Signalé par"
              {...register("reportedBy")}
              error={errors.reportedBy?.message}
              placeholder="Nom"
            />
            <Input
              label="Assigné à (optionnel)"
              {...register("assignedTo")}
              placeholder="Responsable"
            />
            <Input
              label="Date de survenue"
              type="datetime-local"
              {...register("occurredAt")}
              error={errors.occurredAt?.message}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(buildPath("/quality/events"))}>
            Annuler
          </Button>
          <Button type="submit" disabled={createEvent.isPending}>
            {createEvent.isPending ? "Création..." : "Créer l'événement"}
          </Button>
        </div>
      </form>
    </div>
  );
}
