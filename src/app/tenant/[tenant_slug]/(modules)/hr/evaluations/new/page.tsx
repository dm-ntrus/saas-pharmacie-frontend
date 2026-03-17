"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useAuth } from "@/context/AuthContext";
import { Permission } from "@/types/permissions";
import { useCreateEvaluation, useEmployees } from "@/hooks/api/useHR";
import { createEvaluationSchema, type CreateEvaluationFormData } from "@/schemas/hr.schema";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

function safeId(id: string) {
  return typeof id === "string" && id.includes(":") ? id.split(":")[1] : id;
}

export default function NewEvaluationPage() {
  return (
    <ModuleGuard module="hr" requiredPermissions={[Permission.EVALUATIONS_CREATE]}>
      <NewEvaluationContent />
    </ModuleGuard>
  );
}

function NewEvaluationContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { user } = useAuth();
  const createEvaluation = useCreateEvaluation();
  const { data: employees = [] } = useEmployees({ status: "active" });
  const empList = Array.isArray(employees) ? employees : [];
  const empOptions = empList.map((e: { id: string; first_name?: string; last_name?: string }) => ({
    value: e.id,
    label: `${e.first_name ?? ""} ${e.last_name ?? ""}`.trim() || String(e.id),
  }));
  const evaluatorId = user?.id ?? "";
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreateEvaluationFormData>({
    resolver: zodResolver(createEvaluationSchema),
    defaultValues: {
      employee_id: "",
      evaluator_id: evaluatorId,
      evaluation_type: "annual",
      evaluation_period_start: new Date().getFullYear() + "-01-01",
      evaluation_period_end: new Date().getFullYear() + "-12-31",
    },
  });

  const onSubmit = (data: CreateEvaluationFormData) => {
    createEvaluation.mutate(
      {
        ...data,
        evaluator_id: data.evaluator_id || evaluatorId,
        evaluation_period_start: new Date(data.evaluation_period_start).toISOString(),
        evaluation_period_end: new Date(data.evaluation_period_end).toISOString(),
      },
      {
        onSuccess: (res) => {
          const id = res?.id ? safeId(String(res.id)) : "";
          router.push(buildPath("/hr/evaluations/" + id));
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/hr/evaluations"))} leftIcon={<ArrowLeft />}>Retour</Button>
        <h1 className="text-2xl font-bold">Nouvelle evaluation</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Evaluation</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Select label="Employe" value={watch("employee_id")} onChange={(v) => setValue("employee_id", v)} options={[{ value: "", label: "Selectionner" }, ...empOptions]} />
            <Input label="Evaluateur (ID)" {...register("evaluator_id")} error={errors.evaluator_id?.message} />
            <Input label="Debut periode" type="date" {...register("evaluation_period_start")} error={errors.evaluation_period_start?.message} />
            <Input label="Fin periode" type="date" {...register("evaluation_period_end")} error={errors.evaluation_period_end?.message} />
            <Input label="Note globale (1-5)" type="number" min={1} max={5} {...register("overall_rating", { valueAsNumber: true })} />
            <div>
              <label className="block text-sm font-medium mb-1">Points forts</label>
              <textarea className="w-full rounded-lg border px-3 py-2 text-sm min-h-[80px]" {...register("strengths")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Axes d amelioration</label>
              <textarea className="w-full rounded-lg border px-3 py-2 text-sm min-h-[80px]" {...register("areas_for_improvement")} />
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(buildPath("/hr/evaluations"))}>Annuler</Button>
          <Button type="submit" disabled={createEvaluation.isPending}>Creer</Button>
        </div>
      </form>
    </div>
  );
}
