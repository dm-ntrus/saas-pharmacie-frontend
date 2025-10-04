import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import Layout from "@/components/layout/Layout";
import { Button, Input, Card, CardContent } from "@/design-system";
import { Pagination } from "@/components/Pagination";
import { apiClient } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useAuth";
import { usePagination } from "@/hooks/usePerformance";
import { UserRole, type Patient, PatientStatus, Gender } from "@/types";

const PatientsPage: React.FC = () => {
  useRequireAuth([UserRole.ADMIN, UserRole.PHARMACIST, UserRole.TECHNICIAN]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showFilters, setShowFilters] = useState(false);

  const { data: patientsData, isLoading } = useQuery({
    queryKey: ["patients", currentPage, itemsPerPage, searchTerm],
    queryFn: () =>
      apiClient.getPatients({
        search: searchTerm,
        page: currentPage,
        limit: itemsPerPage,
      }),
  });

  const pagination = usePagination(
    patientsData?.meta?.total || 0,
    itemsPerPage,
    currentPage
  );
  const handleExport = () => {
    if (!patientsData?.data) return;

    const csvContent = [
      ["Numéro"],
      ...patientsData.data.map((patient) => [patient.patientNumber]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ventes-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (status: PatientStatus) => {
    const styles = {
      [PatientStatus.ACTIVE]: "bg-green-100 text-green-800",
      [PatientStatus.INACTIVE]: "bg-gray-100 text-gray-800",
      [PatientStatus.DECEASED]: "bg-red-100 text-red-800",
      [PatientStatus.TRANSFERRED]: "bg-blue-100 text-blue-800",
    };

    const labels = {
      [PatientStatus.ACTIVE]: "Actif",
      [PatientStatus.INACTIVE]: "Inactif",
      [PatientStatus.DECEASED]: "Décédé",
      [PatientStatus.TRANSFERRED]: "Transféré",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const PatientCard = ({ patient }: { patient: Patient }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">
                {patient.firstName} {patient.lastName}
              </h3>
              <p className="text-sm text-gray-500">
                N° {patient.patientNumber}
              </p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {calculateAge(patient.dateOfBirth.toString())} ans
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-1" />
                  {patient.phone}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(patient.status)}
          </div>
        </div>

        {patient.allergies && patient.allergies.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400">
            <p className="text-sm font-medium text-red-800 mb-1">Allergies</p>
            <p className="text-sm text-red-700">
              {patient.allergies.join(", ")}
            </p>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Patient depuis{" "}
            {new Date(patient.createdAt).toLocaleDateString("fr-FR")}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/patients/${patient.id}`}>Voir détails</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/patients/${patient.id}/edit`}>Modifier</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout title="Patients - PharmacySaaS">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
            <p className="text-gray-600">
              Gérez les informations de vos patients
            </p>
          </div>
          <Button asChild icon={<PlusIcon className="h-4 w-4" />}>
            <Link href="/patients/new">Nouveau patient</Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher par nom, téléphone, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                icon={<FunnelIcon className="h-5 w-5" />}
              >
                Filtres
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                icon={<ArrowDownTrayIcon className="h-5 w-5" />}
              >
                Exporter
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-32"></div>
              </div>
            ))}
          </div>
        ) : !patientsData?.data.length ? (
          <div className="text-center py-12">
            <UserIcon className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucun patient
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par ajouter un nouveau patient.
            </p>
            <div className="mt-6">
              <Button asChild icon={<PlusIcon className="h-4 w-4" />}>
                <Link href="/patients/new">Nouveau patient</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {patientsData.data.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              totalItems={patientsData.meta?.total}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              showItemsPerPage
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default PatientsPage;
