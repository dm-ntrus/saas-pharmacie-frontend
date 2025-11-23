import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/design-system';
import { apiClient } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useAuth';
import { UserRole, type Prescription, PrescriptionStatus } from '@/types';

const PrescriptionsPage: React.FC = () => {
  useRequireAuth([UserRole.ADMIN, UserRole.PHARMACIST, UserRole.TECHNICIAN]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PrescriptionStatus | 'all'>('all');
  const pageSize = 20;

  const { data: prescriptionsData, isLoading } = useQuery({
    queryKey: ['prescriptions', currentPage, searchTerm, statusFilter],
    queryFn: () => apiClient.getPrescriptions(currentPage, pageSize),
  });

  const getStatusColor = (status: PrescriptionStatus) => {
    const colors = {
      [PrescriptionStatus.RECEIVED]: 'bg-blue-100 text-blue-800',
      [PrescriptionStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
      [PrescriptionStatus.READY]: 'bg-green-100 text-green-800',
      [PrescriptionStatus.COMPLETED]: 'bg-gray-100 text-gray-800',
      [PrescriptionStatus.ON_HOLD]: 'bg-red-100 text-red-800',
      [PrescriptionStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
    };
    
    return colors[status];
  };

  const getStatusLabel = (status: PrescriptionStatus) => {
    const labels = {
      [PrescriptionStatus.RECEIVED]: 'Reçue',
      [PrescriptionStatus.IN_PROGRESS]: 'En cours',
      [PrescriptionStatus.READY]: 'Prête',
      [PrescriptionStatus.COMPLETED]: 'Complétée',
      [PrescriptionStatus.ON_HOLD]: 'En attente',
      [PrescriptionStatus.CANCELLED]: 'Annulée',
    };
    
    return labels[status];
  };

  const getStatusIcon = (status: PrescriptionStatus) => {
    switch (status) {
      case PrescriptionStatus.RECEIVED:
        return <ClipboardDocumentListIcon className="h-5 w-5 text-blue-500" />;
      case PrescriptionStatus.IN_PROGRESS:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case PrescriptionStatus.READY:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case PrescriptionStatus.COMPLETED:
        return <CheckCircleIcon className="h-5 w-5 text-gray-500" />;
      case PrescriptionStatus.ON_HOLD:
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      case PrescriptionStatus.CANCELLED:
        return <ExclamationCircleIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const PrescriptionCard = ({ prescription }: { prescription: Prescription }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {getStatusIcon(prescription.status)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Prescription #{prescription.prescriptionNumber}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                  {getStatusLabel(prescription.status)}
                </span>
              </div>
              
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Patient:</span> {prescription.patient?.firstName} {prescription.patient?.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Prescripteur:</span> Dr. {prescription.prescriber?.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span> {new Date(prescription.dateWritten).toLocaleDateString('fr-FR')}
                </p>
              </div>
              
              {prescription.items && prescription.items.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500">
                    {prescription.items.length} médicament(s):
                  </p>
                  <ul className="mt-1 space-y-1">
                    {prescription.items.slice(0, 2).map((item, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        • {item.product?.name} - Qté: {item.quantity}
                      </li>
                    ))}
                    {prescription.items.length > 2 && (
                      <li className="text-sm text-gray-500">
                        ... et {prescription.items.length - 2} autre(s)
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {prescription.dateFilled && (
              <span>Délivrée le {new Date(prescription.dateFilled).toLocaleDateString('fr-FR')}</span>
            )}
            {prescription.copayAmount && (
              <span>Copayment: {prescription.copayAmount.toFixed(2)} €</span>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/prescriptions/${prescription.id}`}>
                Voir détails
              </Link>
            </Button>
            {prescription.status === PrescriptionStatus.READY && (
              <Button size="sm">
                Délivrer
              </Button>
            )}
            {prescription.status === PrescriptionStatus.IN_PROGRESS && (
              <Button size="sm" variant="outline">
                Marquer prête
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StatusFilters = () => (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={statusFilter === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setStatusFilter('all')}
      >
        Toutes
      </Button>
      {Object.values(PrescriptionStatus).map((status) => (
        <Button
          key={status}
          variant={statusFilter === status ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(status)}
        >
          {getStatusLabel(status)}
        </Button>
      ))}
    </div>
  );

  const Stats = () => {
    const stats = prescriptionsData?.data.reduce((acc, prescription) => {
      acc[prescription.status] = (acc[prescription.status] || 0) + 1;
      return acc;
    }, {} as Record<PrescriptionStatus, number>) || {};

    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardDocumentListIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Reçues</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats[PrescriptionStatus.RECEIVED] || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">En cours</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats[PrescriptionStatus.IN_PROGRESS] || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Prêtes</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats[PrescriptionStatus.READY] || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Complétées</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats[PrescriptionStatus.COMPLETED] || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune prescription</h3>
      <p className="mt-1 text-sm text-gray-500">
        Commencez par ajouter une nouvelle prescription.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/prescriptions/new">
            <PlusIcon className="h-4 w-4 mr-2" />
            Nouvelle prescription
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <Layout title="Prescriptions - PharmacySaaS">
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
            <p className="text-gray-600">
              Gérez les prescriptions de vos patients
            </p>
          </div>
          <Button asChild>
            <Link href="/prescriptions/new">
              <PlusIcon className="h-4 w-4 mr-2" />
              Nouvelle prescription
            </Link>
          </Button>
        </div>

        {/* Statistiques */}
        <Stats />

        {/* Filtres et recherche */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher par numéro, patient, prescripteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                />
              </div>
              <Button variant="outline">
                Exporter
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrer par statut
              </label>
              <StatusFilters />
            </div>
          </CardContent>
        </Card>

        {/* Liste des prescriptions */}
        {isLoading ? (
          <div className="grid gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-40"></div>
              </div>
            ))}
          </div>
        ) : !prescriptionsData?.data.length ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6">
            {prescriptionsData.data.map((prescription) => (
              <PrescriptionCard key={prescription.id} prescription={prescription} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PrescriptionsPage;