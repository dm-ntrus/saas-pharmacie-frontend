"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useCreateShift, useEmployees } from "@/hooks/api/useHR";
import { createShiftSchema, type CreateShiftFormData } from "@/schemas/hr.schema";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

export default function NewShiftPage() {
  return (
    <ModuleGuard module="hr" requiredPermissions={[Permission.SHIFTS_CREATE]}>
      <NewShiftContent />
    </ModuleGuard>
  );
}

function NewShiftContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const createShift = useCreateShift();
  const { data: employees = [] } = useEmployees({ status: "active" });
  const empList = Array.isArray(employees) ? employees : [];
  const empOptions = empList.map((e: { id: string; first_name?: string; last_name?: string }) => ({
    value: e.id,
    label: `${e.first_name ?? ""} ${e.last_name ?? ""}`.trim() || String(e.id),
  }));
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreateShiftFormData>({
    resolver: zodResolver(createShiftSchema),
    defaultValues: { shift_type: "regular", status: "scheduled", break_duration_minutes: 0 },
  });

  const onSubmit = (data: CreateShiftFormData) => {
    createShift.mutate(
      {
        ...data,
        employee_id: data.employee_id,
        shift_date: data.shift_date ? new Date(data.shift_date).toISOString().slice(0, 10) : data.shift_date,
      },
      { onSuccess: () => router.push(buildPath("/hr/schedule")) }
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/hr/schedule"))} leftIcon={<ArrowLeft />}>Retour</Button>
        <h1 className="text-2xl font-bold">Nouveau shift</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Shift</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Select label="Employe" value={watch("employee_id")} onChange={(v) => setValue("employee_id", v)} options={[{ value: "", label: "Selectionner" }, ...empOptions]} />
            <Input label="Date" type="date" {...register("shift_date")} error={errors.shift_date?.message} />
            <Input label="Heure debut (HH:mm)" {...register("start_time")} error={errors.start_time?.message} placeholder="09:00" />
            <Input label="Heure fin (HH:mm)" {...register("end_time")} error={errors.end_time?.message} placeholder="17:00" />
            <Input label="Pause (min)" type="number" {...register("break_duration_minutes", { valueAsNumber: true })} />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(buildPath("/hr/schedule"))}>Annuler</Button>
          <Button type="submit" disabled={createShift.isPending}>Creer</Button>
        </div>
      </form>
    </div>
  );
}
