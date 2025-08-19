import React, { useState } from 'react';
import { 
  DocumentTextIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  EyeIcon,
  Cog6ToothIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Card, Button } from '@/design-system';

interface Report {
  id: string;
  name: string;
  description: string;
  category: 'sales' | 'inventory' | 'financial' | 'operational' | 'compliance';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'on-demand';
  status: 'ready' | 'generating' | 'scheduled' | 'error';
  lastGenerated?: string;
  nextScheduled?: string;
  fileSize?: string;
  format: 'pdf' | 'excel' | 'csv';
}

const ReportsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const reports: Report[] = [
    {
      id: '1',
      name: 'Rapport de Ventes Journalières',
      description: 'Analyse détaillée des ventes de la journée avec breakdown par produit',
      category: 'sales',
      frequency: 'daily',
      status: 'ready',
      lastGenerated: '2025-01-21T18:00:00Z',
      nextScheduled: '2025-01-22T18:00:00Z',
      fileSize: '2.3 MB',
      format: 'pdf'
    },
    {
      id: '2',
      name: 'État des Stocks Critique',
      description: 'Liste des produits en rupture ou en stock faible',
      category: 'inventory',
      frequency: 'weekly',
      status: 'ready',
      lastGenerated: '2025-01-20T08:00:00Z',
      nextScheduled: '2025-01-27T08:00:00Z',
      fileSize: '1.8 MB',
      format: 'excel'
    },
    {
      id: '3',
      name: 'Bilan Financier Mensuel',
      description: 'Rapport financier complet avec revenus, charges et profit',
      category: 'financial',
      frequency: 'monthly',
      status: 'generating',
      nextScheduled: '2025-01-31T23:59:00Z',
      format: 'pdf'
    },
    {
      id: '4',
      name: 'Analyse des Prescriptions',
      description: 'Statistiques sur les prescriptions traitées et validées',
      category: 'operational',
      frequency: 'weekly',
      status: 'ready',
      lastGenerated: '2025-01-20T12:00:00Z',
      nextScheduled: '2025-01-27T12:00:00Z',
      fileSize: '956 KB',
      format: 'pdf'
    },
    {
      id: '5',
      name: 'Audit de Conformité',
      description: 'Vérification du respect des réglementations pharmaceutiques',
      category: 'compliance',
      frequency: 'monthly',
      status: 'scheduled',
      nextScheduled: '2025-01-25T09:00:00Z',
      format: 'pdf'
    },
    {
      id: '6',
      name: 'Performance des Fournisseurs',
      description: 'Évaluation des délais de livraison et qualité des produits',
      category: 'operational',
      frequency: 'quarterly',
      status: 'ready',
      lastGenerated: '2025-01-15T16:00:00Z',
      nextScheduled: '2025-04-15T16:00:00Z',
      fileSize: '3.2 MB',
      format: 'excel'
    },
    {
      id: '7',
      name: 'Données d\'Expiration',
      description: 'Suivi des médicaments arrivant à expiration',
      category: 'inventory',
      frequency: 'weekly',
      status: 'error',
      lastGenerated: '2025-01-14T10:00:00Z',
      format: 'csv'
    },
    {
      id: '8',
      name: 'Analyse Client',
      description: 'Comportement d\'achat et fidélité de la clientèle',
      category: 'sales',
      frequency: 'monthly',
      status: 'ready',
      lastGenerated: '2025-01-01T00:00:00Z',
      nextScheduled: '2025-02-01T00:00:00Z',
      fileSize: '1.5 MB',
      format: 'excel'
    }
  ];

  const categories = [
    { id: 'all', name: 'Tous les Rapports', count: reports.length },
    { id: 'sales', name: 'Ventes', count: reports.filter(r => r.category === 'sales').length },
    { id: 'inventory', name: 'Inventaire', count: reports.filter(r => r.category === 'inventory').length },
    { id: 'financial', name: 'Financier', count: reports.filter(r => r.category === 'financial').length },
    { id: 'operational', name: 'Opérationnel', count: reports.filter(r => r.category === 'operational').length },
    { id: 'compliance', name: 'Conformité', count: reports.filter(r => r.category === 'compliance').length }
  ];

  const filteredReports = reports.filter(report => {
    const matchesCategory = activeCategory === 'all' || report.category === activeCategory;
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'generating': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Prêt';
      case 'generating': return 'En cours';
      case 'scheduled': return 'Programmé';
      case 'error': return 'Erreur';
      default: return 'Inconnu';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return CheckCircleIcon;
      case 'generating': return ClockIcon;
      case 'scheduled': return CalendarIcon;
      case 'error': return ExclamationTriangleIcon;
      default: return DocumentTextIcon;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sales': return 'bg-blue-500';
      case 'inventory': return 'bg-green-500';
      case 'financial': return 'bg-cyan-500';
      case 'operational': return 'bg-orange-500';
      case 'compliance': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'sales': return 'Ventes';
      case 'inventory': return 'Inventaire';
      case 'financial': return 'Financier';
      case 'operational': return 'Opérationnel';
      case 'compliance': return 'Conformité';
      default: return 'Autre';
    }
  };

  const stats = [
    {
      title: 'Rapports Prêts',
      value: reports.filter(r => r.status === 'ready').length.toString(),
      icon: CheckCircleIcon,
      color: 'bg-green-500'
    },
    {
      title: 'En Génération',
      value: reports.filter(r => r.status === 'generating').length.toString(),
      icon: ClockIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Programmés',
      value: reports.filter(r => r.status === 'scheduled').length.toString(),
      icon: CalendarIcon,
      color: 'bg-yellow-500'
    },
    {
      title: 'Avec Erreur',
      value: reports.filter(r => r.status === 'error').length.toString(),
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500'
    }
  ];

  return (
    <Layout title="Rapports et Analyses">
      <div className="p-6 space-y-6">
        {/* En-tête accessible */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Centre de Rapports</h1>
            <p className="text-gray-600">Génération et gestion de vos rapports d'activité</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0" role="group" aria-label="Actions rapports">
            <Button variant="outline" aria-label="Planifier un nouveau rapport">
              <CalendarIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Planifier
            </Button>
            <Button variant="primary" aria-label="Créer un rapport personnalisé">
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Nouveau Rapport
            </Button>
          </div>
        </header>

        {/* Statistiques avec labels accessibles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="region" aria-label="Statistiques des rapports">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1" aria-label={`${stat.title}: ${stat.value}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`} aria-hidden="true">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filtres et recherche */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <label htmlFor="search-reports" className="sr-only">Rechercher dans les rapports</label>
              <input
                id="search-reports"
                type="text"
                placeholder="Rechercher un rapport..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div>
              <label htmlFor="category-filter" className="sr-only">Filtrer par catégorie</label>
              <select
                id="category-filter"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Catégories avec badges */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtres par catégorie">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 py-1 text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                  activeCategory === category.id
                    ? 'bg-sky-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={activeCategory === category.id}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </Card>

        {/* Liste des rapports avec accessibilité */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" role="region" aria-label="Liste des rapports">
          {filteredReports.map((report) => {
            const StatusIcon = getStatusIcon(report.status);
            
            return (
              <Card 
                key={report.id} 
                className="p-6 hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-sky-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={`${getCategoryColor(report.category)} p-2 rounded-lg`} aria-hidden="true">
                      <ChartBarIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {report.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {getCategoryText(report.category)}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {report.frequency === 'daily' ? 'Quotidien' :
                           report.frequency === 'weekly' ? 'Hebdomadaire' :
                           report.frequency === 'monthly' ? 'Mensuel' :
                           report.frequency === 'quarterly' ? 'Trimestriel' :
                           report.frequency === 'annual' ? 'Annuel' : 'À la demande'}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded uppercase">
                          {report.format}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <StatusIcon className="h-5 w-5 mr-2 text-gray-400" aria-hidden="true" />
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(report.status)}`}>
                      {getStatusText(report.status)}
                    </span>
                  </div>
                </div>

                {/* Informations temporelles */}
                <div className="mb-4 space-y-2 text-sm text-gray-600">
                  {report.lastGenerated && (
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" aria-hidden="true" />
                      <span>
                        Dernière génération: {new Date(report.lastGenerated).toLocaleString('fr-FR')}
                      </span>
                    </div>
                  )}
                  {report.nextScheduled && (
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" aria-hidden="true" />
                      <span>
                        Prochaine génération: {new Date(report.nextScheduled).toLocaleString('fr-FR')}
                      </span>
                    </div>
                  )}
                  {report.fileSize && (
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-4 w-4 mr-2 text-gray-500" aria-hidden="true" />
                      <span>Taille: {report.fileSize}</span>
                    </div>
                  )}
                </div>

                {/* Actions par rapport */}
                <div className="flex space-x-2" role="group" aria-label={`Actions pour ${report.name}`}>
                  {report.status === 'ready' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="primary"
                        aria-label={`Télécharger ${report.name}`}
                      >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                        Télécharger
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        aria-label={`Prévisualiser ${report.name}`}
                      >
                        <EyeIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                        Voir
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        aria-label={`Imprimer ${report.name}`}
                      >
                        <PrinterIcon className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">Imprimer</span>
                      </Button>
                    </>
                  )}
                  
                  {report.status === 'error' && (
                    <Button 
                      size="sm" 
                      variant="primary"
                      aria-label={`Régénérer ${report.name}`}
                    >
                      <ClockIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                      Régénérer
                    </Button>
                  )}

                  {(report.status === 'scheduled' || report.status === 'ready') && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      aria-label={`Configurer ${report.name}`}
                    >
                      <Cog6ToothIcon className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Configurer</span>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Message d'état vide */}
        {filteredReports.length === 0 && (
          <Card className="p-12 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rapport trouvé</h3>
            <p className="text-gray-600 mb-4">
              Aucun rapport ne correspond à vos critères de recherche.
            </p>
            <Button variant="primary">
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Créer un nouveau rapport
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ReportsPage;