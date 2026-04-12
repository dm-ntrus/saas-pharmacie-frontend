import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Package,
  Truck,
  AlertTriangle,
  ClipboardList,
  CheckCircle,
  Wrench,
  Archive,
  QrCode,
} from 'lucide-react';
import { Card, Button } from '@/design-system';

const TechnicianDashboard: React.FC = () => {
  const t = useTranslations('dashboardTechnician');
  const locale = useLocale();
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
      title: t('stats.productsInStock'),
      value: '1,245',
      detail: t('stats.productsInStockDetail'),
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: t('stats.lowStock'),
      value: '8',
      detail: t('stats.lowStockDetail'),
      icon: AlertTriangle,
      color: 'bg-orange-500'
    },
    {
      title: t('stats.pendingDeliveries'),
      value: '3',
      detail: t('stats.pendingDeliveriesDetail'),
      icon: Truck,
      color: 'bg-cyan-500'
    },
    {
      title: t('stats.qualityChecks'),
      value: '12',
      detail: t('stats.qualityChecksDetail'),
      icon: CheckCircle,
      color: 'bg-green-500'
    }
  ];

  const getStockStatus = (item: typeof inventory[0]) => {
    const percentage = (item.stock / item.minStock) * 100;
    if (percentage < 25) return { color: 'bg-red-100 text-red-800', text: t('severity.critical') };
    if (percentage < 50) return { color: 'bg-orange-100 text-orange-800', text: t('severity.low') };
    return { color: 'bg-green-100 text-green-800', text: t('severity.normal') };
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90; // Expire dans les 3 mois
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('header.title')}</h1>
          <p className="text-gray-600">{t('header.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button variant="outline">
            <QrCode className="h-5 w-5 mr-2" />
            {t('header.scanProduct')}
          </Button>
          <Button variant="default">
            <Package className="h-5 w-5 mr-2" />
            {t('header.inventory')}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('sections.stockAlerts')}</h3>
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
                          {t('location')}: {item.location}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t('stock')}: {item.stock} / {t('min')}: {item.minStock}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          {status.text}
                        </span>
                        {expiringSoon && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            {t('expiresSoon')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-xs text-gray-500">
                        {t('expiration')}: {new Date(item.expiry).toLocaleDateString(locale)}
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          {t('actions.order')}
                        </Button>
                        <Button size="sm" variant="primary">
                          {t('actions.restock')}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('sections.deliveries')}</h3>
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div key={delivery.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{delivery.supplier}</h4>
                    <p className="text-sm text-gray-600">
                      {t('itemsCount', { count: delivery.items })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t('expectedOn')}: {new Date(delivery.expectedDate).toLocaleDateString(locale)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    delivery.status === 'received' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {delivery.status === 'received' ? t('status.received') : t('status.pending')}
                  </span>
                </div>
                
                <div className="flex space-x-2 mt-3">
                  {delivery.status === 'pending' ? (
                    <>
                      <Button size="sm" variant="primary">
                        {t('actions.receive')}
                      </Button>
                      <Button size="sm" variant="outline">
                        {t('actions.reschedule')}
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline">
                      {t('actions.viewDetails')}
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full">
              <Truck className="h-5 w-5 mr-2" />
              {t('actions.scheduleDelivery')}
            </Button>
          </div>
        </Card>
      </div>

      {/* Outils et actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Archive className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t('tools.inventoryTitle')}</h3>
              <p className="text-sm text-gray-600">{t('tools.inventoryDesc')}</p>
            </div>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              {t('tools.inventoryActions.a1')}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              {t('tools.inventoryActions.a2')}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              {t('tools.inventoryActions.a3')}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Wrench className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t('tools.maintenanceTitle')}</h3>
              <p className="text-sm text-gray-600">{t('tools.maintenanceDesc')}</p>
            </div>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              {t('tools.maintenanceActions.a1')}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              {t('tools.maintenanceActions.a2')}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              {t('tools.maintenanceActions.a3')}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <ClipboardList className="h-8 w-8 text-cyan-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t('tools.qualityTitle')}</h3>
              <p className="text-sm text-gray-600">{t('tools.qualityDesc')}</p>
            </div>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              {t('tools.qualityActions.a1')}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              {t('tools.qualityActions.a2')}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              {t('tools.qualityActions.a3')}
            </Button>
          </div>
        </Card>
      </div>

      {/* Tableau de bord d&apos;activité */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('sections.recentActivities')}</h3>
        <div className="space-y-3">
          {[
            {
              action: t('activity.a1.action'),
              details: t('activity.a1.details'),
              time: t('activity.a1.time'),
              type: 'success'
            },
            {
              action: t('activity.a2.action'),
              details: t('activity.a2.details'),
              time: t('activity.a2.time'),
              type: 'warning'
            },
            {
              action: t('activity.a3.action'),
              details: t('activity.a3.details'),
              time: t('activity.a3.time'),
              type: 'info'
            },
            {
              action: t('activity.a4.action'),
              details: t('activity.a4.details'),
              time: t('activity.a4.time'),
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