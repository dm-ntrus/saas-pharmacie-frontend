import React, { useState } from 'react';
import { 
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  CalendarDaysIcon,
  EyeIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Card, Button } from '@/design-system';

interface QualityCheck {
  id: string;
  type: 'incoming' | 'storage' | 'batch' | 'expiry' | 'temperature' | 'packaging';
  productName: string;
  batchNumber: string;
  checkDate: string;
  status: 'passed' | 'failed' | 'pending' | 'warning';
  inspector: string;
  criteria: {
    name: string;
    result: 'pass' | 'fail' | 'na';
    notes?: string;
  }[];
  overallScore: number;
  nonConformities?: string[];
  correctionActions?: string[];
  nextCheckDate?: string;
}

const QualityPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const qualityChecks: QualityCheck[] = [
    {
      id: '1',
      type: 'incoming',
      productName: 'Paracétamol 500mg',
      batchNumber: 'LOT2025001',
      checkDate: '2025-01-21T09:30:00Z',
      status: 'passed',
      inspector: 'Dr. Marie Kabila',
      overallScore: 95,
      criteria: [
        { name: 'Intégrité emballage', result: 'pass' },
        { name: 'Étiquetage conforme', result: 'pass' },
        { name: 'Date expiration', result: 'pass' },
        { name: 'Température transport', result: 'pass' },
        { name: 'Documentation', result: 'pass' }
      ],
      nextCheckDate: '2025-07-21'
    },
    {
      id: '2',
      type: 'batch',
      productName: 'Amoxicilline 250mg',
      batchNumber: 'LOT2025002',
      checkDate: '2025-01-20T14:15:00Z',
      status: 'warning',
      inspector: 'Paul Tshikala',
      overallScore: 78,
      criteria: [
        { name: 'Aspect visuel', result: 'pass' },
        { name: 'Homogénéité', result: 'pass' },
        { name: 'pH', result: 'fail', notes: 'Légèrement acide (6.2 au lieu de 6.5-7.0)' },
        { name: 'Pureté', result: 'pass' },
        { name: 'Microbiologie', result: 'pass' }
      ],
      nonConformities: ['pH en dehors des spécifications'],
      correctionActions: ['Surveillance renforcée', 'Test de stabilité accéléré'],
      nextCheckDate: '2025-02-20'
    },
    {
      id: '3',
      type: 'storage',
      productName: 'Insuline Rapide',
      batchNumber: 'LOT2025003',
      checkDate: '2025-01-19T11:00:00Z',
      status: 'failed',
      inspector: 'Grace Mbuyi',
      overallScore: 45,
      criteria: [
        { name: 'Température stockage', result: 'fail', notes: 'Température dépassée: 8°C au lieu de 2-6°C' },
        { name: 'Chaîne de froid', result: 'fail' },
        { name: 'Étiquetage', result: 'pass' },
        { name: 'Emballage', result: 'pass' }
      ],
      nonConformities: ['Rupture chaîne de froid', 'Température inadéquate'],
      correctionActions: ['Vérification équipement réfrigération', 'Formation personnel', 'Destruction lot compromis']
    },
    {
      id: '4',
      type: 'expiry',
      productName: 'Vitamine C 1000mg',
      batchNumber: 'LOT2024045',
      checkDate: '2025-01-18T16:30:00Z',
      status: 'pending',
      inspector: 'Jean Mukasa',
      overallScore: 0,
      criteria: [
        { name: 'Contrôle visuel', result: 'na' },
        { name: 'Test dissolution', result: 'na' },
        { name: 'Dosage', result: 'na' }
      ]
    }
  ];

  const filteredChecks = qualityChecks.filter(check => {
    const matchesSearch = check.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.inspector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || check.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || check.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'passed': return 'Conforme';
      case 'failed': return 'Non-conforme';
      case 'warning': return 'Attention';
      case 'pending': return 'En cours';
      default: return 'Inconnu';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'incoming': return 'Réception';
      case 'storage': return 'Stockage';
      case 'batch': return 'Lot';
      case 'expiry': return 'Péremption';
      case 'temperature': return 'Température';
      case 'packaging': return 'Emballage';
      default: return 'Inconnu';
    }
  };

  const stats = [
    {
      title: 'Contrôles ce Mois',
      value: qualityChecks.length.toString(),
      icon: DocumentCheckIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Conformes',
      value: qualityChecks.filter(q => q.status === 'passed').length.toString(),
      icon: CheckCircleIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Non-conformes',
      value: qualityChecks.filter(q => q.status === 'failed').length.toString(),
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500'
    },
    {
      title: 'En Attente',
      value: qualityChecks.filter(q => q.status === 'pending').length.toString(),
      icon: ClockIcon,
      color: 'bg-yellow-500'
    }
  ];

  const qualityTypes = [
    'all', 'incoming', 'storage', 'batch', 'expiry', 'temperature', 'packaging'
  ];

  const statusTypes = ['all', 'passed', 'failed', 'warning', 'pending'];

  return (
    <Layout title="Contrôle Qualité">
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contrôle Qualité</h1>
            <p className="text-gray-600">Gestion de la qualité et conformité réglementaire</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button variant="outline">
              <PrinterIcon className="h-5 w-5 mr-2" />
              Rapport Qualité
            </Button>
            <Button variant="primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Nouveau Contrôle
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
                placeholder="Rechercher un contrôle..."
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
              {qualityTypes.map(type => (
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
              Filtres Avancés
            </Button>
          </div>
        </Card>

        {/* Liste des contrôles qualité */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredChecks.map((check) => (
            <Card key={check.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{check.productName}</h3>
                  <p className="text-sm text-gray-600">Lot: {check.batchNumber}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {getTypeText(check.type)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(check.status)}`}>
                      {getStatusText(check.status)}
                    </span>
                  </div>
                </div>
                {check.overallScore > 0 && (
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      check.overallScore >= 90 ? 'text-green-600' :
                      check.overallScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {check.overallScore}%
                    </div>
                    <p className="text-xs text-gray-600">Score global</p>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Inspecteur: {check.inspector}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarDaysIcon className="h-4 w-4 mr-2" />
                  {new Date(check.checkDate).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                {check.nextCheckDate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Prochain contrôle: {new Date(check.nextCheckDate).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>

              {/* Critères de contrôle */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Critères évalués</h4>
                <div className="space-y-2">
                  {check.criteria.slice(0, 3).map((criterion, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{criterion.name}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        criterion.result === 'pass' ? 'bg-green-100 text-green-800' :
                        criterion.result === 'fail' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {criterion.result === 'pass' ? 'Conforme' :
                         criterion.result === 'fail' ? 'Non-conforme' : 'N/A'}
                      </span>
                    </div>
                  ))}
                  {check.criteria.length > 3 && (
                    <p className="text-sm text-gray-500">+{check.criteria.length - 3} autres critères</p>
                  )}
                </div>
              </div>

              {/* Non-conformités */}
              {check.nonConformities && check.nonConformities.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Non-conformités</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {check.nonConformities.map((nc, index) => (
                      <li key={index}>• {nc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions correctives */}
              {check.correctionActions && check.correctionActions.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">Actions correctives</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {check.correctionActions.map((action, index) => (
                      <li key={index}>• {action}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Voir Détails
                </Button>
                {check.status === 'pending' && (
                  <Button size="sm" variant="primary" className="flex-1">
                    <BeakerIcon className="h-4 w-4 mr-1" />
                    Effectuer Test
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredChecks.length === 0 && (
          <Card className="p-12 text-center">
            <ShieldCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun contrôle trouvé</h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche ou ajoutez un nouveau contrôle.
            </p>
          </Card>
        )}

        {/* Tableau de bord conformité */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Taux de Conformité par Type</h3>
            <div className="space-y-4">
              {qualityTypes.slice(1).map((type) => {
                const typeChecks = qualityChecks.filter(q => q.type === type);
                const passedChecks = typeChecks.filter(q => q.status === 'passed').length;
                const conformityRate = typeChecks.length > 0 ? (passedChecks / typeChecks.length) * 100 : 0;
                
                return (
                  <div key={type}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-900">{getTypeText(type)}</span>
                      <span className="text-sm text-gray-600">{conformityRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          conformityRate >= 90 ? 'bg-green-600' :
                          conformityRate >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${conformityRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Prioritaires</h3>
            <div className="space-y-3">
              {qualityChecks
                .filter(q => q.status === 'failed' || q.nonConformities?.length)
                .slice(0, 4)
                .map((check) => (
                  <div key={check.id} className="flex items-center p-3 bg-red-50 border-l-4 border-red-400 rounded">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-red-800">{check.productName}</p>
                      <p className="text-xs text-red-700">Lot {check.batchNumber} - Action immédiate requise</p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default QualityPage;