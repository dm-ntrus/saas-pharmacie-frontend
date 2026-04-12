import React, { useState } from 'react';
import { 
  CubeIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  ArchiveBoxIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';
import { Card, Button } from '@/design-system';

const TechnicianDashboard: React.FC = () => {
  const [inventory] = useState([
    {
      id: 1,
      name: 'Paracétamol 500mg',
      stock: 245,
      minStock: 100,
      location: 'A-1-15',
      expiry: '2025-12-15',
      status: 'normal'
    },
    {
      id: 2,
      name: 'Amoxicilline 250mg',
      stock: 25,
      minStock: 50,
      location: 'B-2-08',
      expiry: '2025-08-20',
      status: 'low'
    },
    {
      id: 3,
      name: 'Ibuprofène 400mg',
      stock: 5,
      minStock: 30,
      location: 'A-3-22',
      expiry: '2025-06-10',
      status: 'critical'
    }
  ]);

  const [deliveries] = useState([
    {
      id: 1,
      supplier: 'Pharma Distribution RDC',
      items: 15,
      expectedDate: '2025-01-22',
      status: 'pending'
    },
    {
      id: 2,
      supplier: 'MedImport Congo',
      items: 8,
      expectedDate: '2025-01-21',
      status: 'received'
    }
  ]);

  const stats = [
    {
      title: 'Produits en Stock',
      value: '1,245',
      detail: '22 catégories',
      icon: CubeIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Stock Faible',
      value: '8',
      detail: 'nécessitent commande',
      icon: ExclamationTriangleIcon,
      color: 'bg-orange-500'
    },
    {
      title: 'Livraisons en Attente',
      value: '3',
      detail: 'cette semaine',
      icon: TruckIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Contrôles Qualité',
      value: '12',
      detail: 'ce mois',
      icon: CheckCircleIcon,
      color: 'bg-green-500'
    }
  ];

  const getStockStatus = (item: typeof inventory[0]) => {
    const percentage = (item.stock / item.minStock) * 100;
    if (percentage < 25) return { color: 'bg-red-100 text-red-800', text: 'Critique' };
    if (percentage < 50) return { color: 'bg-orange-100 text-orange-800', text: 'Faible' };
    return { color: 'bg-green-100 text-green-800', text: 'Normal' };
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90; // Expire dans les 3 mois
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Technicien</h1>
          <p className="text-gray-600">Gestion des stocks et logistique</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <QrCodeIcon className="h-5 w-5 mr-2" />
            Scanner Produit
          </Button>
          <Button variant="default">
            <CubeIcon className="h-5 w-5 mr-2" />
            Inventaire
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
                <p className="text-sm text-gray-500 mt-1">{stat.detail}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Gestion des stocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertes de stock */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes de Stock</h3>
          <div className="space-y-4">
            {inventory
              .filter(item => item.status !== 'normal')
              .map((item) => {
                const status = getStockStatus(item);
                const expiringSoon = isExpiringSoon(item.expiry);
                
                return (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          Emplacement: {item.location}
                        </p>
                        <p className="text-sm text-gray-600">
                          Stock: {item.stock} / Min: {item.minStock}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          {status.text}
                        </span>
                        {expiringSoon && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Expire bientôt
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-xs text-gray-500">
                        Expiration: {new Date(item.expiry).toLocaleDateString('fr-FR')}
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Commander
                        </Button>
                        <Button size="sm" variant="primary">
                          Réapprovisionner
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>

        {/* Livraisons */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Livraisons</h3>
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div key={delivery.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{delivery.supplier}</h4>
                    <p className="text-sm text-gray-600">
                      {delivery.items} articles
                    </p>
                    <p className="text-sm text-gray-600">
                      Prévue le: {new Date(delivery.expectedDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    delivery.status === 'received' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {delivery.status === 'received' ? 'Reçue' : 'En attente'}
                  </span>
                </div>
                
                <div className="flex space-x-2 mt-3">
                  {delivery.status === 'pending' ? (
                    <>
                      <Button size="sm" variant="primary">
                        Réceptionner
                      </Button>
                      <Button size="sm" variant="outline">
                        Reporter
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline">
                      Voir Détails
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full">
              <TruckIcon className="h-5 w-5 mr-2" />
              Planifier Livraison
            </Button>
          </div>
        </Card>
      </div>

      {/* Outils et actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <ArchiveBoxIcon className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Inventaire</h3>
              <p className="text-sm text-gray-600">Gestion complète du stock</p>
            </div>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Comptage physique
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Ajustements stock
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Rapport d&apos;inventaire
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <WrenchScrewdriverIcon className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Maintenance</h3>
              <p className="text-sm text-gray-600">Équipements et installations</p>
            </div>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Planifier maintenance
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Calibrage équipements
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Historique interventions
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <ClipboardDocumentListIcon className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Qualité</h3>
              <p className="text-sm text-gray-600">Contrôles et conformité</p>
            </div>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Contrôle qualité
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Vérification expiration
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Audit conformité
            </Button>
          </div>
        </Card>
      </div>

      {/* Tableau de bord d&apos;activité */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activités Récentes</h3>
        <div className="space-y-3">
          {[
            {
              action: 'Réception livraison',
              details: '150 unités de Paracétamol 500mg',
              time: 'Il y a 2h',
              type: 'success'
            },
            {
              action: 'Alerte stock faible',
              details: 'Amoxicilline 250mg - Stock critique',
              time: 'Il y a 4h',
              type: 'warning'
            },
            {
              action: 'Contrôle qualité',
              details: 'Vérification lot #LOT2025001',
              time: 'Il y a 6h',
              type: 'info'
            },
            {
              action: 'Ajustement stock',
              details: 'Correction inventaire - Vitamine C',
              time: 'Il y a 1 jour',
              type: 'info'
            }
          ].map((activity, index) => (
            <div key={index} className="flex items-center p-3 rounded-lg border border-gray-200">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-orange-500' :
                'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.details}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TechnicianDashboard;