import React, { useState } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  SpeakerWaveIcon,
  MegaphoneIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Card, Button } from '@/design-system';

interface Message {
  id: string;
  type: 'sms' | 'email' | 'announcement' | 'reminder';
  recipient: string;
  subject: string;
  content: string;
  status: 'sent' | 'pending' | 'failed' | 'scheduled';
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  deliveryTime?: string;
}

interface Campaign {
  id: string;
  name: string;
  type: 'promotional' | 'health' | 'reminder' | 'emergency';
  targetAudience: string;
  startDate: string;
  status: 'draft' | 'active' | 'completed' | 'paused';
  messagesSent: number;
  openRate: number;
  clickRate: number;
}

const CommunicationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const messages: Message[] = [
    {
      id: '1',
      type: 'sms',
      recipient: 'Marie Kabongo (+243 99 123 4567)',
      subject: 'Rappel médicament',
      content: 'Bonjour Marie, il est temps de prendre votre traitement d\'hypertension. Pharmacie NakiCode.',
      status: 'sent',
      timestamp: '2025-01-21T10:30:00Z',
      priority: 'high',
      category: 'Santé',
      deliveryTime: '2025-01-21T10:31:00Z'
    },
    {
      id: '2',
      type: 'email',
      recipient: 'jean.mukasa@email.com',
      subject: 'Nouvelle promotion vitamine C',
      content: 'Découvrez notre offre spéciale sur les vitamines C. Jusqu\'à 20% de réduction.',
      status: 'sent',
      timestamp: '2025-01-21T08:15:00Z',
      priority: 'medium',
      category: 'Promotion',
      deliveryTime: '2025-01-21T08:16:00Z'
    },
    {
      id: '3',
      type: 'announcement',
      recipient: 'Tous les clients fidèles (156 personnes)',
      subject: 'Horaires exceptionnels',
      content: 'Nous serons fermés le 24 janvier pour inventaire. Réouverture le 25 janvier à 8h.',
      status: 'scheduled',
      timestamp: '2025-01-21T06:00:00Z',
      priority: 'medium',
      category: 'Information'
    },
    {
      id: '4',
      type: 'reminder',
      recipient: 'Paul Tshikala (+243 98 345 6789)',
      subject: 'Renouvellement ordonnance',
      content: 'Votre ordonnance pour le diabète expire dans 3 jours. Consultez votre médecin.',
      status: 'pending',
      timestamp: '2025-01-20T16:45:00Z',
      priority: 'high',
      category: 'Santé'
    }
  ];

  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Campagne Vaccination Grippe',
      type: 'health',
      targetAudience: 'Personnes âgées (65+)',
      startDate: '2025-01-15',
      status: 'active',
      messagesSent: 245,
      openRate: 78.5,
      clickRate: 12.3
    },
    {
      id: '2',
      name: 'Promotion Hiver',
      type: 'promotional',
      targetAudience: 'Tous les clients',
      startDate: '2025-01-10',
      status: 'completed',
      messagesSent: 1245,
      openRate: 65.2,
      clickRate: 8.7
    },
    {
      id: '3',
      name: 'Rappels Médicaments Chroniques',
      type: 'reminder',
      targetAudience: 'Patients chroniques',
      startDate: '2025-01-20',
      status: 'active',
      messagesSent: 89,
      openRate: 92.1,
      clickRate: 45.6
    }
  ];

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent': return 'Envoyé';
      case 'pending': return 'En attente';
      case 'failed': return 'Échec';
      case 'scheduled': return 'Programmé';
      default: return 'Inconnu';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sms': return PhoneIcon;
      case 'email': return EnvelopeIcon;
      case 'announcement': return MegaphoneIcon;
      case 'reminder': return CalendarDaysIcon;
      default: return ChatBubbleLeftRightIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sms': return 'text-green-600';
      case 'email': return 'text-blue-600';
      case 'announcement': return 'text-cyan-600';
      case 'reminder': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    {
      title: 'Messages Envoyés',
      value: messages.filter(m => m.status === 'sent').length.toString(),
      icon: PaperAirplaneIcon,
      color: 'bg-green-500'
    },
    {
      title: 'En Attente',
      value: messages.filter(m => m.status === 'pending').length.toString(),
      icon: CalendarDaysIcon,
      color: 'bg-yellow-500'
    },
    {
      title: 'Campagnes Actives',
      value: campaigns.filter(c => c.status === 'active').length.toString(),
      icon: MegaphoneIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Taux d\'Ouverture',
      value: '78.5%',
      icon: EyeIcon,
      color: 'bg-cyan-500'
    }
  ];

  const statusTypes = ['all', 'sent', 'pending', 'failed', 'scheduled'];

  return (
    <Layout title="Communication">
      <div className="p-6 space-y-6">
        {/* En-tête accessible */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Communication Client</h1>
            <p className="text-gray-600">Gestion des messages et campagnes marketing</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0" role="group" aria-label="Actions communication">
            <Button variant="outline" aria-label="Créer une nouvelle campagne">
              <MegaphoneIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Nouvelle Campagne
            </Button>
            <Button variant="primary" aria-label="Envoyer un message">
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Nouveau Message
            </Button>
          </div>
        </header>

        {/* Statistiques avec labels accessibles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="region" aria-label="Statistiques de communication">
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

        {/* Onglets avec navigation clavier */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" role="tablist">
            {[
              { id: 'messages', label: 'Messages', icon: ChatBubbleLeftRightIcon },
              { id: 'campaigns', label: 'Campagnes', icon: MegaphoneIcon },
              { id: 'templates', label: 'Modèles', icon: DocumentTextIcon }
            ].map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                  activeTab === tab.id
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" aria-hidden="true" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'messages' && (
          <div role="tabpanel" id="messages-panel">
            {/* Filtres accessibles */}
            <Card className="p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <label htmlFor="search-messages" className="sr-only">Rechercher dans les messages</label>
                  <MagnifyingGlassIcon 
                    className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                    aria-hidden="true"
                  />
                  <input
                    id="search-messages"
                    type="text"
                    placeholder="Rechercher un message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="status-filter" className="sr-only">Filtrer par statut</label>
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  >
                    {statusTypes.map(status => (
                      <option key={status} value={status}>
                        {status === 'all' ? 'Tous les statuts' : getStatusText(status)}
                      </option>
                    ))}
                  </select>
                </div>

                <Button variant="outline">
                  Analyser Performance
                </Button>
              </div>
            </Card>

            {/* Liste des messages avec structure accessible */}
            <div className="space-y-4" role="region" aria-label="Liste des messages">
              {filteredMessages.map((message) => {
                const TypeIcon = getTypeIcon(message.type);
                
                return (
                  <Card 
                    key={message.id} 
                    className="p-6 hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-sky-500"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <TypeIcon className={`h-6 w-6 ${getTypeColor(message.type)}`} aria-hidden="true" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {message.subject}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(message.status)}`}>
                              {getStatusText(message.status)}
                            </span>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              {message.type === 'sms' ? 'SMS' :
                               message.type === 'email' ? 'Email' :
                               message.type === 'announcement' ? 'Annonce' : 'Rappel'}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{message.recipient}</p>
                        <p className="text-gray-700 mb-3">{message.content}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <time dateTime={message.timestamp}>
                              Envoyé: {new Date(message.timestamp).toLocaleString('fr-FR')}
                            </time>
                            {message.deliveryTime && (
                              <time dateTime={message.deliveryTime}>
                                Livré: {new Date(message.deliveryTime).toLocaleString('fr-FR')}
                              </time>
                            )}
                          </div>

                          <div className="flex space-x-2" role="group" aria-label={`Actions pour ${message.subject}`}>
                            <Button 
                              size="sm" 
                              variant="outline"
                              aria-label={`Voir les détails du message ${message.subject}`}
                            >
                              <EyeIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                              Détails
                            </Button>
                            
                            {message.status === 'failed' && (
                              <Button 
                                size="sm" 
                                variant="primary"
                                aria-label={`Renvoyer le message ${message.subject}`}
                              >
                                <PaperAirplaneIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                                Renvoyer
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div role="tabpanel" id="campaigns-panel">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="p-6 hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-sky-500">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                      <p className="text-sm text-gray-600">Cible: {campaign.targetAudience}</p>
                      <div className="flex items-center mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCampaignStatusColor(campaign.status)}`}>
                          {campaign.status === 'active' ? 'Active' :
                           campaign.status === 'completed' ? 'Terminée' :
                           campaign.status === 'paused' ? 'Suspendue' : 'Brouillon'}
                        </span>
                        <span className="px-2 py-1 ml-2 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {campaign.type === 'promotional' ? 'Promotion' :
                           campaign.type === 'health' ? 'Santé' :
                           campaign.type === 'reminder' ? 'Rappel' : 'Urgence'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{campaign.messagesSent}</p>
                      <p className="text-xs text-gray-600">Messages</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{campaign.openRate}%</p>
                      <p className="text-xs text-gray-600">Ouverture</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{campaign.clickRate}%</p>
                      <p className="text-xs text-gray-600">Clic</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <time className="text-sm text-gray-500" dateTime={campaign.startDate}>
                      Démarré: {new Date(campaign.startDate).toLocaleDateString('fr-FR')}
                    </time>
                  </div>

                  <div className="flex space-x-2" role="group" aria-label={`Actions pour ${campaign.name}`}>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      aria-label={`Voir les détails de ${campaign.name}`}
                    >
                      <EyeIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                      Voir
                    </Button>
                    
                    {campaign.status === 'active' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        aria-label={`Suspendre ${campaign.name}`}
                      >
                        Suspendre
                      </Button>
                    )}
                    
                    {campaign.status === 'paused' && (
                      <Button 
                        size="sm" 
                        variant="primary" 
                        className="flex-1"
                        aria-label={`Reprendre ${campaign.name}`}
                      >
                        Reprendre
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div role="tabpanel" id="templates-panel">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Rappel de médicament', category: 'Santé', usage: 45 },
                { name: 'Promotion saisonnière', category: 'Marketing', usage: 32 },
                { name: 'Information service', category: 'Information', usage: 28 },
                { name: 'Urgence sanitaire', category: 'Urgence', usage: 5 },
                { name: 'Remerciement client', category: 'Relation client', usage: 67 },
                { name: 'Invitation événement', category: 'Événement', usage: 12 }
              ].map((template, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer focus:ring-2 focus:ring-sky-500">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.category}</p>
                    </div>
                    <DocumentTextIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Utilisé {template.usage} fois</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      aria-label={`Prévisualiser le modèle ${template.name}`}
                    >
                      <EyeIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                      Voir
                    </Button>
                    <Button 
                      size="sm" 
                      variant="primary" 
                      className="flex-1"
                      aria-label={`Utiliser le modèle ${template.name}`}
                    >
                      Utiliser
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Messages vides accessibles */}
        {filteredMessages.length === 0 && activeTab === 'messages' && (
          <Card className="p-12 text-center">
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message trouvé</h3>
            <p className="text-gray-600">
              Aucun message ne correspond à vos critères de recherche.
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default CommunicationPage;