import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  ServerIcon,
  CloudIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  SignalIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  uptime: number;
  responseTime: number;
  lastIncident?: string;
}

interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  startTime: string;
  resolvedTime?: string;
  description: string;
  updates: Array<{
    time: string;
    message: string;
    status: string;
  }>;
}

const StatusPage: NextPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const overallStatus = {
    status: 'operational' as const,
    uptime: 99.97,
    message: 'Tous les systèmes fonctionnent normalement'
  };

  const services: ServiceStatus[] = [
    {
      name: 'API Principal',
      status: 'operational',
      uptime: 99.98,
      responseTime: 145,
      lastIncident: '2025-01-15'
    },
    {
      name: 'Interface Web',
      status: 'operational',
      uptime: 99.99,
      responseTime: 89,
    },
    {
      name: 'Base de Données',
      status: 'operational',
      uptime: 100,
      responseTime: 12,
    },
    {
      name: 'Système de Paiement',
      status: 'operational',
      uptime: 99.95,
      responseTime: 234,
      lastIncident: '2025-01-18'
    },
    {
      name: 'Mobile Money Gateway',
      status: 'degraded',
      uptime: 98.5,
      responseTime: 1250,
      lastIncident: '2025-01-21'
    },
    {
      name: 'Email & Notifications',
      status: 'operational',
      uptime: 99.9,
      responseTime: 456,
    },
    {
      name: 'Synchronisation Mobile',
      status: 'operational',
      uptime: 99.85,
      responseTime: 67,
    },
    {
      name: 'Sauvegarde & Backup',
      status: 'operational',
      uptime: 100,
      responseTime: 23,
    }
  ];

  const incidents: Incident[] = [
    {
      id: 'inc-2025-001',
      title: 'Ralentissement Mobile Money Gateway',
      status: 'monitoring',
      severity: 'minor',
      startTime: '2025-01-21T14:30:00Z',
      description: 'Délais de réponse élevés observés sur les transactions AirtelMoney et OrangeMoney.',
      updates: [
        {
          time: '2025-01-21T15:15:00Z',
          message: 'Investigation en cours avec nos partenaires Mobile Money.',
          status: 'investigating'
        },
        {
          time: '2025-01-21T15:45:00Z',
          message: 'Problème identifié côté opérateur. Mise en place d\'une solution de contournement.',
          status: 'identified'
        },
        {
          time: '2025-01-21T16:10:00Z',
          message: 'Amélioration constatée. Surveillance continue des performances.',
          status: 'monitoring'
        }
      ]
    },
    {
      id: 'inc-2025-002',
      title: 'Maintenance Planifiée - Mise à Jour Sécurité',
      status: 'resolved',
      severity: 'minor',
      startTime: '2025-01-18T02:00:00Z',
      resolvedTime: '2025-01-18T04:30:00Z',
      description: 'Maintenance planifiée pour appliquer les correctifs de sécurité critiques.',
      updates: [
        {
          time: '2025-01-18T02:00:00Z',
          message: 'Début de la maintenance planifiée.',
          status: 'maintenance'
        },
        {
          time: '2025-01-18T04:30:00Z',
          message: 'Maintenance terminée. Tous les services sont opérationnels.',
          status: 'resolved'
        }
      ]
    }
  ];

  const metrics = [
    {
      name: 'Disponibilité Globale',
      value: `${overallStatus.uptime}%`,
      icon: CheckCircleIcon,
      color: 'text-green-600 bg-green-100',
      trend: '+0.02%'
    },
    {
      name: 'Temps de Réponse Moyen',
      value: '127ms',
      icon: ClockIcon,
      color: 'text-blue-600 bg-blue-100',
      trend: '-15ms'
    },
    {
      name: 'Incidents Résolus (30j)',
      value: '3',
      icon: ShieldCheckIcon,
      color: 'text-cyan-600 bg-cyan-100',
      trend: '-2'
    },
    {
      name: 'MTTR Moyen',
      value: '1h 23min',
      icon: CpuChipIcon,
      color: 'text-orange-600 bg-orange-100',
      trend: '-45min'
    }
  ];

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'outage': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-blue-600 bg-blue-100';
    }
  };

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational': return CheckCircleIcon;
      case 'degraded': return ExclamationTriangleIcon;
      case 'outage': return XCircleIcon;
      case 'maintenance': return ClockIcon;
    }
  };

  const getStatusText = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational': return 'Opérationnel';
      case 'degraded': return 'Dégradé';
      case 'outage': return 'Panne';
      case 'maintenance': return 'Maintenance';
    }
  };

  const getSeverityColor = (severity: Incident['severity']) => {
    switch (severity) {
      case 'minor': return 'bg-yellow-100 text-yellow-800';
      case 'major': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
    }
  };

  const getSeverityText = (severity: Incident['severity']) => {
    switch (severity) {
      case 'minor': return 'Mineur';
      case 'major': return 'Majeur';
      case 'critical': return 'Critique';
    }
  };

  return (
    <>
      <Head>
        <title>Statut du Service - NakiCode PharmaSaaS</title>
        <meta name="description" content="Surveillance en temps réel de l'état des services NakiCode PharmaSaaS. Disponibilité, incidents et maintenance." />
        <meta name="keywords" content="statut, disponibilité, uptime, incidents, maintenance, monitoring" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="text-xl font-bold text-sky-600">
                NakiCode PharmaSaaS
              </Link>
              <div className="flex items-center space-x-6">
                <Link href="/" className="text-gray-600 hover:text-gray-900">Accueil</Link>
                <Link href="/support" className="text-gray-600 hover:text-gray-900">Support</Link>
                <Link href="/status" className="text-sky-600 font-medium">Statut</Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* En-tête de statut */}
          <div className="text-center mb-12">
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold mb-4 ${
              overallStatus.status === 'operational' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {overallStatus.status === 'operational' ? 
                <CheckCircleIcon className="h-6 w-6 mr-2" /> :
                <XCircleIcon className="h-6 w-6 mr-2" />
              }
              {overallStatus.message}
            </div>
            <p className="text-gray-600 mb-2">
              Dernière mise à jour : {currentTime.toLocaleString('fr-FR', { 
                timeZone: 'Africa/Kinshasa',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })} WAT
            </p>
            <p className="text-sm text-gray-500">
              Surveillance automatique toutes les 30 secondes depuis Kinshasa, Bujumbura et Johannesburg
            </p>
          </div>

          {/* Métriques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${metric.color}`}>
                    <metric.icon className="h-6 w-6" />
                  </div>
                  <span className={`text-sm font-medium ${
                    metric.trend.startsWith('+') ? 'text-green-600' :
                    metric.trend.startsWith('-') && metric.name.includes('Incidents') ? 'text-green-600' :
                    metric.trend.startsWith('-') ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {metric.trend}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.name}</div>
              </div>
            ))}
          </div>

          {/* État des services */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">État des Services</h2>
              <div className="flex space-x-2">
                {['1h', '24h', '7d', '30d'].map(period => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      selectedPeriod === period
                        ? 'bg-sky-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {services.map((service, index) => {
                const StatusIcon = getStatusIcon(service.status);
                return (
                  <div key={index} className={`p-6 ${index !== services.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${getStatusColor(service.status)}`}>
                          <StatusIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600">
                            {getStatusText(service.status)}
                            {service.lastIncident && (
                              <span className="ml-2">• Dernier incident: {service.lastIncident}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div>
                            <span className="block font-medium text-gray-900">{service.uptime}%</span>
                            <span>Disponibilité</span>
                          </div>
                          <div>
                            <span className="block font-medium text-gray-900">{service.responseTime}ms</span>
                            <span>Réponse</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Graphique de disponibilité simplifié */}
                    <div className="mt-4">
                      <div className="h-12 bg-gray-100 rounded-lg overflow-hidden">
                        <div className="h-full flex">
                          {Array.from({ length: 24 }, (_, i) => (
                            <div
                              key={i}
                              className={`flex-1 ${
                                service.status === 'outage' && i === 23 ? 'bg-red-500' :
                                service.status === 'degraded' && i >= 22 ? 'bg-yellow-500' :
                                'bg-green-500'
                              } ${i > 0 ? 'border-l border-white/20' : ''}`}
                              title={`${23 - i}h ago`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>24h ago</span>
                        <span>Maintenant</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Incidents récents */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Incidents et Maintenance</h2>
            
            {incidents.length > 0 ? (
              <div className="space-y-6">
                {incidents.map(incident => (
                  <div key={incident.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(incident.severity)}`}>
                            {getSeverityText(incident.severity)}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            incident.status === 'monitoring' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {incident.status === 'resolved' ? 'Résolu' :
                             incident.status === 'monitoring' ? 'Surveillance' :
                             incident.status === 'identified' ? 'Identifié' :
                             'Investigation'}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{incident.title}</h3>
                        <p className="text-gray-600 mb-4">{incident.description}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>Début: {new Date(incident.startTime).toLocaleString('fr-FR')}</div>
                        {incident.resolvedTime && (
                          <div>Résolu: {new Date(incident.resolvedTime).toLocaleString('fr-FR')}</div>
                        )}
                      </div>
                    </div>

                    {/* Timeline des mises à jour */}
                    <div className="border-l-2 border-gray-200 ml-4 pl-6">
                      {incident.updates.map((update, updateIndex) => (
                        <div key={updateIndex} className="mb-4 last:mb-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className={`w-3 h-3 rounded-full -ml-8 ${
                              update.status === 'resolved' ? 'bg-green-500' :
                              update.status === 'monitoring' ? 'bg-blue-500' :
                              update.status === 'identified' ? 'bg-yellow-500' :
                              'bg-gray-400'
                            }`}></div>
                            <span className="text-xs text-gray-500">
                              {new Date(update.time).toLocaleString('fr-FR')}
                            </span>
                          </div>
                          <p className="text-gray-700">{update.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun Incident Récent</h3>
                <p className="text-gray-600">Tous nos services fonctionnent parfaitement.</p>
              </div>
            )}
          </section>

          {/* Informations supplémentaires */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <GlobeAltIcon className="h-6 w-6 text-sky-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Infrastructure</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Kinshasa (Primaire):</strong> Centre de données principal</li>
                <li>• <strong>Johannesburg:</strong> Réplication et backup</li>
                <li>• <strong>Lagos:</strong> Cache et distribution</li>
                <li>• <strong>CDN Global:</strong> Cloudflare avec 30+ points de présence</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <SignalIcon className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">SLA Garantis</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Disponibilité:</strong> 99.9% (8h 45min/an maximum)</li>
                <li>• <strong>Temps de réponse API:</strong> &lt; 500ms (99e percentile)</li>
                <li>• <strong>RTO:</strong> &lt; 4h en cas d'incident majeur</li>
                <li>• <strong>RPO:</strong> &lt; 15 minutes de perte de données</li>
              </ul>
            </div>
          </section>

          {/* Footer de page */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500 mb-4">
              Questions sur le statut de nos services ?
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/support"
                className="bg-sky-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-sky-700 transition-colors"
              >
                Contacter le Support
              </Link>
              <Link 
                href="/api-docs"
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Documentation API
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusPage;