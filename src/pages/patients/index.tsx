import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  UserIcon,
  PhoneIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/design-system';
import { apiClient } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useAuth';
import { UserRole, type Patient, PatientStatus } from '@/types';

const PatientsPage: React.FC = () => {
  useRequireAuth([UserRole.ADMIN, UserRole.PHARMACIST, UserRole.TECHNICIAN]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const { data: patientsData, isLoading, error } = useQuery({
    queryKey: ['patients', currentPage, searchTerm],
    queryFn: () => apiClient.getPatients(currentPage, pageSize),
  });

  const getStatusBadge = (status: PatientStatus) => {
    const styles = {
      [PatientStatus.ACTIVE]: 'bg-green-100 text-green-800',
      [PatientStatus.INACTIVE]: 'bg-gray-100 text-gray-800',
      [PatientStatus.DECEASED]: 'bg-red-100 text-red-800',
      [PatientStatus.TRANSFERRED]: 'bg-blue-100 text-blue-800',
    };

    const labels = {
      [PatientStatus.ACTIVE]: 'Actif',
      [PatientStatus.INACTIVE]: 'Inactif',
      [PatientStatus.DECEASED]: 'Décédé',
      [PatientStatus.TRANSFERRED]: 'Transféré',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const PatientCard = ({ patient }: { patient: Patient }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-gray-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">
                {patient.firstName} {patient.lastName}
              </h3>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {calculateAge(patient.dateOfBirth.toString())} ans
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-1" />
                  {patient.phone}
                </div>
              </div>
              {patient.address && (
                <p className="mt-1 text-sm text-gray-500">
                  {patient.address.city}, {patient.address.state}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(patient.status)}
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Patient depuis {new Date(patient.createdAt).toLocaleDateString('fr-FR')}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/patients/${patient.id}`}>
                Voir détails
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/patients/${patient.id}/edit`}>
                Modifier
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <UserIcon className="h-12 w-12 text-gray-400 mx-auto" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun patient</h3>
      <p className="mt-1 text-sm text-gray-500">
        Commencez par ajouter un nouveau patient.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/patients/new">
            <PlusIcon className="h-4 w-4 mr-2" />
            Nouveau patient
          </Link>
        </Button>
      </div>
    </div>
  );

  const Pagination = () => {
    if (!patientsData?.meta) return null;

    const { page, totalPages } = patientsData.meta;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setCurrentPage(page - 1)}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setCurrentPage(page + 1)}
          >
            Suivant
          </Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Affichage de{' '}
              <span className="font-medium">{(page - 1) * pageSize + 1}</span>
              {' '} à{' '}
              <span className="font-medium">
                {Math.min(page * pageSize, patientsData.meta.total)}
              </span>
              {' '} sur{' '}
              <span className="font-medium">{patientsData.meta.total}</span>
              {' '}résultats
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setCurrentPage(page - 1)}
                className="rounded-r-none"
              >
                Précédent
              </Button>
              {pages.slice(Math.max(0, page - 3), Math.min(totalPages, page + 2)).map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="rounded-none"
                >
                  {pageNum}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setCurrentPage(page + 1)}
                className="rounded-l-none"
              >
                Suivant
              </Button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout title="Patients - PharmacySaaS">
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
            <p className="text-gray-600">
              Gérez les informations de vos patients
            </p>
          </div>
          <Button asChild>
            <Link href="/patients/new">
              <PlusIcon className="h-4 w-4 mr-2" />
              Nouveau patient
            </Link>
          </Button>
        </div>

        {/* Barre de recherche */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher par nom, téléphone, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                />
              </div>
              <Button variant="outline">
                Filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des patients */}
        {isLoading ? (
          <div className="grid gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-32"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-red-600">
                Erreur lors du chargement des patients. Veuillez réessayer.
              </div>
            </CardContent>
          </Card>
        ) : !patientsData?.data.length ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid gap-6">
              {patientsData.data.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
            <Pagination />
          </>
        )}
      </div>
    </Layout>
  );
};

export default PatientsPage;