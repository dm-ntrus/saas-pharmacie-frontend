import React, { useState } from 'react';
import { 
  Cog6ToothIcon,
  UserIcon,
  ShieldCheckIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  CreditCardIcon,
  CircleStackIcon,
  DocumentTextIcon,
  KeyIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Card, Button } from '@/design-system';

interface Setting {
  id: string;
  name: string;
  description: string;
  value: string | boolean | number;
  type: 'text' | 'boolean' | 'number' | 'select' | 'password';
  category: string;
  options?: string[];
  editable?: boolean;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, any>>({});

  const settings: Setting[] = [
    // Paramètres Généraux
    {
      id: 'pharmacy_name',
      name: 'Nom de la Pharmacie',
      description: 'Nom affiché sur les reçus et documents',
      value: 'Pharmacie NakiCode',
      type: 'text',
      category: 'general',
      editable: true
    },
    {
      id: 'pharmacy_address',
      name: 'Adresse',
      description: 'Adresse complète de la pharmacie',
      value: '123 Avenue de la Liberté, Kinshasa, RDC',
      type: 'text',
      category: 'general',
      editable: true
    },
    {
      id: 'pharmacy_phone',
      name: 'Téléphone',
      description: 'Numéro de téléphone principal',
      value: '+243 99 123 4567',
      type: 'text',
      category: 'general',
      editable: true
    },
    {
      id: 'language',
      name: 'Langue',
      description: 'Langue de l\'interface utilisateur',
      value: 'Français',
      type: 'select',
      category: 'general',
      options: ['Français', 'English', 'Lingala', 'Swahili'],
      editable: true
    },
    {
      id: 'timezone',
      name: 'Fuseau Horaire',
      description: 'Fuseau horaire pour les horodatages',
      value: 'Africa/Kinshasa',
      type: 'select',
      category: 'general',
      options: ['Africa/Kinshasa', 'Africa/Bujumbura', 'Africa/Kampala'],
      editable: true
    },
    
    // Notifications
    {
      id: 'stock_alerts',
      name: 'Alertes de Stock',
      description: 'Recevoir des alertes quand les stocks sont faibles',
      value: true,
      type: 'boolean',
      category: 'notifications',
      editable: true
    },
    {
      id: 'expiry_alerts',
      name: 'Alertes d\'Expiration',
      description: 'Alertes pour les médicaments arrivant à expiration',
      value: true,
      type: 'boolean',
      category: 'notifications',
      editable: true
    },
    {
      id: 'email_notifications',
      name: 'Notifications Email',
      description: 'Recevoir les notifications par email',
      value: true,
      type: 'boolean',
      category: 'notifications',
      editable: true
    },
    {
      id: 'sms_notifications',
      name: 'Notifications SMS',
      description: 'Recevoir les notifications par SMS',
      value: false,
      type: 'boolean',
      category: 'notifications',
      editable: true
    },
    
    // Sécurité
    {
      id: 'two_factor',
      name: 'Authentification à 2 Facteurs',
      description: 'Sécurité renforcée avec authentification double',
      value: false,
      type: 'boolean',
      category: 'security',
      editable: true
    },
    {
      id: 'session_timeout',
      name: 'Timeout de Session',
      description: 'Durée d\'inactivité avant déconnexion (minutes)',
      value: 60,
      type: 'number',
      category: 'security',
      editable: true
    },
    {
      id: 'password_policy',
      name: 'Politique de Mot de Passe',
      description: 'Niveau de sécurité requis pour les mots de passe',
      value: 'Élevé',
      type: 'select',
      category: 'security',
      options: ['Faible', 'Moyen', 'Élevé'],
      editable: true
    },
    
    // Intégrations
    {
      id: 'payment_gateway',
      name: 'Passerelle de Paiement',
      description: 'Service de paiement électronique activé',
      value: 'Stripe + Mobile Money',
      type: 'select',
      category: 'integrations',
      options: ['Désactivé', 'Stripe', 'Mobile Money', 'Stripe + Mobile Money'],
      editable: true
    },
    {
      id: 'inventory_sync',
      name: 'Synchronisation Inventaire',
      description: 'Synchronisation automatique avec les fournisseurs',
      value: true,
      type: 'boolean',
      category: 'integrations',
      editable: true
    },
    {
      id: 'backup_frequency',
      name: 'Fréquence de Sauvegarde',
      description: 'Fréquence des sauvegardes automatiques',
      value: 'Quotidienne',
      type: 'select',
      category: 'integrations',
      options: ['Désactivée', 'Quotidienne', 'Hebdomadaire', 'Mensuelle'],
      editable: true
    }
  ];

