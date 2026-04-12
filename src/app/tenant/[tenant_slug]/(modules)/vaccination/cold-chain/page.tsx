"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  useColdChainDevices,
  useColdChainAlerts,
  useCreateColdChainDevice,
} from "@/hooks/api/useVaccination";
import { Button, Card, CardContent, ErrorBanner, Skeleton, Badge, EmptyState, Modal } from "@/components/ui";
import { Thermometer, Plus, AlertTriangle, ChevronRight, Snowflake } from "lucide-react";
import { COLD_CHAIN_UNIT_TYPE_LABELS } from "@/types/vaccination";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const createDeviceSchema = z.object({
  deviceName: z.string().min(1, "Requis"),
  deviceModel: z.string().min(1, "Requis"),
  serialNumber: z.string().min(1, "Requis"),
  manufacturer: z.string().min(1, "Requis"),
  firmwareVersion: z.string().min(1, "Requis"),
  unitType: z.enum([
    "refrigerator",
    "freezer",
    "ultra_low_freezer",
    "portable_cooler",
    "room_temperature",
  ]),
  locationDescription: z.string().min(1, "Requis"),
  capacityLiters: z.coerce.number().min(0),
  minTempCelsius: z.coerce.number().min(-50).max(50).optional(),
  maxTempCelsius: z.coerce.number().min(-50).max(50).optional(),
});

type CreateDeviceForm = z.infer<typeof createDeviceSchema>;

function safeId(id: string) {
  return typeof id === "string" && id.includes(":") ? id.split(":")[1] ?? id : id;
}

export default function ColdChainPage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ]}
    >
      <ColdChainContent />
    </ModuleGuard>
  );
}

function ColdChainContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: devices, isLoading, error, refetch } = useColdChainDevices();
  const { data: alerts } = useColdChainAlerts();
  const createDevice = useCreateColdChainDevice();
  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateDeviceForm>({
    resolver: zodResolver(createDeviceSchema),
    defaultValues: {
      unitType: "refrigerator",
      capacityLiters: 0,
    },
  });

  const onSubmit = (data: CreateDeviceForm) => {
    createDevice.mutate(
      {
        deviceName: data.deviceName,
        deviceModel: data.deviceModel,
        serialNumber: data.serialNumber,
        manufacturer: data.manufacturer,
        firmwareVersion: data.firmwareVersion,
        unitType: data.unitType,
        locationDescription: data.locationDescription,
        capacityLiters: data.capacityLiters,
        minTempCelsius: data.minTempCelsius,
        maxTempCelsius: data.maxTempCelsius,
      },
      {
        onSuccess: () => {
          setModalOpen(false);
          reset();
        },
      }
    );
  };

  if (isLoading && !devices) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorBanner
        message="Erreur de chargement des appareils"
        onRetry={() => refetch()}
      />
    );
  }

  const list = Array.isArray(devices) ? devices : [];
  const alertsList = Array.isArray(alerts) ? alerts : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Chaîne du froid
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Appareils et surveillance température
          </p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setModalOpen(true)}
          disabled={createDevice.isPending}
        >
          Enregistrer un appareil
        </Button>
      </div>

      {alertsList.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="font-semibold text-amber-800 dark:text-amber-200">
                Alertes actives ({alertsList.length})
              </h2>
            </div>
            <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
              {alertsList.slice(0, 5).map((a) => (
                <li key={a.id}>
                  {a.alert_type} — {a.severity} — {a.started_at}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {list.length === 0 ? (
        <EmptyState
          title="Aucun appareil"
          description="Enregistrez un appareil de chaîne du froid pour commencer."
          action={
            <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
              Enregistrer un appareil
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((device) => {
            const id = safeId(device.id);
            const status = device.connection_status ?? "offline";
            return (
              <Card
                key={device.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(buildPath(`/vaccination/cold-chain/${id}`))}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      status === "online"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-slate-100 dark:bg-slate-700"
                    }`}
                  >
                    <Snowflake
                      className={`w-5 h-5 ${
                        status === "online" ? "text-green-600" : "text-slate-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {device.device_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {COLD_CHAIN_UNIT_TYPE_LABELS[device.unit_type] ?? device.unit_type} ·{" "}
                      {device.location_description}
                    </p>
                  </div>
                  <Badge variant={status === "online" ? "default" : "secondary"}>
                    {status === "online" ? "En ligne" : "Hors ligne"}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Enregistrer un appareil"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nom de l&apos;appareil
              </label>
              <input
                {...register("deviceName")}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              />
              {errors.deviceName && (
                <p className="text-xs text-red-500 mt-1">{errors.deviceName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Modèle
              </label>
              <input
                {...register("deviceModel")}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              />
              {errors.deviceModel && (
                <p className="text-xs text-red-500 mt-1">{errors.deviceModel.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Numéro de série
              </label>
              <input
                {...register("serialNumber")}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              />
              {errors.serialNumber && (
                <p className="text-xs text-red-500 mt-1">{errors.serialNumber.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Fabricant
              </label>
              <input
                {...register("manufacturer")}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              />
              {errors.manufacturer && (
                <p className="text-xs text-red-500 mt-1">{errors.manufacturer.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Version firmware
              </label>
              <input
                {...register("firmwareVersion")}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              />
              {errors.firmwareVersion && (
                <p className="text-xs text-red-500 mt-1">{errors.firmwareVersion.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Type
              </label>
              <select
                {...register("unitType")}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              >
                {(Object.keys(COLD_CHAIN_UNIT_TYPE_LABELS) as Array<keyof typeof COLD_CHAIN_UNIT_TYPE_LABELS>).map(
                  (k) => (
                    <option key={k} value={k}>
                      {COLD_CHAIN_UNIT_TYPE_LABELS[k]}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Emplacement
              </label>
              <input
                {...register("locationDescription")}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              />
              {errors.locationDescription && (
                <p className="text-xs text-red-500 mt-1">{errors.locationDescription.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Capacité (L)
              </label>
              <input
                type="number"
                {...register("capacityLiters")}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              />
              {errors.capacityLiters && (
                <p className="text-xs text-red-500 mt-1">{errors.capacityLiters.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Temp. min (°C)
              </label>
              <input
                type="number"
                {...register("minTempCelsius")}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Temp. max (°C)
              </label>
              <input
                type="number"
                {...register("maxTempCelsius")}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={createDevice.isPending}>
              {createDevice.isPending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
