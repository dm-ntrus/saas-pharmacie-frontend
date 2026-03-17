"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useQualityEvents, useCreateCAPA } from "@/hooks/api/useQuality";
import { createCAPASchema, type CreateCAPAFormData } from "@/schemas/quality.schema";
import { CAPA_TYPE_LABELS } from "@/types/quality";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

function safeId(id: string) {
  return typeof id === "string" && id.includes(":") ? id.split(":")[1] : id;
}

export default function NewCAPAPage() {
  return (
    <ModuleGuard module="quality" requiredPermissions={[Permission.QUALITY_CAPAS_CREATE]}>
      <NewCAPAContent />
    </ModuleGuard>
  );
}

function NewCAPAContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: events = [] } = useQualityEvents();
  const createCAPA = useCreateCAPA();
  const eventList = Array.isArray(events) ? events : [];
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreateCAPAFormData>({
    resolver: zodResolver(createCAPASchema),
    defaultValues: {
      qualityEventId: "",
      type: "corrective",
      title: "",
      description: "",
      assignedTo: "",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    },
  });

  const eventOptions = eventList.map((e: { id: string; title?: string; event_number?: string }) => ({
    value: safeId(e.id),
    label: (e.title ?? e.event_number ?? e.id) as string,
  }));

  const onSubmit = (data: CreateCAPAFormData) => {
    createCAPA.mutate(
      {
        qualityEventId: data.qualityEventId.includes(":") ? data.qualityEventId.split(":")[1] ?? data.qualityEventId : data.qualityEventId,
        type: data.type,
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo,
        dueDate: new Date(data.dueDate).toISOString(),
      },
      { onSuccess: () => router.push(buildPath("/quality/capas")) }
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/quality/capas"))} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Retour
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nouvelle CAPA</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Événement et type</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Événement qualité lié"
              value={watch("qualityEventId")}
              onChange={(v) => setValue("qualityEventId", v)}
              options={[{ value: "", label: "— Sélectionner —" }, ...eventOptions]}
            />
            <Select
              label="Type"
              value={watch("type")}
              onChange={(v) => setValue("type", v as CreateCAPAFormData["type"])}
              options={(Object.keys(CAPA_TYPE_LABELS) as CreateCAPAFormData["type"][]).map((t) => ({ value: t, label: CAPA_TYPE_LABELS[t] }))}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Description et responsable</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Titre" {...register("title")} error={errors.title?.message} placeholder="Titre de la CAPA" />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[100px]" {...register("description")} placeholder="Description des actions" />
              {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
            </div>
            <Input label="Responsable" {...register("assignedTo")} error={errors.assignedTo?.message} placeholder="Nom du responsable" />
            <Input label="Date d'échéance" type="date" {...register("dueDate")} error={errors.dueDate?.message} />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(buildPath("/quality/capas"))}>Annuler</Button>
          <Button type="submit" disabled={createCAPA.isPending}>{createCAPA.isPending ? "Création..." : "Créer la CAPA"}</Button>
        </div>
      </form>
    </div>
  );
}
