import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Layout from "@/components/layout/Layout";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/design-system";
import { apiClient } from "@/lib/api";
import { useRouter } from "next/router";
import { CreatePrescriptionModal } from "@/components/patients/CreatePrescriptionModal";
import { VerifyPrescriptionModal } from "@/components/patients/VerifyPrescriptionModal";
import { DispensePrescriptionModal } from "@/components/patients/DispensePrescriptionModal";

const PatientDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showCreatePrescription, setShowCreatePrescription] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDispenseModal, setShowDispenseModal] = useState(false);

  const { data: patient, isLoading } = useQuery({
    queryKey: ["patient", id],
    queryFn: () => apiClient.getPatient(id as string),
    enabled: !!id,
  });

  const { data: prescriptions } = useQuery({
    queryKey: ["patient-prescriptions", id],
    queryFn: () => apiClient.getPatientPrescriptions(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Layout title="Patient - PharmacySaaS">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </Layout>
    );
  }

  if (!patient) {
    return (
      <Layout title="Patient - PharmacySaaS">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600">Patient non trouvé</p>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout title={`${patient.firstName} ${patient.lastName} - PharmacySaaS`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center space-x-4">
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
                {patient.firstName} {patient.lastName}
              </h1>
              <p className="text-gray-600">N° {patient.patientNumber}</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button variant="outline" asChild>
              <Link href={`/patients/${patient.id}/edit`}>Modifier</Link>
            </Button>
            <Button
              asChild
              icon={<PlusIcon className="h-4 w-4" />}
              onClick={() => setShowCreatePrescription(true)}
            >
              Nouvelle ordonnance
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Âge</p>
                  <p className="font-medium">
                    {new Date().getFullYear() -
                      new Date(patient.dateOfBirth).getFullYear()}{" "}
                    ans
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{patient.phone}</p>
                </div>
                {patient.email && (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{patient.email}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium">{patient?.address}</p>
                </div>
              </CardContent>
            </Card>

            {(patient.allergies || patient.medicalConditions) && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Informations médicales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {patient.allergies && (
                    <div>
                      <p className="text-sm text-gray-500">Allergies</p>
                      <p className="font-medium text-red-600">
                        {patient.allergies}
                      </p>
                    </div>
                  )}
                  {patient.medicalConditions && (
                    <div>
                      <p className="text-sm text-gray-500">Conditions</p>
                      <p className="font-medium">{patient.medicalConditions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Ordonnances</CardTitle>
              </CardHeader>
              <CardContent>
                {prescriptions && prescriptions.length > 0 ? (
                  <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                      <div
                        key={prescription.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">
                              N° {prescription.prescriptionNumber}
                            </p>
                            <p className="text-sm text-gray-600">
                              Dr. {prescription.doctorName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(
                                prescription.prescriptionDate
                              ).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {prescription.status === "PENDING" && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedPrescription(prescription);
                                  setShowVerifyModal(true);
                                }}
                              >
                                Vérifier
                              </Button>
                            )}

                            {prescription.status === "VERIFIED" && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedPrescription(prescription);
                                  setShowDispenseModal(true);
                                }}
                              >
                                Dispenser
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aucune ordonnance</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Create */}
      <CreatePrescriptionModal
        isOpen={showCreatePrescription}
        onClose={() => setShowCreatePrescription(false)}
        patientId={patient.id}
        patientName={`${patient.firstName} ${patient.lastName}`}
      />
      {/*Update & Delete Modals */}
      {selectedPrescription && (
        <>
          <VerifyPrescriptionModal
            isOpen={showVerifyModal}
            onClose={() => setShowVerifyModal(false)}
            prescription={selectedPrescription}
          />

          <DispensePrescriptionModal
            isOpen={showDispenseModal}
            onClose={() => setShowDispenseModal(false)}
            prescription={selectedPrescription}
          />
        </>
      )}
    </Layout>
  );
};
export default PatientDetailPage;
