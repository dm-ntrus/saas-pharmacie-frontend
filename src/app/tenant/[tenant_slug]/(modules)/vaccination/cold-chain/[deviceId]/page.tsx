"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  useColdChainDeviceById,
  useTemperatureReadings,
  useRecordTemperatureReading,
} from "@/hooks/api/useVaccination";
import { Button, Card, CardContent, ErrorBanner, Skeleton, Badge } from "@/components/ui";
import { ArrowLeft, Thermometer, Plus } from "lucide-react";
import { COLD_CHAIN_UNIT_TYPE_LABELS } from "@/types/vaccination";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const readingSchema = z.object({
  temperatureCelsius: z.coerce.number(),
  humidityPercent: z.coerce.number().min(0).max(100).optional(),
  doorOpen: z.boolean().optional(),
  batteryPercent: z.coerce.number().min(0).max(100).optional(),
});

type ReadingForm = z.infer<typeof readingSchema>;

export default function ColdChainDevicePage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ]}
    >
      <ColdChainDeviceContent />
    </ModuleGuard>
  );
}

function ColdChainDeviceContent() {
  const params = useParams();
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const deviceId = (params?.deviceId as string) ?? "";
  const { data: device, isLoading, error, refetch } = useColdChainDeviceById(deviceId);
  const { data: readings, isLoading: readingsLoading } = useTemperatureReadings(deviceId, 50);
  const recordReading = useRecordTemperatureReading();
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReadingForm>({
    resolver: zodResolver(readingSchema),
    defaultValues: {
      temperatureCelsius: 5,
      doorOpen: false,
    },
  });

  const onSubmit = (data: ReadingForm) => {
    recordReading.mutate(
      {
        deviceId: device?.id ?? deviceId,
        temperatureCelsius: data.temperatureCelsius,
        humidityPercent: data.humidityPercent,
        doorOpen: data.doorOpen,
        batteryPercent: data.batteryPercent,
        timestamp: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setShowForm(false);
          reset();
        },
      }
    );
  };

  if (isLoading && !device) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error || !device) {
    return (
      <ErrorBanner
        message="Appareil introuvable"
        onRetry={() => refetch()}
      />
    );
  }

  const readingsList = Array.isArray(readings) ? readings : [];
  const status = device.connection_status ?? "offline";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push(buildPath("/vaccination/cold-chain"))}
        >
          Retour
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {device.device_name}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {COLD_CHAIN_UNIT_TYPE_LABELS[device.unit_type] ?? device.unit_type} ·{" "}
                {device.location_description}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant={status === "online" ? "default" : "secondary"}>
                  {status === "online" ? "En ligne" : "Hors ligne"}
                </Badge>
                <span className="text-xs text-slate-500">
                  Série : {device.serial_number}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Capacité</p>
              <p className="font-medium">{device.capacity_liters} L</p>
            </div>
            <div>
              <p className="text-slate-500">Temp. min</p>
              <p className="font-medium">{device.min_temp_celsius} °C</p>
            </div>
            <div>
              <p className="text-slate-500">Temp. max</p>
              <p className="font-medium">{device.max_temp_celsius} °C</p>
            </div>
            <div>
              <p className="text-slate-500">Dernière vue</p>
              <p className="font-medium">
                {device.last_seen_at
                  ? new Date(device.last_seen_at).toLocaleString("fr-FR")
                  : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Thermometer className="w-4 h-4" />
          Historique des lectures
        </h2>
        <Button
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowForm(!showForm)}
        >
          Enregistrer une lecture
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Température (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    {...register("temperatureCelsius")}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                  />
                  {errors.temperatureCelsius && (
                    <p className="text-xs text-red-500">{errors.temperatureCelsius.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Humidité (%)</label>
                  <input
                    type="number"
                    {...register("humidityPercent")}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Porte ouverte</label>
                  <input type="checkbox" {...register("doorOpen")} className="mt-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Batterie (%)</label>
                  <input
                    type="number"
                    {...register("batteryPercent")}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={recordReading.isPending}>
                  Enregistrer
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {readingsLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : readingsList.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-slate-500">
            Aucune lecture enregistrée.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Température (°C)</th>
                    <th className="text-left p-3">Humidité</th>
                    <th className="text-left p-3">Porte</th>
                    <th className="text-left p-3">Batterie</th>
                  </tr>
                </thead>
                <tbody>
                  {readingsList.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-slate-100 dark:border-slate-800"
                    >
                      <td className="p-3">
                        {new Date(r.reading_at).toLocaleString("fr-FR")}
                      </td>
                      <td className="p-3">{r.temperature_celsius}</td>
                      <td className="p-3">{r.humidity_percent ?? "—"}</td>
                      <td className="p-3">{r.door_open ? "Oui" : "Non"}</td>
                      <td className="p-3">{r.battery_percent ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
