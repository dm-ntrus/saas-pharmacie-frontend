import React, { useState } from 'react';
import { 
  BeakerIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CalendarDaysIcon,
  EyeIcon,
  PrinterIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Card, Button } from '@/design-system';

interface LabTest {
  id: string;
  testType: 'analysis' | 'preparation' | 'stability' | 'microbiological' | 'chemical';
  productName: string;
  sampleId: string;
  requestDate: string;
  completionDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  priority: 'low' | 'normal' | 'urgent';
  technician: string;
  requestedBy: string;
  results?: {
    parameter: string;
    value: string;
    specification: string;
    status: 'pass' | 'fail' | 'pending';
  }[];
  notes?: string;
  attachments?: string[];
}

const LaboratoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const labTests: LabTest[] = [
    {
      id: '1',
      testType: 'analysis',
      productName: 'Paracétamol 500mg',
      sampleId: 'SAMP-2025-001',
      requestDate: '2025-01-21T08:30:00Z',
      status: 'in_progress',
      priority: 'normal',
      technician: 'Dr. Marie Kabila',
      requestedBy: 'Jean Mukasa',
      results: [
        { parameter: 'Teneur en principe actif', value: '502.3 mg', specification: '475-525 mg', status: 'pass' },
        { parameter: 'Friabilité', value: '0.8%', specification: '< 1%', status: 'pass' },
        { parameter: 'Désagrégation', value: 'En cours', specification: '< 15 min', status: 'pending' }
      ],
      notes: 'Analyse de routine post-réception'
    },
    {
      id: '2',
      testType: 'preparation',
      productName: 'Solution antiseptique custom',
      sampleId: 'PREP-2025-008',
      requestDate: '2025-01-20T14:00:00Z',
      completionDate: '2025-01-21T10:30:00Z',
      status: 'completed',
      priority: 'urgent',
      technician: 'Paul Tshikala',
      requestedBy: 'Grace Mbuyi',
      results: [
        { parameter: 'Concentration finale', value: '70%', specification: '70% ±2%', status: 'pass' },
        { parameter: 'pH', value: '6.8', specification: '6.5-7.5', status: 'pass' },
        { parameter: 'Stérilité', value: 'Stérile', specification: 'Stérile', status: 'pass' }
      ],
      notes: 'Préparation magistrale pour service chirurgie',
      attachments: ['rapport_sterility.pdf', 'protocol_preparation.pdf']
    },
    {
      id: '3',
      testType: 'stability',
      productName: 'Insuline Rapide',
      sampleId: 'STAB-2025-003',
      requestDate: '2025-01-18T09:00:00Z',
      status: 'pending',
      priority: 'normal',
      technician: 'Pierre Kasongo',
      requestedBy: 'Marie Kabila',
      notes: 'Test de stabilité accéléré - conditions 40°C/75%HR'
    },
    {
      id: '4',
      testType: 'microbiological',
      productName: 'Sirop pédiatrique maison',
      sampleId: 'MICRO-2025-012',
      requestDate: '2025-01-19T16:30:00Z',
      status: 'on_hold',
      priority: 'urgent',
      technician: 'Sarah Lukonga',
      requestedBy: 'Jean Mukasa',
      results: [
        { parameter: 'Germes totaux', value: 'En cours', specification: '< 100 CFU/ml', status: 'pending' },
        { parameter: 'Levures/Moisissures', value: 'En cours', specification: '< 10 CFU/ml', status: 'pending' }
      ],
      notes: 'En attente d\'équipement - incubateur en panne'
    }
  ];

  const filteredTests = labTests.filter(test => {
    const matchesSearch = test.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.sampleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.technician.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || test.testType === typeFilter;
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'on_hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in_progress': return 'En cours';
      case 'pending': return 'En attente';
      case 'on_hold': return 'Suspendu';
      default: return 'Inconnu';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'analysis': return 'Analyse';
      case 'preparation': return 'Préparation';
      case 'stability': return 'Stabilité';
      case 'microbiological': return 'Microbiologie';
      case 'chemical': return 'Chimique';
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

  const stats = [
    {
      title: 'Tests ce Mois',
      value: labTests.length.toString(),
      icon: BeakerIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'En Cours',
      value: labTests.filter(t => t.status === 'in_progress').length.toString(),
      icon: BeakerIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Terminés',
      value: labTests.filter(t => t.status === 'completed').length.toString(),
      icon: CheckCircleIcon,
      color: 'bg-green-500'
    },
    {
      title: 'En Attente',
      value: labTests.filter(t => t.status === 'pending' || t.status === 'on_hold').length.toString(),
      icon: ClockIcon,
      color: 'bg-yellow-500'
    }
  ];

  const testTypes = ['all', 'analysis', 'preparation', 'stability', 'microbiological', 'chemical'];
  const statusTypes = ['all', 'pending', 'in_progress', 'completed', 'on_hold'];

  return (
    <Layout title="Laboratoire">
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Laboratoire</h1>
            <p className="text-gray-600">Gestion des analyses et préparations magistrales</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button variant="outline">
              <PrinterIcon className="h-5 w-5 mr-2" />
              Rapport Labo
            </Button>
            <Button variant="outline">
              <CogIcon className="h-5 w-5 mr-2" />
              Équipements
            </Button>
            <Button variant="primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Nouvelle Analyse
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
                placeholder="Rechercher un test..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {testTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'Tous les types' : getTypeText(type)}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {statusTypes.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'Tous les statuts' : getStatusText(status)}
                </option>
              ))}
            </select>

            <Button variant="outline">
              Planification
            </Button>
          </div>
        </Card>

        {/* Liste des tests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTests.map((test) => (
            <Card key={test.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{test.productName}</h3>
                  <p className="text-sm text-gray-600">Échantillon: {test.sampleId}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {getTypeText(test.testType)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}>
                      {getStatusText(test.status)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(test.priority)}`}>
                      {test.priority === 'urgent' ? 'Urgent' :
                       test.priority === 'normal' ? 'Normal' : 'Faible'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Technicien: {test.technician}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarDaysIcon className="h-4 w-4 mr-2" />
                  Demandé: {new Date(test.requestDate).toLocaleDateString('fr-FR')}
                </div>
                {test.completionDate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Terminé: {new Date(test.completionDate).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>

              {/* Résultats */}
              {test.results && test.results.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Résultats</h4>
                  <div className="space-y-2">
                    {test.results.slice(0, 3).map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <span className="text-sm text-gray-900">{result.parameter}</span>
                          <div className="text-xs text-gray-600">Spec: {result.specification}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">{result.value}</span>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            result.status === 'pass' ? 'bg-green-100 text-green-800' :
                            result.status === 'fail' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {result.status === 'pass' ? 'Conforme' :
                             result.status === 'fail' ? 'Non-conforme' : 'En cours'}
                          </span>
                        </div>
                      </div>
                    ))}
                    {test.results.length > 3 && (
                      <p className="text-sm text-gray-500">+{test.results.length - 3} autres paramètres</p>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {test.notes && (
                <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400">
                  <p className="text-sm text-blue-700">{test.notes}</p>
                </div>
              )}

              {/* Pièces jointes */}
              {test.attachments && test.attachments.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Pièces jointes</h4>
                  <div className="flex flex-wrap gap-2">
                    {test.attachments.map((attachment, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded flex items-center">
                        <DocumentTextIcon className="h-3 w-3 mr-1" />
                        {attachment}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Voir
                </Button>
                {test.status === 'pending' && (
                  <Button size="sm" variant="primary" className="flex-1">
                    Commencer
                  </Button>
                )}
                {test.status === 'in_progress' && (
                  <Button size="sm" variant="primary" className="flex-1">
                    Finaliser
                  </Button>
                )}
                {test.status === 'completed' && (
                  <Button size="sm" variant="outline" className="flex-1">
                    <PrinterIcon className="h-4 w-4 mr-1" />
                    Rapport
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <Card className="p-12 text-center">
            <BeakerIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun test trouvé</h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche ou ajoutez une nouvelle analyse.
            </p>
          </Card>
        )}

        {/* Capacités du laboratoire */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyses Disponibles</h3>
            <div className="space-y-3">
              {[
                { type: 'Analyses physicochimiques', description: 'Dosage, pH, dissolution, friabilité' },
                { type: 'Contrôles microbiologiques', description: 'Stérilité, germes totaux, pathogènes' },
                { type: 'Tests de stabilité', description: 'Conditions accélérées et long terme' },
                { type: 'Préparations magistrales', description: 'Formulations personnalisées' },
                { type: 'Contrôles d\'environnement', description: 'Air, surfaces, eau' }
              ].map((analysis, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900">{analysis.type}</h4>
                  <p className="text-sm text-gray-600">{analysis.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">État des Équipements</h3>
            <div className="space-y-3">
              {[
                { equipment: 'HPLC Shimadzu', status: 'operational', lastMaintenance: '2025-01-15' },
                { equipment: 'Spectrophotomètre UV', status: 'operational', lastMaintenance: '2025-01-10' },
                { equipment: 'Incubateur microbiologique', status: 'maintenance', lastMaintenance: '2024-12-20' },
                { equipment: 'Balance analytique', status: 'operational', lastMaintenance: '2025-01-08' },
                { equipment: 'Étuve de séchage', status: 'operational', lastMaintenance: '2024-12-28' }
              ].map((equipment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{equipment.equipment}</p>
                    <p className="text-xs text-gray-600">
                      Dernière maintenance: {new Date(equipment.lastMaintenance).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    equipment.status === 'operational' ? 'bg-green-100 text-green-800' :
                    equipment.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {equipment.status === 'operational' ? 'Opérationnel' :
                     equipment.status === 'maintenance' ? 'Maintenance' : 'Hors service'}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LaboratoryPage;