"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { usePatientById, useUpdatePatient } from "@/hooks/api/usePatients";
import { updatePatientSchema, type UpdatePatientFormData } from "@/schemas/patients.schema";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { ErrorBanner, Skeleton } from "@/components/ui";

export default function EditPatientPage() {
  return (
    <ModuleGuard
      module="patients"
      requiredPermissions={[Permission.PATIENTS_WRITE]}
    >
      <EditPatientContent />
    </ModuleGuard>
  );
}

function EditPatientContent() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const { buildPath } = useTenantPath();
  const { data: patient, isLoading, error, refetch } = usePatientById(id);
  const updatePatient = useUpdatePatient();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<UpdatePatientFormData>({
    resolver: zodResolver(updatePatientSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "male",
      phone: "",
      email: "",
      address: "",
      emergency_contact: "",
      emergency_phone: "",
      insurance_provider: "",
      insurance_number: "",
      allergies: "",
      medical_conditions: "",
      current_medications: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (!patient) return;
    const p = patient as any;
    reset({
      first_name: p.first_name ?? "",
      last_name: p.last_name ?? "",
      date_of_birth: p.date_of_birth ? String(p.date_of_birth).slice(0, 10) : "",
      gender: p.gender ?? "male",
      phone: p.phone ?? "",
      email: p.email ?? "",
      address: p.address ?? "",
      emergency_contact: p.emergency_contact ?? "",
      emergency_phone: p.emergency_phone ?? "",
      insurance_provider: p.insurance_provider ?? "",
      insurance_number: p.insurance_number ?? "",
      allergies: p.allergies ?? "",
      medical_conditions: p.medical_conditions ?? "",
      current_medications: p.current_medications ?? "",
      status: p.status ?? "active",
    });
  }, [patient, reset]);

  const onSubmit = (data: UpdatePatientFormData) => {
    const payload = {
      ...data,
      email: data.email || undefined,
    };
    updatePatient.mutate(
      { id, data: payload },
      {
        onSuccess: () => router.push(buildPath(`/patients/${id}`)),
      }
    );
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (error || !patient) {
    return (
      <ErrorBanner message="Patient introuvable" onRetry={() => refetch()} />
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(buildPath(`/patients/${id}`))}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Retour
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Modifier le patient
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Identité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Prénom"
                {...register("first_name")}
                error={errors.first_name?.message}
                placeholder="Prénom"
              />
              <Input
                label="Nom"
                {...register("last_name")}
                error={errors.last_name?.message}
                placeholder="Nom"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Date de naissance"
                type="date"
                {...register("date_of_birth")}
                error={errors.date_of_birth?.message}
              />
              <Select
                label="Genre"
                value={watch("gender")}
                onChange={(v) => setValue("gender", v as UpdatePatientFormData["gender"])}
                options={[
                  { value: "male", label: "Homme" },
                  { value: "female", label: "Femme" },
                  { value: "other", label: "Autre" },
                  { value: "prefer_not_to_say", label: "Ne pas préciser" },
                ]}
                placeholder="Genre"
              />
            </div>
            {watch("status") !== undefined && (
              <Select
                label="Statut"
                value={watch("status") ?? "active"}
                onChange={(v) => setValue("status", v as UpdatePatientFormData["status"])}
                options={[
                  { value: "active", label: "Actif" },
                  { value: "inactive", label: "Inactif" },
                  { value: "deceased", label: "Décédé" },
                  { value: "transferred", label: "Transféré" },
                ]}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Téléphone"
              {...register("phone")}
              error={errors.phone?.message}
              placeholder="+33..."
            />
            <Input
              label="Email (optionnel)"
              type="email"
              {...register("email")}
              error={errors.email?.message}
              placeholder="email@exemple.fr"
            />
            <Input
              label="Adresse"
              {...register("address")}
              error={errors.address?.message}
              placeholder="Adresse complète"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations médicales & assurance (optionnel)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Allergies" {...register("allergies")} placeholder="Allergies connues" />
            <Input
              label="Affections / antécédents"
              {...register("medical_conditions")}
              placeholder="Maladies chroniques, etc."
            />
            <Input
              label="Médicaments en cours"
              {...register("current_medications")}
              placeholder="Traitement actuel"
            />
            <Input
              label="Assurance"
              {...register("insurance_provider")}
              placeholder="Nom de l'assurance"
            />
            <Input
              label="N° assurance"
              {...register("insurance_number")}
              placeholder="Numéro d'assuré"
            />
            <Input
              label="Contact d'urgence"
              {...register("emergency_contact")}
              placeholder="Nom"
            />
            <Input
              label="Tél. urgence"
              {...register("emergency_phone")}
              placeholder="+33..."
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(buildPath(`/patients/${id}`))}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={updatePatient.isPending}>
            {updatePatient.isPending ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  );
}
