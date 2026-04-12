"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useReportAdverseEvent } from "@/hooks/api/useVaccination";
import { Button, Card, CardContent } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ADVERSE_EVENT_SEVERITY_LABELS } from "@/types/vaccination";

const reportSchema = z.object({
  injectionId: z.string().min(1, "Requis"),
  symptoms: z.string().min(1, "Liste des symptômes (séparés par des virgules)"),
  primarySymptom: z.string().min(1, "Requis"),
  symptomDescription: z.string().min(1, "Requis"),
  severity: z.enum(["mild", "moderate", "severe", "life_threatening"]),
  onsetAt: z.string().min(1, "Requis"),
  lifeThreatening: z.boolean().optional(),
  hospitalizationRequired: z.boolean().optional(),
  treatmentGiven: z.string().optional(),
});

type ReportForm = z.infer<typeof reportSchema>;

export default function NewAdverseEventPage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ, Permission.VACCINATION_WRITE]}
    >
      <NewAdverseEventContent />
    </ModuleGuard>
  );
}

function NewAdverseEventContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { buildPath } = useTenantPath();
  const injectionIdFromQuery = searchParams?.get("injectionId") ?? "";
  const report = useReportAdverseEvent();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      injectionId: injectionIdFromQuery,
      severity: "mild",
      onsetAt: new Date().toISOString().slice(0, 16),
    },
  });

  const onSubmit = (data: ReportForm) => {
    const symptomsList = data.symptoms.split(",").map((s) => s.trim()).filter(Boolean);
    report.mutate(
      {
        injectionId: data.injectionId,
        symptoms: symptomsList.length ? symptomsList : [data.primarySymptom],
        primarySymptom: data.primarySymptom,
        symptomDescription: data.symptomDescription,
        severity: data.severity,
        onsetAt: new Date(data.onsetAt).toISOString(),
        lifeThreatening: data.lifeThreatening,
        hospitalizationRequired: data.hospitalizationRequired,
        treatmentGiven: data.treatmentGiven,
      },
      {
        onSuccess: () => router.push(buildPath("/vaccination/adverse-events")),
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
          onClick={() => router.push(buildPath("/vaccination/adverse-events"))}
        >
          Retour
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Déclarer un effet indésirable
      </h1>

      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">ID de l’injection</label>
              <input
                {...register("injectionId")}
                placeholder="ID de l’injection concernée"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              />
              {errors.injectionId && (
                <p className="text-xs text-red-500">{errors.injectionId.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Symptômes (séparés par des virgules)
              </label>
              <input
                {...register("symptoms")}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              />
              {errors.symptoms && (
                <p className="text-xs text-red-500">{errors.symptoms.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Symptôme principal</label>
              <input
                {...register("primarySymptom")}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              />
              {errors.primarySymptom && (
                <p className="text-xs text-red-500">{errors.primarySymptom.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                {...register("symptomDescription")}
                rows={3}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              />
              {errors.symptomDescription && (
                <p className="text-xs text-red-500">{errors.symptomDescription.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sévérité</label>
              <select
                {...register("severity")}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              >
                {(["mild", "moderate", "severe", "life_threatening"] as const).map((s) => (
                  <option key={s} value={s}>
                    {ADVERSE_EVENT_SEVERITY_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date et heure de survenue</label>
              <input
                type="datetime-local"
                {...register("onsetAt")}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              />
              {errors.onsetAt && (
                <p className="text-xs text-red-500">{errors.onsetAt.message}</p>
              )}
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register("lifeThreatening")} />
                <span className="text-sm">Potentiellement mortel</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register("hospitalizationRequired")} />
                <span className="text-sm">Hospitalisation requise</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Traitement administré</label>
              <input
                {...register("treatmentGiven")}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={report.isPending}>
                {report.isPending ? "Envoi…" : "Déclarer"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(buildPath("/vaccination/adverse-events"))}
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
