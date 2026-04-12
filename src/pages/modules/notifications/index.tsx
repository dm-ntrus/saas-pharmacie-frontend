import React, { useState } from 'react';
import { 
  BellIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  Cog6ToothIcon,
  EyeIcon,
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Card, Button } from '@/design-system';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  relatedEntity?: {
    type: string;
    id: string;
    name: string;
  };
}

const NotificationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const notifications: Notification[] = [
    {
      id: '1',
      type: 'warning',
      title: 'Stock faible détecté',
      message: 'Le stock de Paracétamol 500mg est en dessous du seuil critique (5 unités restantes)',
      timestamp: '2025-01-21T10:30:00Z',
      read: false,
      category: 'Inventaire',
      priority: 'high',
      actionUrl: '/modules/inventory',
      relatedEntity: { type: 'product', id: 'PARA500', name: 'Paracétamol 500mg' }
    },
    {
      id: '2',
      type: 'error',
      title: 'Médicament expiré',
      message: 'Le lot LOT2024-089 d\'Amoxicilline 250mg a expiré aujourd\'hui',
      timestamp: '2025-01-21T08:00:00Z',
      read: false,
      category: 'Qualité',
      priority: 'high',
      actionUrl: '/modules/quality',
      relatedEntity: { type: 'batch', id: 'LOT2024-089', name: 'Amoxicilline 250mg' }
    },
    {
      id: '3',
      type: 'success',
      title: 'Commande livrée',
      message: 'La commande CMD-2025-045 du fournisseur Pharma Distribution a été réceptionnée',
      timestamp: '2025-01-21T07:15:00Z',
      read: true,
      category: 'Approvisionnement',
      priority: 'medium',
      actionUrl: '/modules/suppliers',
      relatedEntity: { type: 'order', id: 'CMD-2025-045', name: 'Commande Pharma Distribution' }
    },
    {
      id: '4',
      type: 'info',
      title: 'Rapport mensuel généré',
      message: 'Le rapport de ventes mensuel de janvier 2025 est maintenant disponible',
      timestamp: '2025-01-21T06:00:00Z',
      read: true,
      category: 'Rapports',
      priority: 'low',
      actionUrl: '/modules/reports'
    },
    {
      id: '5',
      type: 'warning',
      title: 'Contrôle qualité en retard',
      message: 'Le contrôle qualité du lot LOT2025-012 devait être effectué il y a 2 jours',
      timestamp: '2025-01-20T15:30:00Z',
      read: false,
      category: 'Qualité',
      priority: 'high',
      actionUrl: '/modules/quality',
      relatedEntity: { type: 'batch', id: 'LOT2025-012', name: 'Contrôle en retard' }
    },
    {
      id: '6',
      type: 'info',
      title: 'Nouveau client enregistré',
      message: 'Marie Kabongo s\'est inscrite au programme de fidélité',
      timestamp: '2025-01-20T14:20:00Z',
      read: true,
      category: 'Clients',
      priority: 'low',
      actionUrl: '/modules/customers',
      relatedEntity: { type: 'customer', id: 'CUST-2025-156', name: 'Marie Kabongo' }
    }
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'read' && notification.read) ||
                         (statusFilter === 'unread' && !notification.read);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info': return InformationCircleIcon;
      case 'warning': return ExclamationTriangleIcon;
      case 'error': return XCircleIcon;
      case 'success': return CheckCircleIcon;
      default: return BellIcon;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNotificationIconColor = (type: string) => {
    switch (type) {
      case 'info': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'success': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const stats = [
    {
      title: 'Total Notifications',
      value: notifications.length.toString(),
      icon: BellIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Non Lues',
      value: notifications.filter(n => !n.read).length.toString(),
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500'
    },
    {
      title: 'Priorité Élevée',
      value: notifications.filter(n => n.priority === 'high').length.toString(),
      icon: XCircleIcon,
      color: 'bg-red-600'
    },
    {
      title: 'Aujourd\'hui',
      value: notifications.filter(n => 
        new Date(n.timestamp).toDateString() === new Date().toDateString()
      ).length.toString(),
      icon: ClockIcon,
      color: 'bg-green-500'
    }
  ];

  const notificationTypes = ['all', 'info', 'warning', 'error', 'success'];
  const statusTypes = ['all', 'read', 'unread'];

  const markAsRead = (id: string) => {
    // Implémentation pour marquer comme lu
    console.log('Marquer comme lu:', id);
  };

  const deleteNotification = (id: string) => {
    // Implémentation pour supprimer
    console.log('Supprimer notification:', id);
  };

  return (
    <Layout title="Notifications">
      <div className="p-6 space-y-6">
        {/* En-tête avec accessibilité */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Centre de Notifications</h1>
            <p className="text-gray-600">Alertes et informations importantes du système</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0" role="group" aria-label="Actions notifications">
            <Button variant="outline" aria-label="Marquer toutes comme lues">
              <CheckCircleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Tout marquer lu
            </Button>
            <Button variant="outline" aria-label="Configurer les notifications">
              <Cog6ToothIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Paramètres
            </Button>
          </div>
        </header>

        {/* Statistiques avec accessibilité améliorée */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="region" aria-label="Statistiques des notifications">
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

        {/* Filtres accessibles */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <label htmlFor="search-notifications" className="sr-only">Rechercher dans les notifications</label>
              <MagnifyingGlassIcon 
                className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                aria-hidden="true"
              />
              <input
                id="search-notifications"
                type="text"
                placeholder="Rechercher une notification..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="type-filter" className="sr-only">Filtrer par type</label>
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {notificationTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'Tous les types' : 
                     type === 'info' ? 'Information' :
                     type === 'warning' ? 'Avertissement' :
                     type === 'error' ? 'Erreur' : 'Succès'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status-filter" className="sr-only">Filtrer par statut</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {statusTypes.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'Tous' :
                     status === 'read' ? 'Lues' : 'Non lues'}
                  </option>
                ))}
              </select>
            </div>

            <Button variant="outline">
              Effacer tout
            </Button>
          </div>
        </Card>

        {/* Liste des notifications avec structure accessible */}
        <div className="space-y-4" role="region" aria-label="Liste des notifications">
          {filteredNotifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.type);
            
            return (
              <Card 
                key={notification.id} 
                className={`p-6 hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-indigo-500 ${
                  !notification.read ? 'border-l-4 border-l-indigo-500' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Indicateur de priorité */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} 
                         aria-label={`Priorité ${notification.priority}`}
                    />
                    <IconComponent className={`h-6 w-6 ${getNotificationIconColor(notification.type)}`} 
                                   aria-hidden="true" 
                    />
                  </div>

                  {/* Contenu de la notification */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {notification.title}
                        {!notification.read && (
                          <span className="sr-only"> (non lu)</span>
                        )}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getNotificationColor(notification.type)}`}>
                          {notification.type === 'info' ? 'Info' :
                           notification.type === 'warning' ? 'Alerte' :
                           notification.type === 'error' ? 'Erreur' : 'Succès'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {notification.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{notification.message}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                        <time dateTime={notification.timestamp}>
                          {new Date(notification.timestamp).toLocaleString('fr-FR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </time>
                      </div>

                      <div className="flex space-x-2" role="group" aria-label={`Actions pour ${notification.title}`}>
                        {notification.actionUrl && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            aria-label={`Voir les détails de ${notification.title}`}
                          >
                            <EyeIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                            Voir
                          </Button>
                        )}
                        
                        {!notification.read && (
                          <Button 
                            size="sm" 
                            variant="primary"
                            onClick={() => markAsRead(notification.id)}
                            aria-label={`Marquer comme lu ${notification.title}`}
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                            Marquer lu
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteNotification(notification.id)}
                          aria-label={`Supprimer la notification ${notification.title}`}
                        >
                          <TrashIcon className="h-4 w-4" aria-hidden="true" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                    </div>

                    {/* Entité liée */}
                    {notification.relatedEntity && (
                      <div className="mt-3 p-2 bg-gray-50 rounded border-l-2 border-gray-300">
                        <div className="flex items-center text-sm text-gray-600">
                          <UserIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                          <span>
                            {notification.relatedEntity.type === 'product' ? 'Produit' :
                             notification.relatedEntity.type === 'customer' ? 'Client' :
                             notification.relatedEntity.type === 'order' ? 'Commande' :
                             notification.relatedEntity.type === 'batch' ? 'Lot' : 'Élément'}
                            : {notification.relatedEntity.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredNotifications.length === 0 && (
          <Card className="p-12 text-center">
            <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification trouvée</h3>
            <p className="text-gray-600">
              Aucune notification ne correspond à vos critères de recherche.
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default NotificationsPage;