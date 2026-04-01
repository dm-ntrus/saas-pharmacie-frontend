"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useCreateEmployee } from "@/hooks/api/useHR";
import { createEmployeeSchema, type CreateEmployeeFormData } from "@/schemas/hr.schema";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

function safeId(id: string) {
  return typeof id === "string" && id.includes(":") ? id.split(":")[1] : id;
}

export default function NewEmployeePage() {
  return (
    <ModuleGuard module="hr" requiredPermissions={[Permission.EMPLOYEES_CREATE]}>
      <NewEmployeeContent />
    </ModuleGuard>
  );
}

function NewEmployeeContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const createEmployee = useCreateEmployee();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateEmployeeFormData>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: { contract_type: "cdi", weekly_hours: 35, base_salary: 0 },
  });

  const onSubmit = (data: CreateEmployeeFormData) => {
    const payload = { ...data, contract_start_date: data.contract_start_date ? new Date(data.contract_start_date).toISOString() : undefined };
    createEmployee.mutate(payload as any, {
      onSuccess: (res) => {
        const id = res?.id ? safeId(String(res.id)) : "";
        router.push(buildPath("/hr/employees/" + id));
      },
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/hr/employees"))} leftIcon={<ArrowLeft />}>Retour</Button>
        <h1 className="text-2xl font-bold">Nouvel employe</h1>
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
            <Input label="Heures/semaine" type="number" {...register("weekly_hours", { valueAsNumber: true })} error={errors.weekly_hours?.message} />
            <Input label="Salaire de base" type="number" {...register("base_salary", { valueAsNumber: true })} error={errors.base_salary?.message} />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(buildPath("/hr/employees"))}>Annuler</Button>
          <Button type="submit" disabled={createEmployee.isPending}>Creer</Button>
        </div>
      </form>
    </div>
  );
}
