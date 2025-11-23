import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Layout from "@/components/layout/Layout";
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/design-system";
import { apiClient } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useAuth";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  UserRole,
  Gender,
  PatientStatus,
  type CreatePatientDto,
} from "@/types";
import { DeletePatientModal } from "@/components/patients/DeletePatientModal";

const patientSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .required("Le prénom est requis"),
  lastName: Yup.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .required("Le nom est requis"),
  dateOfBirth: Yup.date()
    .max(new Date(), "La date de naissance ne peut pas être dans le futur")
    .required("La date de naissance est requise"),
  gender: Yup.string()
    .oneOf(["MALE", "FEMALE", "OTHER"])
    .required("Le sexe est requis"),
  phone: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, "Numéro de téléphone invalide")
    .required("Le téléphone est requis"),
  email: Yup.string().email("Email invalide").optional(),
  address: Yup.string().required("L'adresse est requise"),
  emergencyContact: Yup.string().optional(),
  emergencyPhone: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, "Numéro de téléphone invalide")
    .optional(),
  insuranceProvider: Yup.string().optional(),
  insuranceNumber: Yup.string().optional(),
  allergies: Yup.string().optional(),
  medicalConditions: Yup.string().optional(),
  currentMedications: Yup.string().optional(),
});

export const EditPatientPage: React.FC = () => {
  useRequireAuth([UserRole.ADMIN, UserRole.PHARMACIST, UserRole.TECHNICIAN]);

  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const { data: patient, isLoading } = useQuery({
    queryKey: ["patient", id],
    queryFn: () => apiClient.getPatient(id as string),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreatePatientDto>) =>
      apiClient.updatePatient(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", id] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient mis à jour avec succès");
      router.push(`/patients/${id}`);
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du patient");
    },
  });

  const formik = useFormik({
    initialValues: {
      firstName: patient?.firstName || "",
      lastName: patient?.lastName || "",
      dateOfBirth: patient?.dateOfBirth
        ? new Date(patient.dateOfBirth).toISOString().split("T")[0]
        : "",
      gender: patient?.gender || ("MALE" as Gender),
      phone: patient?.phone || "",
      email: patient?.email || "",
      address: patient?.address || "",
      emergencyContact: patient?.emergencyContact || "",
      emergencyPhone: patient?.emergencyPhone || "",
      insuranceProvider: patient?.insuranceProvider || "",
      insuranceNumber: patient?.insuranceNumber || "",
      allergies: patient?.allergies || "",
      medicalConditions: patient?.medicalConditions || "",
      currentMedications: patient?.currentMedications || "",
    },
    validationSchema: patientSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      updateMutation.mutate(values);
    },
  });

  if (isLoading) {
    return (
      <Layout title="Modifier Patient - PharmacySaaS">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </Layout>
    );
  }

  if (!patient) {
    return (
      <Layout title="Modifier Patient - PharmacySaaS">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600">Patient non trouvé</p>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout
      title={`Modifier ${patient.firstName} ${patient.lastName} - PharmacySaaS`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              icon={<ArrowLeftIcon className="h-4 w-4" />}
            >
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Modifier Patient
              </h1>
              <p className="text-gray-600">
                {patient.firstName} {patient.lastName} - N°{" "}
                {patient.patientNumber}
              </p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
            >
              Supprimer
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/patients/${id}`}>Annuler</Link>
            </Button>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Prénom"
                  required
                  {...formik.getFieldProps("firstName")}
                  error={
                    formik.touched.firstName && formik.errors.firstName
                      ? formik.errors.firstName
                      : undefined
                  }
                />
                <Input
                  label="Nom"
                  required
                  {...formik.getFieldProps("lastName")}
                  error={
                    formik.touched.lastName && formik.errors.lastName
                      ? formik.errors.lastName
                      : undefined
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Date de naissance"
                  required
                  {...formik.getFieldProps("dateOfBirth")}
                  error={
                    formik.touched.dateOfBirth && formik.errors.dateOfBirth
                      ? formik.errors.dateOfBirth
                      : undefined
                  }
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sexe <span className="text-red-600">*</span>
                  </label>
                  <select
                    {...formik.getFieldProps("gender")}
                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
                  >
                    <option value="MALE">Masculin</option>
                    <option value="FEMALE">Féminin</option>
                    <option value="OTHER">Autre</option>
                  </select>
                  {formik.touched.gender && formik.errors.gender && (
                    <p className="mt-1 text-xs text-red-600">
                      {formik.errors.gender}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Téléphone"
                  required
                  {...formik.getFieldProps("phone")}
                  error={
                    formik.touched.phone && formik.errors.phone
                      ? formik.errors.phone
                      : undefined
                  }
                />
                <Input
                  type="email"
                  label="Email"
                  {...formik.getFieldProps("email")}
                  error={
                    formik.touched.email && formik.errors.email
                      ? formik.errors.email
                      : undefined
                  }
                />
              </div>

              <Input
                label="Adresse"
                required
                {...formik.getFieldProps("address")}
                error={
                  formik.touched.address && formik.errors.address
                    ? formik.errors.address
                    : undefined
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact d'urgence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nom du contact"
                  {...formik.getFieldProps("emergencyContact")}
                  error={
                    formik.touched.emergencyContact &&
                    formik.errors.emergencyContact
                      ? formik.errors.emergencyContact
                      : undefined
                  }
                />
                <Input
                  label="Téléphone d'urgence"
                  {...formik.getFieldProps("emergencyPhone")}
                  error={
                    formik.touched.emergencyPhone &&
                    formik.errors.emergencyPhone
                      ? formik.errors.emergencyPhone
                      : undefined
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assurance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Fournisseur d'assurance"
                  {...formik.getFieldProps("insuranceProvider")}
                  error={
                    formik.touched.insuranceProvider &&
                    formik.errors.insuranceProvider
                      ? formik.errors.insuranceProvider
                      : undefined
                  }
                />
                <Input
                  label="Numéro d'assurance"
                  {...formik.getFieldProps("insuranceNumber")}
                  error={
                    formik.touched.insuranceNumber &&
                    formik.errors.insuranceNumber
                      ? formik.errors.insuranceNumber
                      : undefined
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations médicales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies
                </label>
                <textarea
                  {...formik.getFieldProps("allergies")}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
                  placeholder="Liste des allergies connues..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conditions médicales
                </label>
                <textarea
                  {...formik.getFieldProps("medicalConditions")}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
                  placeholder="Conditions médicales existantes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Médicaments actuels
                </label>
                <textarea
                  {...formik.getFieldProps("currentMedications")}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
                  placeholder="Liste des médicaments actuels..."
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" asChild>
              <Link href={`/patients/${id}`}>Annuler</Link>
            </Button>
            <Button
              type="submit"
              loading={updateMutation.isPending}
              disabled={updateMutation.isPending}
            >
              Enregistrer les modifications
            </Button>
          </div>
        </form>

        <DeletePatientModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          patient={patient}
          onConfirm={() => {
            // Handle delete
            router.push("/patients");
          }}
        />
      </div>
    </Layout>
  );
};

export default EditPatientPage;
