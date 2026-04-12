"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { usePayrollRuns, useCreatePayrollRun } from "@/hooks/api/useHR";
import { createPayrollRunSchema, type CreatePayrollRunFormData } from "@/schemas/hr.schema";
import { PAYROLL_RUN_STATUS_LABELS } from "@/types/hr";
import { Button, Card, CardContent, EmptyState, ErrorBanner, Input, Modal, Skeleton } from "@/components/ui";
import { Plus, ChevronRight, DollarSign } from "lucide-react";
import { formatDate } from "@/utils/formatters";

function safeId(id: string) {
  return id.includes(":") ? id.split(":")[1] : id;
}

export default function HrPayrollPage() {
  return (
    <ModuleGuard module="hr" requiredPermissions={[Permission.PAYROLL_READ]}>
      <HrPayrollContent />
    </ModuleGuard>
  );
}

function HrPayrollContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [newCycleOpen, setNewCycleOpen] = useState(false);
  const { data: runs = [], isLoading, error, refetch } = usePayrollRuns();
  const createRun = useCreatePayrollRun();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreatePayrollRunFormData>({
    resolver: zodResolver(createPayrollRunSchema),
  });

  const list = Array.isArray(runs) ? runs : [];

  const toIsoStart = (dateStr: string) => (dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00.000Z`);
  const toIsoEnd = (dateStr: string) => (dateStr.includes("T") ? dateStr : `${dateStr}T23:59:59.999Z`);

  const onNewCycleSubmit = (data: CreatePayrollRunFormData) => {
    createRun.mutate(
      { period_start: toIsoStart(data.period_start), period_end: toIsoEnd(data.period_end) },
      {
        onSuccess: (res) => {
          setNewCycleOpen(false);
          reset();
          const id = res?.id != null ? safeId(String(res.id)) : "";
          if (id) router.push(buildPath("/hr/payroll/" + id));
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Paie</h1>
          <p className="text-sm text-slate-500 mt-1">Cycles de paie et fiches</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/hr/payroll/payslips"))}>Fiches de paie</Button>
          <ProtectedAction permission={Permission.PAYROLL_CREATE}>
            <Button leftIcon={<Plus />} onClick={() => setNewCycleOpen(true)}>Nouveau cycle</Button>
          </ProtectedAction>
        </div>
      </div>
      {isLoading && <Skeleton className="h-48 w-full rounded-lg" />}
      {error && <ErrorBanner message="Erreur" onRetry={() => refetch()} />}
      {!isLoading && !error && list.length === 0 && (
        <EmptyState title="Aucun cycle de paie" description="Creer un cycle pour demarrer." />
      )}
      {!isLoading && !error && list.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-slate-100">
              {list.map((r: { id: string; period_start?: string; period_end?: string; status?: string; total_net?: number }) => (
                <li key={r.id}>
                  <button type="button" className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-slate-50" onClick={() => router.push(buildPath("/hr/payroll/" + safeId(r.id)))}>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="font-medium">{r.period_start ? formatDate(r.period_start) : ""} → {r.period_end ? formatDate(r.period_end) : ""}</p>
                        <p className="text-sm text-slate-500">{(PAYROLL_RUN_STATUS_LABELS as Record<string, string>)[r.status ?? ""] ?? r.status}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{r.total_net != null ? `${r.total_net} EUR` : ""}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Modal
        open={newCycleOpen}
        onOpenChange={setNewCycleOpen}
        title="Nouveau cycle de paie"
        description="Définissez la période du cycle"
      >
        <form onSubmit={handleSubmit(onNewCycleSubmit)} className="space-y-4">
          <Input label="Début de période" type="date" {...register("period_start")} error={errors.period_start?.message} />
          <Input label="Fin de période" type="date" {...register("period_end")} error={errors.period_end?.message} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setNewCycleOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={createRun.isPending}>{createRun.isPending ? "Création..." : "Créer le cycle"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
