"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useCreateQualityDocument } from "@/hooks/api/useQuality";
import { createQualityDocumentSchema, type CreateQualityDocumentFormData } from "@/schemas/quality.schema";
import { DOCUMENT_TYPE_LABELS } from "@/types/quality";
import { DocumentType } from "@/types/quality";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

export default function NewQualityDocumentPage() {
  return (
    <ModuleGuard module="quality" requiredPermissions={[Permission.QUALITY_DOCUMENTS_CREATE]}>
      <NewQualityDocumentContent />
    </ModuleGuard>
  );
}

function NewQualityDocumentContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const createDoc = useCreateQualityDocument();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreateQualityDocumentFormData>({
    resolver: zodResolver(createQualityDocumentSchema),
    defaultValues: { type: DocumentType.PROCEDURE, title: "", description: "", effectiveDate: new Date().toISOString().slice(0, 10), reviewDate: "", content: "", trainingRequired: false },
  });

  const onSubmit = (data: CreateQualityDocumentFormData) => {
    createDoc.mutate(
      {
        type: data.type,
        title: data.title,
        description: data.description || undefined,
        effectiveDate: new Date(data.effectiveDate).toISOString(),
        reviewDate: data.reviewDate ? new Date(data.reviewDate).toISOString() : undefined,
        content: data.content || undefined,
        trainingRequired: data.trainingRequired,
      },
      { onSuccess: () => router.push(buildPath("/quality/documents")) }
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/quality/documents"))} leftIcon={<ArrowLeft className="w-4 h-4" />}>Retour</Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nouveau document qualite</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Type et dates</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Select label="Type" value={watch("type")} onChange={(v) => setValue("type", v as CreateQualityDocumentFormData["type"])} options={Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => ({ value, label }))} />
            <Input label="Date d'effet" type="date" {...register("effectiveDate")} error={errors.effectiveDate?.message} />
            <Input label="Date de revision (optionnel)" type="date" {...register("reviewDate")} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Contenu</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Titre" {...register("title")} error={errors.title?.message} placeholder="Titre du document" />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (optionnel)</label>
              <textarea className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]" {...register("description")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contenu (optionnel)</label>
              <textarea className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[120px]" {...register("content")} />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("trainingRequired")} className="rounded border-slate-300" />
              <span className="text-sm">Formation requise</span>
            </label>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(buildPath("/quality/documents"))}>Annuler</Button>
          <Button type="submit" disabled={createDoc.isPending}>{createDoc.isPending ? "Creation..." : "Creer le document"}</Button>
        </div>
      </form>
    </div>
  );
}