  const categories = [
    { id: 'general', name: 'Général', icon: Cog6ToothIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Sécurité', icon: ShieldCheckIcon },
    { id: 'integrations', name: 'Intégrations', icon: GlobeAltIcon }
  ];

  const filteredSettings = settings.filter(setting => 
    activeTab === 'all' || setting.category === activeTab
  );

  const startEditing = (settingId: string, currentValue: any) => {
    setEditingId(settingId);
    setEditValues({ ...editValues, [settingId]: currentValue });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = (settingId: string) => {
    // Ici on sauvegarderait la valeur dans la base de données
    console.log('Sauvegarde:', settingId, editValues[settingId]);
    setEditingId(null);
    setEditValues({});
  };

  const renderSettingValue = (setting: Setting) => {
    const isEditing = editingId === setting.id;
    const editValue = editValues[setting.id] ?? setting.value;

    if (!isEditing) {
      if (setting.type === 'boolean') {
        return (
          <span className={`px-2 py-1 text-sm rounded-full ${
            setting.value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {setting.value ? 'Activé' : 'Désactivé'}
          </span>
        );
      }
      return <span className="text-gray-900">{setting.value.toString()}</span>;
    }

    switch (setting.type) {
      case 'text':
        return (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValues({ ...editValues, [setting.id]: e.target.value })}
            className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-sky-500"
            autoFocus
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValues({ ...editValues, [setting.id]: parseInt(e.target.value) })}
            className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-sky-500 w-24"
            autoFocus
          />
        );
      
      case 'boolean':
        return (
          <button
            onClick={() => setEditValues({ ...editValues, [setting.id]: !editValue })}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              editValue ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
            autoFocus
          >
            {editValue ? 'Activé' : 'Désactivé'}
          </button>
        );
      
      case 'select':
        return (
          <select
            value={editValue}
            onChange={(e) => setEditValues({ ...editValues, [setting.id]: e.target.value })}
            className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-sky-500"
            autoFocus
          >
            {setting.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      default:
        return <span>{setting.value.toString()}</span>;
    }
  };

  const stats = [
    {
      title: 'Paramètres Configurés',
      value: settings.filter(s => s.editable).length.toString(),
      icon: Cog6ToothIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Sécurité Active',
      value: settings.filter(s => s.category === 'security' && s.value === true).length.toString(),
      icon: ShieldCheckIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Notifications',
      value: settings.filter(s => s.category === 'notifications' && s.value === true).length.toString(),
      icon: BellIcon,
      color: 'bg-yellow-500'
    },
    {
      title: 'Intégrations',
      value: settings.filter(s => s.category === 'integrations' && s.value === true).length.toString(),
      icon: GlobeAltIcon,
      color: 'bg-cyan-500'
    }
  ];

  return (
    <Layout title="Paramètres">
      <div className="p-6 space-y-6">
        {/* En-tête avec accessibilité */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Paramètres Système</h1>
            <p className="text-gray-600">Configuration et préférences de la pharmacie</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0" role="group" aria-label="Actions paramètres">
            <Button variant="outline" aria-label="Exporter la configuration">
              <DocumentTextIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Exporter Config
            </Button>
            <Button variant="outline" aria-label="Sauvegarder les paramètres">
              <CircleStackIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Sauvegarder
            </Button>
          </div>
        </header>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="region" aria-label="Statistiques des paramètres">
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

        {/* Onglets de navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" role="tablist" aria-label="Catégories de paramètres">
            {categories.map(category => (
              <button
                key={category.id}
                role="tab"
                aria-selected={activeTab === category.id}
                aria-controls={`${category.id}-panel`}
                onClick={() => setActiveTab(category.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                  activeTab === category.id
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <category.icon className="h-5 w-5 mr-2" aria-hidden="true" />
                {category.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Liste des paramètres */}
        <div role="tabpanel" id={`${activeTab}-panel`} aria-labelledby={`${activeTab}-tab`}>
          <div className="space-y-4">
            {filteredSettings.map((setting) => (
              <Card key={setting.id} className="p-6 hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-sky-500">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{setting.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      {renderSettingValue(setting)}
                    </div>

                    {setting.editable && (
                      <div className="flex space-x-2" role="group" aria-label={`Actions pour ${setting.name}`}>
                        {editingId === setting.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => saveEdit(setting.id)}
                              aria-label={`Sauvegarder ${setting.name}`}
                            >
                              <CheckIcon className="h-4 w-4" aria-hidden="true" />
                              <span className="sr-only">Sauvegarder</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEditing}
                              aria-label={`Annuler la modification de ${setting.name}`}
                            >
                              <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                              <span className="sr-only">Annuler</span>
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditing(setting.id, setting.value)}
                            aria-label={`Modifier ${setting.name}`}
                          >
                            <PencilIcon className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Modifier</span>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Affichage du type de paramètre */}
                <div className="mt-3 flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                    {setting.category === 'general' ? 'Général' :
                     setting.category === 'notifications' ? 'Notification' :
                     setting.category === 'security' ? 'Sécurité' : 'Intégration'}
                  </span>
                  
                  {setting.type === 'password' && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded flex items-center">
                      <KeyIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                      Confidentiel
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {filteredSettings.length === 0 && (
          <Card className="p-12 text-center">
            <Cog6ToothIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun paramètre dans cette catégorie</h3>
            <p className="text-gray-600">
              Cette catégorie ne contient actuellement aucun paramètre configurable.
            </p>
          </Card>
        )}

        {/* Section d'aide */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <DocumentTextIcon className="h-6 w-6 text-blue-600 mt-1" aria-hidden="true" />
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">Aide et Documentation</h3>
              <p className="text-blue-700 mb-3">
                Besoin d'aide pour configurer vos paramètres ? Consultez notre documentation ou contactez le support.
              </p>
              <div className="flex space-x-3">
                <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                  <DocumentTextIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                  Documentation
                </Button>
                <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                  <UserIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                  Support Technique
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default SettingsPage;