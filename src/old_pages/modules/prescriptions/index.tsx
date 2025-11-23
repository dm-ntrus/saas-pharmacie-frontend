import React, { useState } from 'react';
import { 
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserIcon,
  BeakerIcon,
  PrinterIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Card, Button } from '@/design-system';

interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  createdAt: string;
  status: 'pending' | 'in_progress' | 'ready' | 'delivered' | 'rejected';
  priority: 'low' | 'normal' | 'urgent';
  medications: {
    id: string;
    name: string;
    dosage: string;
    quantity: number;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  totalAmount: number;
  notes?: string;
}

const PrescriptionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const prescriptions: Prescription[] = [
    {
      id: '1',
      prescriptionNumber: 'ORD-2025-001',
      patientName: 'Jean Mukasa',
      patientId: 'PAT-001',
      doctorName: 'Dr. Marie Kabila',
      doctorId: 'DOC-001',
      createdAt: '2025-01-21T10:30:00Z',
      status: 'pending',
      priority: 'urgent',
      totalAmount: 15600,
      medications: [
        {
          id: '1',
          name: 'Paracétamol 500mg',
          dosage: '500mg',
          quantity: 20,
          frequency: '3 fois par jour',
          duration: '7 jours',
          instructions: 'Après les repas'
        },
        {
          id: '2',
          name: 'Amoxicilline 250mg',
          dosage: '250mg',
          quantity: 21,
          frequency: '3 fois par jour',
          duration: '7 jours',
          instructions: 'Avec un verre d\'eau'
        }
      ],
      notes: 'Patient allergique à la pénicilline - vérifier alternatives'
    },
    {
      id: '2',
      prescriptionNumber: 'ORD-2025-002',
      patientName: 'Grace Mbuyi',
      patientId: 'PAT-002',
      doctorName: 'Dr. Paul Tshikala',
      doctorId: 'DOC-002',
      createdAt: '2025-01-21T09:15:00Z',
      status: 'in_progress',
      priority: 'normal',
      totalAmount: 8750,
      medications: [
        {
          id: '3',
          name: 'Ibuprofène 400mg',
          dosage: '400mg',
          quantity: 12,
          frequency: '2 fois par jour',
          duration: '5 jours',
          instructions: 'Pendant les repas'
        }
      ]
    },
    {
      id: '3',
      prescriptionNumber: 'ORD-2025-003',
      patientName: 'Pierre Kasongo',
      patientId: 'PAT-003',
      doctorName: 'Dr. Sarah Lukonga',
      doctorId: 'DOC-003',
      createdAt: '2025-01-21T08:45:00Z',
      status: 'ready',
      priority: 'normal',
      totalAmount: 22400,
      medications: [
        {
          id: '4',
          name: 'Oméprazole 20mg',
          dosage: '20mg',
          quantity: 28,
          frequency: '1 fois par jour',
          duration: '28 jours',
          instructions: 'Le matin à jeun'
        },
        {
          id: '5',
          name: 'Métformine 500mg',
          dosage: '500mg',
          quantity: 60,
          frequency: '2 fois par jour',
          duration: '30 jours',
          instructions: 'Avec les repas principaux'
        }
      ]
    }
  ];

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || prescription.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in_progress': return 'En préparation';
      case 'ready': return 'Prêt';
      case 'delivered': return 'Délivré';
      case 'rejected': return 'Rejeté';
      default: return 'Inconnu';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-gray-100 text-gray-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'normal': return 'Normal';
      case 'low': return 'Faible';
      default: return 'Normal';
    }
  };

  const stats = [
    {
      title: 'Total Ordonnances',
      value: prescriptions.length.toString(),
      icon: ClipboardDocumentListIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'En Attente',
      value: prescriptions.filter(p => p.status === 'pending').length.toString(),
      icon: ClockIcon,
      color: 'bg-yellow-500'
    },
    {
      title: 'En Préparation',
      value: prescriptions.filter(p => p.status === 'in_progress').length.toString(),
      icon: BeakerIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Prêtes',
      value: prescriptions.filter(p => p.status === 'ready').length.toString(),
      icon: CheckCircleIcon,
      color: 'bg-green-500'
    }
  ];

  return (
    <Layout title="Gestion des Prescriptions">
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Prescriptions</h1>
            <p className="text-gray-600">Traitement et validation des ordonnances médicales</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button variant="outline">
              <PrinterIcon className="h-5 w-5 mr-2" />
              Imprimer Liste
            </Button>
            <Button variant="primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Nouvelle Prescription
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filtres et recherche */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une prescription..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="in_progress">En préparation</option>
              <option value="ready">Prêt</option>
              <option value="delivered">Délivré</option>
              <option value="rejected">Rejeté</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="all">Toutes priorités</option>
              <option value="urgent">Urgent</option>
              <option value="normal">Normal</option>
              <option value="low">Faible</option>
            </select>

            <Button variant="outline">
              Filtres Avancés
            </Button>
          </div>
        </Card>

        {/* Liste des prescriptions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {prescription.prescriptionNumber}
                  </h3>
                  <p className="text-sm text-gray-600">{prescription.patientName}</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(prescription.status)}`}>
                    {getStatusText(prescription.status)}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(prescription.priority)}`}>
                    {getPriorityText(prescription.priority)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <UserIcon className="h-4 w-4 mr-2" />
                  {prescription.doctorName}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  {new Date(prescription.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  Montant: {prescription.totalAmount.toLocaleString()} FC
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Médicaments ({prescription.medications.length})
                </h4>
                <div className="space-y-2">
                  {prescription.medications.slice(0, 2).map((medication) => (
                    <div key={medication.id} className="text-sm text-gray-600">
                      <span className="font-medium">{medication.name}</span> - {medication.quantity} unités
                    </div>
                  ))}
                  {prescription.medications.length > 2 && (
                    <div className="text-sm text-gray-500">
                      +{prescription.medications.length - 2} autres médicaments
                    </div>
                  )}
                </div>
              </div>

              {prescription.notes && (
                <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                    <p className="text-sm text-yellow-800">{prescription.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex space-x-2 mt-6">
                <Button size="sm" variant="outline" className="flex-1">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Voir
                </Button>
                {prescription.status === 'pending' && (
                  <Button size="sm" variant="primary" className="flex-1">
                    Commencer
                  </Button>
                )}
                {prescription.status === 'in_progress' && (
                  <Button size="sm" variant="primary" className="flex-1">
                    Terminer
                  </Button>
                )}
                {prescription.status === 'ready' && (
                  <Button size="sm" variant="primary" className="flex-1">
                    Délivrer
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredPrescriptions.length === 0 && (
          <Card className="p-12 text-center">
            <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune prescription trouvée</h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche ou ajoutez une nouvelle prescription.
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default PrescriptionsPage;