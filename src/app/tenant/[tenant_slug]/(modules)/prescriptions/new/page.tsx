"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useCreatePrescription } from "@/hooks/api/usePrescriptions";
import { usePatients } from "@/hooks/api/usePatients";
import {
  createPrescriptionSchema,
  type CreatePrescriptionFormData,
} from "@/schemas/prescriptions.schema";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

export default function NewPrescriptionPage() {
  return (
    <ModuleGuard
      module="prescriptions"
      requiredPermissions={[Permission.PRESCRIPTIONS_WRITE]}
    >
      <NewPrescriptionContent />
    </ModuleGuard>
  );
}

function NewPrescriptionContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const createPrescription = useCreatePrescription();
  const { data: patients = [] } = usePatients();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreatePrescriptionFormData>({
    resolver: zodResolver(createPrescriptionSchema),
    defaultValues: {
      patient_id: "",
      prescriber_name: "",
      prescriber_npi: "",
      prescribed_date: new Date().toISOString().slice(0, 10),
      type: "new",
      refills_allowed: 0,
      refills_remaining: 0,
      special_instructions: "",
      pharmacy_notes: "",
    },
  });

  const onSubmit = (data: CreatePrescriptionFormData) => {
    const patientIdSegment =
      data.patient_id.includes(":") ? data.patient_id.split(":")[1] : data.patient_id;
    createPrescription.mutate(
      {
        patient_id: patientIdSegment,
        prescriber_name: data.prescriber_name,
        prescriber_npi: data.prescriber_npi,
        prescribed_date: data.prescribed_date || new Date().toISOString(),
        type: data.type as any,
        refills_allowed: data.refills_allowed,
        refills_remaining: data.refills_remaining,
        special_instructions: data.special_instructions,
        pharmacy_notes: data.pharmacy_notes,
      },
      {
        onSuccess: (result: any) => {
          const id = result?.id && typeof result.id === "string" && result.id.includes(":") ? result.id.split(":")[1] : result?.id;
          router.push(buildPath(id ? `/prescriptions/${id}` : "/prescriptions"));
        },
      }
    );
  };

  const patientOptions = (Array.isArray(patients) ? patients : []).map((p: any) => {
    const segment = typeof p.id === "string" && p.id.includes(":") ? p.id.split(":")[1] : p.id;
    return {
      value: segment ?? p.id,
      label: `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || String(p.id),
    };
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(buildPath("/prescriptions"))}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Retour
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Nouvelle ordonnance
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Patient & prescripteur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Patient"
              value={watch("patient_id")}
              onChange={(v) => setValue("patient_id", v)}
              options={patientOptions}
              placeholder="Sélectionner un patient"
            />
            {errors.patient_id && (
              <p className="text-sm text-red-600">{errors.patient_id.message}</p>
            )}
            <Input
              label="Nom du prescripteur"
              {...register("prescriber_name")}
              error={errors.prescriber_name?.message}
              placeholder="Dr. Nom"
            />
            <Input
              label="NPI (optionnel)"
              {...register("prescriber_npi")}
              placeholder="NPI"
            />
            <Input
              label="Date de prescription"
              type="date"
              {...register("prescribed_date")}
            />
            <Select
              label="Type"
              value={watch("type")}
              onChange={(v) => setValue("type", v as CreatePrescriptionFormData["type"])}
              options={[
                { value: "new", label: "Nouvelle" },
                { value: "refill", label: "Renouvellement" },
                { value: "transfer_in", label: "Transfert entrant" },
                { value: "emergency", label: "Urgence" },
              ]}
            />
            <Input
              label="Instructions particulières (optionnel)"
              {...register("special_instructions")}
              placeholder="Instructions"
            />
            <Input
              label="Notes pharmacie (optionnel)"
              {...register("pharmacy_notes")}
              placeholder="Notes internes"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(buildPath("/prescriptions"))}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={createPrescription.isPending}>
            {createPrescription.isPending ? "Création..." : "Créer l'ordonnance"}
          </Button>
        </div>
      </form>
    </div>
  );
}
