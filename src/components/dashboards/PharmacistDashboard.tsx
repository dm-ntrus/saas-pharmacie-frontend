import React, { useState } from 'react';
import { useLocale, useTranslations } from '@/lib/i18n-simple';
import {
  FlaskConical,
  ClipboardList,
  AlertTriangle,
  Users,
  CheckCircle,
} from 'lucide-react';
import { Card, Button } from '@/design-system';

const PharmacistDashboard: React.FC = () => {
  const t = useTranslations('dashboardPharmacist');
  const locale = useLocale();
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientName: 'Jean Mukasa',
      doctorName: 'Dr. Marie Kabila',
      status: 'pending',
      items: 3,
      priority: 'normal',
      createdAt: '2025-01-21T10:30:00Z'
    },
    {
      id: 2,
      patientName: 'Grace Mbuyi',
      doctorName: 'Dr. Paul Tshikala',
      status: 'in_progress',
      items: 2,
      priority: 'urgent',
      createdAt: '2025-01-21T09:15:00Z'
    },
    {
      id: 3,
      patientName: 'Pierre Kasongo',
      doctorName: 'Dr. Sarah Lukonga',
      status: 'ready',
      items: 5,
      priority: 'normal',
      createdAt: '2025-01-21T08:45:00Z'
    }
  ]);

  const [inventoryAlerts] = useState([
    { medication: 'Paracétamol 500mg', stock: 15, minStock: 50, severity: 'high' },
    { medication: 'Amoxicilline 250mg', stock: 8, minStock: 30, severity: 'critical' },
    { medication: 'Ibuprofène 400mg', stock: 25, minStock: 40, severity: 'medium' }
  ]);

  const stats = [
    {
      title: t('stats.pending'),
      value: prescriptions.filter(p => p.status === 'pending').length,
      icon: ClipboardList,
      color: 'bg-yellow-500'
    },
    {
      title: t('stats.inProgress'),
      value: prescriptions.filter(p => p.status === 'in_progress').length,
      icon: FlaskConical,
      color: 'bg-blue-500'
    },
    {
      title: t('stats.ready'),
      value: prescriptions.filter(p => p.status === 'ready').length,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: t('stats.stockAlerts'),
      value: inventoryAlerts.length,
      icon: AlertTriangle,
      color: 'bg-red-500'
    }
  ];

  const handlePrescriptionAction = (id: number, action: string) => {
    setPrescriptions(prev => 
      prev.map(p => {
        if (p.id === id) {
          switch (action) {
            case 'start':
              return { ...p, status: 'in_progress' };
            case 'complete':
              return { ...p, status: 'ready' };
            case 'deliver':
              return { ...p, status: 'delivered' };
            default:
              return p;
          }
        }
        return p;
      })
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: t('status.pending') },
      in_progress: { color: 'bg-blue-100 text-blue-800', text: t('status.inProgress') },
      ready: { color: 'bg-green-100 text-green-800', text: t('status.ready') },
      delivered: { color: 'bg-gray-100 text-gray-800', text: t('status.delivered') }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      urgent: { color: 'bg-red-100 text-red-800', text: t('priority.urgent') },
      normal: { color: 'bg-gray-100 text-gray-800', text: t('priority.normal') },
      low: { color: 'bg-blue-100 text-blue-800', text: t('priority.low') }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.normal;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('header.title')}</h1>
          <p className="text-gray-600">{t('header.subtitle')}</p>
        </div>
        <Button variant="default">
          <FlaskConical className="h-5 w-5 mr-2" />
          {t('header.newPreparation')}
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Ordonnances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('sections.prescriptions')}</h3>
          <div className="space-y-4">
            {prescriptions
              .filter(p => p.status !== 'delivered')
              .map((prescription) => (
              <div key={prescription.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{prescription.patientName}</h4>
                    <p className="text-sm text-gray-600">{t('byDoctor')} {prescription.doctorName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('medicationCount', { count: prescription.items })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(prescription.status)}
                    {getPriorityBadge(prescription.priority)}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    {new Date(prescription.createdAt).toLocaleString(locale)}
                  </p>
                  <div className="flex space-x-2">
                    {prescription.status === 'pending' && (
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => handlePrescriptionAction(prescription.id, 'start')}
                      >
                        {t('actions.start')}
                      </Button>
                    )}
                    {prescription.status === 'in_progress' && (
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => handlePrescriptionAction(prescription.id, 'complete')}
                      >
                        {t('actions.complete')}
                      </Button>
                    )}
                    {prescription.status === 'ready' && (
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => handlePrescriptionAction(prescription.id, 'deliver')}
                      >
                        {t('actions.deliver')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Alertes de stock */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('sections.stockAlerts')}</h3>
          <div className="space-y-4">
            {inventoryAlerts.map((alert, index) => (
              <div 
                key={index} 
                className={`border-l-4 p-4 rounded-lg ${
                  alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
                  alert.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                  'border-yellow-500 bg-yellow-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{alert.medication}</h4>
                    <p className="text-sm text-gray-600">
                      {t('stockCurrent', { count: alert.stock })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('stockMin', { count: alert.minStock })}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {alert.severity === 'critical' ? t('severity.critical') :
                     alert.severity === 'high' ? t('severity.high') : t('severity.medium')}
                  </span>
                </div>
                <div className="mt-3">
                  <Button size="sm" variant="outline">
                    {t('actions.orderNow')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Section de validation pharmaceutique */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('sections.validation')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ClipboardList className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-900">{t('validation.interactionsTitle')}</h4>
            </div>
            <p className="text-sm text-blue-700">
              {t('validation.interactionsDesc')}
            </p>
            <Button size="sm" variant="outline" className="mt-3 border-blue-300 text-blue-700">
              {t('validation.interactionsBtn')}
            </Button>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="font-medium text-green-900">{t('validation.qualityTitle')}</h4>
            </div>
            <p className="text-sm text-green-700">
              {t('validation.qualityDesc')}
            </p>
            <Button size="sm" variant="outline" className="mt-3 border-green-300 text-green-700">
              {t('validation.qualityBtn')}
            </Button>
          </div>
          
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-cyan-600 mr-2" />
              <h4 className="font-medium text-cyan-900">{t('validation.patientsTitle')}</h4>
            </div>
            <p className="text-sm text-cyan-700">
              {t('validation.patientsDesc')}
            </p>
            <Button size="sm" variant="outline" className="mt-3 border-cyan-300 text-cyan-700">
              {t('validation.patientsBtn')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PharmacistDashboard;