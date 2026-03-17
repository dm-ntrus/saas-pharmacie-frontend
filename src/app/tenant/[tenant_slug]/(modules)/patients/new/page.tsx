"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useCreatePatient } from "@/hooks/api/usePatients";
import { createPatientSchema, type CreatePatientFormData } from "@/schemas/patients.schema";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

export default function NewPatientPage() {
  return (
    <ModuleGuard
      module="patients"
      requiredPermissions={[Permission.PATIENTS_WRITE]}
    >
      <NewPatientContent />
    </ModuleGuard>
  );
}

function NewPatientContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const createPatient = useCreatePatient();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreatePatientFormData>({
    resolver: zodResolver(createPatientSchema),
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
    },
  });

  const onSubmit = (data: CreatePatientFormData) => {
    const payload = {
      ...data,
      email: data.email || undefined,
    };
    createPatient.mutate(payload, {
      onSuccess: (result: any) => {
        const id = result?.id && typeof result.id === "string" && result.id.includes(":") ? result.id.split(":")[1] : result?.id;
        router.push(buildPath(id ? `/patients/${id}` : "/patients"));
      },
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(buildPath("/patients"))}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Retour
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Nouveau patient
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
                onChange={(v) => setValue("gender", v as CreatePatientFormData["gender"])}
                options={[
                  { value: "male", label: "Homme" },
                  { value: "female", label: "Femme" },
                  { value: "other", label: "Autre" },
                  { value: "prefer_not_to_say", label: "Ne pas préciser" },
                ]}
                placeholder="Genre"
              />
            </div>
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
            <Input
              label="Allergies"
              {...register("allergies")}
              placeholder="Allergies connues"
            />
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
            onClick={() => router.push(buildPath("/patients"))}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={createPatient.isPending}>
            {createPatient.isPending ? "Création..." : "Créer le patient"}
          </Button>
        </div>
      </form>
    </div>
  );
}
