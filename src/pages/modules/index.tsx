import React, { useState } from 'react';
import { 
  CubeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  TruckIcon,
  BeakerIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CogIcon,
  BuildingStorefrontIcon,
  HeartIcon,
  BellIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Card, Button } from '@/design-system';

interface Module {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'core' | 'advanced' | 'analytics' | 'integration';
  status: 'active' | 'inactive' | 'coming_soon';
  features: string[];
  route?: string;
}

const ModulesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const modules: Module[] = [
    {
      id: 'inventory',
      name: 'Gestion des Stocks',
      description: 'Gestion complète de l\'inventaire pharmaceutique avec alertes automatiques',
      icon: CubeIcon,
      category: 'core',
      status: 'active',
      features: ['Suivi en temps réel', 'Alertes de stock', 'Gestion des lots', 'Dates d\'expiration'],
      route: '/modules/inventory'
    },
    {
      id: 'prescriptions',
      name: 'Prescriptions',
      description: 'Traitement et validation des ordonnances médicales',
      icon: ClipboardDocumentListIcon,
      category: 'core',
      status: 'active',
      features: ['Validation pharmaceutique', 'Interactions médicamenteuses', 'Historique patient'],
      route: '/modules/prescriptions'
    },
    {
      id: 'sales',
      name: 'Point de Vente',
      description: 'Interface de caisse et gestion des transactions',
      icon: CurrencyDollarIcon,
      category: 'core',
      status: 'active',
      features: ['Caisse rapide', 'Paiements multiples', 'Reçus électroniques', 'Remises'],
      route: '/modules/sales'
    },
    {
      id: 'customers',
      name: 'Gestion Clients',
      description: 'Base de données clients et fidélisation',
      icon: UserGroupIcon,
      category: 'core',
      status: 'active',
      features: ['Profils clients', 'Historique des achats', 'Programme fidélité', 'Communications'],
      route: '/modules/customers'
    },
    {
      id: 'suppliers',
      name: 'Fournisseurs',
      description: 'Gestion des relations fournisseurs et approvisionnements',
      icon: TruckIcon,
      category: 'core',
      status: 'active',
      features: ['Catalogue fournisseurs', 'Commandes automatiques', 'Livraisons', 'Évaluations'],
      route: '/modules/suppliers'
    },
    {
      id: 'analytics',
      name: 'Analyses & Rapports',
      description: 'Tableaux de bord et analyses business intelligence',
      icon: ChartBarIcon,
      category: 'analytics',
      status: 'active',
      features: ['KPIs temps réel', 'Rapports personnalisés', 'Tendances', 'Prévisions'],
      route: '/modules/analytics'
    },
    {
      id: 'quality',
      name: 'Contrôle Qualité',
      description: 'Gestion de la qualité et conformité réglementaire',
      icon: ShieldCheckIcon,
      category: 'advanced',
      status: 'active',
      features: ['Audits qualité', 'Traçabilité', 'Conformité', 'Certifications'],
      route: '/modules/quality'
    },
    {
      id: 'laboratory',
      name: 'Laboratoire',
      description: 'Gestion des analyses et préparations magistrales',
      icon: BeakerIcon,
      category: 'advanced',
      status: 'active',
      features: ['Préparations', 'Analyses', 'Formules', 'Contrôles'],
      route: '/modules/laboratory'
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      description: 'Boutique en ligne et ventes digitales',
      icon: BuildingStorefrontIcon,
      category: 'integration',
      status: 'active',
      features: ['Site web', 'Commandes en ligne', 'Livraisons', 'Paiements digitaux'],
      route: '/modules/ecommerce'
    },
    {
      id: 'telemedicine',
      name: 'Télémédecine',
      description: 'Consultations à distance et suivi patients',
      icon: HeartIcon,
      category: 'integration',
      status: 'coming_soon',
      features: ['Consultations vidéo', 'Dossiers électroniques', 'Prescriptions digitales'],
    },
    {
      id: 'hr',
      name: 'Ressources Humaines',
      description: 'Gestion du personnel et planification',
      icon: UserGroupIcon,
      category: 'advanced',
      status: 'active',
      features: ['Équipes', 'Plannings', 'Performances', 'Formations'],
      route: '/modules/hr'
    },
    {
      id: 'accounting',
      name: 'Comptabilité',
      description: 'Gestion financière et comptable complète',
      icon: DocumentTextIcon,
      category: 'advanced',
      status: 'active',
      features: ['Grand livre', 'Factures', 'TVA', 'Bilan'],
      route: '/modules/accounting'
    },
    {
      id: 'reports',
      name: 'Rapports et Analyses',
      description: 'Génération et gestion des rapports d\'activité',
      icon: ChartBarIcon,
      category: 'analytics',
      status: 'active',
      features: ['Rapports automatisés', 'Tableaux de bord', 'Analyses personnalisées'],
      route: '/modules/reports'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      description: 'Centre de notifications et alertes système',
      icon: BellIcon,
      category: 'integration',
      status: 'active',
      features: ['Alertes temps réel', 'Notifications push', 'Historique complet'],
      route: '/modules/notifications'
    },
    {
      id: 'communication',
      name: 'Communication',
      description: 'Gestion des communications client (SMS, Email)',
      icon: ChatBubbleLeftRightIcon,
      category: 'integration',
      status: 'active',
      features: ['Campagnes marketing', 'Messages automatisés', 'Modèles personnalisés'],
      route: '/modules/communication'
    },
    {
      id: 'settings',
      name: 'Paramètres',
      description: 'Configuration et gestion du système',
      icon: CogIcon,
      category: 'integration',
      status: 'active',
      features: ['Paramètres système', 'Utilisateurs', 'Sécurité', 'Intégrations'],
      route: '/modules/settings'
    }
  ];

  const categories = [
    { id: 'all', name: 'Tous les Modules', count: modules.length },
    { id: 'core', name: 'Modules Principaux', count: modules.filter(m => m.category === 'core').length },
    { id: 'advanced', name: 'Modules Avancés', count: modules.filter(m => m.category === 'advanced').length },
    { id: 'analytics', name: 'Analyses', count: modules.filter(m => m.category === 'analytics').length },
    { id: 'integration', name: 'Intégrations', count: modules.filter(m => m.category === 'integration').length }
  ];

  const filteredModules = selectedCategory === 'all' 
    ? modules 
    : modules.filter(module => module.category === selectedCategory);

  const getStatusBadge = (status: Module['status']) => {
    const config = {
      active: { color: 'bg-green-100 text-green-800', text: 'Actif' },
      inactive: { color: 'bg-gray-100 text-gray-800', text: 'Inactif' },
      coming_soon: { color: 'bg-blue-100 text-blue-800', text: 'Bientôt' }
    };
    
    const statusConfig = config[status];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}>
        {statusConfig.text}
      </span>
    );
  };

  const getCategoryColor = (category: Module['category']) => {
    const colors = {
      core: 'bg-blue-500',
      advanced: 'bg-purple-500',
      analytics: 'bg-green-500',
      integration: 'bg-orange-500'
    };
    return colors[category];
  };

  return (
    <Layout title="Modules de la Plateforme">
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modules de Gestion</h1>
            <p className="text-gray-600">Découvrez toutes les fonctionnalités de votre plateforme pharmaceutique</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button variant="outline">
              <CogIcon className="h-5 w-5 mr-2" />
              Configuration
            </Button>
          </div>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Grille des modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModules.map((module) => (
            <Card key={module.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`${getCategoryColor(module.category)} p-3 rounded-lg`}>
                  <module.icon className="h-6 w-6 text-white" />
                </div>
                {getStatusBadge(module.status)}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{module.description}</p>
              
              <div className="space-y-2 mb-6">
                {module.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                {module.status === 'active' && module.route ? (
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => module.route && (window.location.href = module.route)}
                  >
                    Accéder
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="flex-1" disabled>
                    {module.status === 'coming_soon' ? 'Bientôt' : 'Indisponible'}
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <CogIcon className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Statistiques des modules */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {modules.filter(m => m.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Modules Actifs</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {modules.filter(m => m.category === 'core').length}
            </div>
            <div className="text-sm text-gray-600">Modules Core</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {modules.filter(m => m.category === 'advanced').length}
            </div>
            <div className="text-sm text-gray-600">Modules Avancés</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {modules.filter(m => m.status === 'coming_soon').length}
            </div>
            <div className="text-sm text-gray-600">À Venir</div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ModulesPage;