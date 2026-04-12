"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useQualityDocuments, useCreateTrainingRecord } from "@/hooks/api/useQuality";
import { createTrainingRecordSchema, type CreateTrainingRecordFormData } from "@/schemas/quality.schema";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

function safeId(id: string) {
  return typeof id === "string" && id.includes(":") ? id.split(":")[1] : id;
}

export default function NewTrainingRecordPage() {
  return (
    <ModuleGuard module="quality" requiredPermissions={[Permission.QUALITY_TRAINING_CREATE]}>
      <NewTrainingRecordContent />
    </ModuleGuard>
  );
}

function NewTrainingRecordContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: documents = [] } = useQualityDocuments();
  const createRecord = useCreateTrainingRecord();
  const docList = Array.isArray(documents) ? documents : [];
  const docOptions = docList.map((d: { id: string; title?: string }) => ({ value: safeId(d.id), label: (d.title ?? d.id) as string }));
  const defaultDate = new Date().toISOString().slice(0, 10);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreateTrainingRecordFormData>({
    resolver: zodResolver(createTrainingRecordSchema),
    defaultValues: {
      userId: "",
      documentId: "",
      trainingDate: defaultDate,
      completionDate: "",
      trainerName: "",
      trainingMethod: "presentiel",
      trainingDurationHours: 1,
      assessmentScore: undefined,
      competencyLevel: "beginner",
    },
  });

  const onSubmit = (data: CreateTrainingRecordFormData) => {
    createRecord.mutate(
      {
        userId: data.userId.includes(":") ? data.userId : data.userId,
        documentId: data.documentId.includes(":") ? data.documentId.split(":")[1] ?? data.documentId : data.documentId,
        trainingDate: new Date(data.trainingDate).toISOString(),
        completionDate: data.completionDate ? new Date(data.completionDate).toISOString() : undefined,
        trainerName: data.trainerName,
        trainingMethod: data.trainingMethod,
        trainingDurationHours: data.trainingDurationHours,
        assessmentScore: data.assessmentScore,
        competencyLevel: data.competencyLevel,
      },
      { onSuccess: () => router.push(buildPath("/quality/training")) }
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/quality/training"))} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Enregistrer une formation</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Document et participant</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Select label="Document" value={watch("documentId")} onChange={(v) => setValue("documentId", v)} options={[{ value: "", label: "Sélectionner" }, ...docOptions]} />
            <Input label="ID utilisateur (UUID)" {...register("userId")} error={errors.userId?.message} placeholder="UUID du participant" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Formation</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Date de formation" type="date" {...register("trainingDate")} error={errors.trainingDate?.message} />
            <Input label="Date de complétion (optionnel)" type="date" {...register("completionDate")} />
            <Input label="Formateur" {...register("trainerName")} error={errors.trainerName?.message} />
            <Input label="Méthode" {...register("trainingMethod")} error={errors.trainingMethod?.message} />
            <Input label="Durée (heures)" type="number" step="0.5" min="0" {...register("trainingDurationHours", { valueAsNumber: true })} error={errors.trainingDurationHours?.message} />
            <Input label="Score évaluation (0-100, optionnel)" type="number" min="0" max="100" {...register("assessmentScore", { valueAsNumber: true })} />
            <Input label="Niveau de compétence" {...register("competencyLevel")} error={errors.competencyLevel?.message} />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(buildPath("/quality/training"))}>Annuler</Button>
          <Button type="submit" disabled={createRecord.isPending}>Enregistrer la formation</Button>
        </div>
      </form>
    </div>
  );
}
