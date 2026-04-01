"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useEmployeeById, useUpdateEmployee } from "@/hooks/api/useHR";
import { createEmployeeSchema, type CreateEmployeeFormData } from "@/schemas/hr.schema";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { ErrorBanner, Skeleton } from "@/components/ui";

export default function EditEmployeePage() {
  return (
    <ModuleGuard module="hr" requiredPermissions={[Permission.EMPLOYEES_UPDATE]}>
      <EditEmployeeContent />
    </ModuleGuard>
  );
}

function toDateStr(s: string | undefined) {
  if (!s) return "";
  const d = new Date(s);
  return d.toISOString().slice(0, 10);
}

function EditEmployeeContent() {
  const router = useRouter();
  const params = useParams();
  const { buildPath } = useTenantPath();
  const id = (params?.id as string) ?? "";
  const { data: employee, isLoading, error, refetch } = useEmployeeById(id);
  const updateEmployee = useUpdateEmployee(id);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateEmployeeFormData>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: { contract_type: "cdi", weekly_hours: 35, base_salary: 0 },
  });

  useEffect(() => {
    if (!employee) return;
    const e = employee as unknown as Record<string, unknown>;
    reset({
      employee_number: (e.employee_number as string) ?? "",
      first_name: (e.first_name as string) ?? "",
      last_name: (e.last_name as string) ?? "",
      email: (e.email as string) ?? "",
      phone: (e.phone as string) ?? "",
      job_title: (e.job_title as string) ?? "",
      department: (e.department as string) ?? "",
      contract_type: (e.contract_type as CreateEmployeeFormData["contract_type"]) ?? "cdi",
      contract_start_date: toDateStr(e.contract_start_date as string),
      contract_end_date: toDateStr(e.contract_end_date as string),
      weekly_hours: Number(e.weekly_hours) ?? 35,
      base_salary: Number(e.base_salary) ?? 0,
    });
  }, [employee, reset]);

  const onSubmit = (data: CreateEmployeeFormData) => {
    const payload = { ...data, contract_start_date: data.contract_start_date ? new Date(data.contract_start_date).toISOString() : undefined, contract_end_date: data.contract_end_date ? new Date(data.contract_end_date).toISOString() : undefined };
    updateEmployee.mutate(payload, { onSuccess: () => router.push(buildPath("/hr/employees/" + id)) });
  };

  if (isLoading) return <Skeleton className="h-64 w-full rounded-lg" />;
  if (error) return <ErrorBanner message="Employe introuvable" onRetry={() => refetch()} />;
  if (!employee) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/hr/employees/" + id))} leftIcon={<ArrowLeft />}>Retour</Button>
        <h1 className="text-2xl font-bold">Modifier l employe</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Identite</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Matricule" {...register("employee_number")} error={errors.employee_number?.message} />
            <Input label="Prenom" {...register("first_name")} error={errors.first_name?.message} />
            <Input label="Nom" {...register("last_name")} error={errors.last_name?.message} />
            <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Contrat</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Poste" {...register("job_title")} error={errors.job_title?.message} />
            <Input label="Date debut" type="date" {...register("contract_start_date")} error={errors.contract_start_date?.message} />
            <Input label="Date fin" type="date" {...register("contract_end_date")} />
            <Input label="Heures/semaine" type="number" {...register("weekly_hours", { valueAsNumber: true })} error={errors.weekly_hours?.message} />
            <Input label="Salaire de base" type="number" {...register("base_salary", { valueAsNumber: true })} error={errors.base_salary?.message} />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(buildPath("/hr/employees/" + id))}>Annuler</Button>
          <Button type="submit" disabled={updateEmployee.isPending}>Enregistrer</Button>
        </div>
      </form>
    </div>
  );
}
