"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useScheduleAppointment } from "@/hooks/api/useVaccination";
import { Button, Card, CardContent } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const scheduleSchema = z.object({
  patientId: z.string().min(1, "Requis"),
  vaccineProductId: z.string().min(1, "Requis"),
  doseNumber: z.coerce.number().min(1),
  totalDosesInSeries: z.coerce.number().min(1),
  scheduledDate: z.string().min(1, "Requis"),
  timeSlot: z.string().min(1, "Requis"),
  isBooster: z.boolean().optional(),
});

type ScheduleForm = z.infer<typeof scheduleSchema>;

export default function NewAppointmentPage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ, Permission.VACCINATION_WRITE]}
    >
      <NewAppointmentContent />
    </ModuleGuard>
  );
}

function NewAppointmentContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const schedule = useScheduleAppointment();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ScheduleForm>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      doseNumber: 1,
      totalDosesInSeries: 2,
      scheduledDate: new Date().toISOString().slice(0, 10),
      timeSlot: "09:00-09:30",
      isBooster: false,
    },
  });

  const onSubmit = (data: ScheduleForm) => {
    schedule.mutate(
      {
        ...data,
        scheduledDate: new Date(data.scheduledDate).toISOString(),
      },
      {
        onSuccess: () => router.push(buildPath("/vaccination/appointments")),
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
          onClick={() => router.push(buildPath("/vaccination/appointments"))}
        >
          Retour
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Nouveau rendez-vous
      </h1>

      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">ID patient</label>
                <input
                  {...register("patientId")}
                  placeholder="UUID ou identifiant patient"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
                {errors.patientId && (
                  <p className="text-xs text-red-500">{errors.patientId.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ID produit vaccin</label>
                <input
                  {...register("vaccineProductId")}
                  placeholder="UUID produit"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
                {errors.vaccineProductId && (
                  <p className="text-xs text-red-500">{errors.vaccineProductId.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Numéro de dose</label>
                <input
                  type="number"
                  {...register("doseNumber")}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
                {errors.doseNumber && (
                  <p className="text-xs text-red-500">{errors.doseNumber.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total doses dans le schéma</label>
                <input
                  type="number"
                  {...register("totalDosesInSeries")}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
                {errors.totalDosesInSeries && (
                  <p className="text-xs text-red-500">{errors.totalDosesInSeries.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  {...register("scheduledDate")}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
                {errors.scheduledDate && (
                  <p className="text-xs text-red-500">{errors.scheduledDate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Créneau</label>
                <input
                  {...register("timeSlot")}
                  placeholder="ex: 09:00-09:30"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                />
                {errors.timeSlot && (
                  <p className="text-xs text-red-500">{errors.timeSlot.message}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" {...register("isBooster")} id="isBooster" />
                <label htmlFor="isBooster" className="text-sm">
                  Rappel
                </label>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={schedule.isPending}>
                {schedule.isPending ? "Création…" : "Créer le RDV"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(buildPath("/vaccination/appointments"))}
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
