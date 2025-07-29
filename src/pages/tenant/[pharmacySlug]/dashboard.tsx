import React, { useState, useEffect } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  HomeIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  UsersIcon,
  DocumentTextIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  MagnifyingGlassIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface DashboardProps {
  pharmacySlug: string;
  user: any;
}

const TenantDashboard: NextPage<DashboardProps> = ({ pharmacySlug, user }) => {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState('accueil');
  
  const modules = [
    { 
      id: 'accueil', 
      name: 'Accueil', 
      icon: HomeIcon, 
      description: 'Vue d\'ensemble des activités' 
    },
    { 
      id: 'ventes', 
      name: 'Point de Vente', 
      icon: ShoppingCartIcon, 
      description: 'Gestion des ventes et caisse' 
    },
    { 
      id: 'clients', 
      name: 'Clients', 
      icon: UsersIcon, 
      description: 'Gestion de la clientèle' 
    },
    { 
      id: 'inventaire', 
      name: 'Inventaire', 
      icon: DocumentTextIcon, 
      description: 'Gestion des stocks' 
    },
    { 
      id: 'rapports', 
      name: 'Rapports', 
      icon: ChartBarIcon, 
      description: 'Analytics et statistiques' 
    },
    { 
      id: 'parametres', 
      name: 'Paramètres', 
      icon: CogIcon, 
      description: 'Configuration système' 
    }
  ];

  const stats = [
    {
      title: 'Ventes du jour',
      value: '1,247 FC',
      change: '+12%',
      color: 'text-green-600'
    },
    {
      title: 'Commandes',
      value: '23',
      change: '+5%',
      color: 'text-blue-600'
    },
    {
      title: 'Clients actifs',
      value: '156',
      change: '+8%',
      color: 'text-purple-600'
    },
    {
      title: 'Stock critique',
      value: '12',
      change: '-3%',
      color: 'text-red-600'
    }
  ];

  const recentActivities = [
    {
      type: 'vente',
      description: 'Vente de Paracétamol 500mg - Client: Marie Kabila',
      time: '10:30',
      amount: '2,500 FC'
    },
    {
      type: 'stock',
      description: 'Réception stock - Aspirine 100mg (50 boîtes)',
      time: '09:15',
      amount: null
    },
    {
      type: 'client',
      description: 'Nouveau client enregistré - Jean Mukendi',
      time: '08:45',
      amount: null
    }
  ];

  return (
    <>
      <Head>
        <title>Tableau de Bord - {pharmacySlug}</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                  {pharmacySlug} - Tableau de Bord
                </h1>
                <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                  En ligne
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <button className="relative p-2 text-gray-400 hover:text-gray-500">
                  <BellIcon className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                </button>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Dr. Jean Mukasa</p>
                    <p className="text-xs text-gray-500">Pharmacien Responsable</p>
                  </div>
                  <img
                    className="h-8 w-8 rounded-full bg-gray-300"
                    src="https://via.placeholder.com/32"
                    alt="Avatar"
                  />
                </div>
                
                <button className="text-gray-400 hover:text-gray-500">
                  <ArrowRightOnRectangleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <nav className="w-64 bg-white shadow-sm min-h-screen">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Modules</h2>
              <ul className="space-y-2">
                {modules.map((module) => {
                  const IconComponent = module.icon;
                  return (
                    <li key={module.id}>
                      <button
                        onClick={() => setActiveModule(module.id)}
                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                          activeModule === module.id
                            ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent className="h-5 w-5 mr-3" />
                        <div>
                          <p className="font-medium">{module.name}</p>
                          <p className="text-xs text-gray-500">{module.description}</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {activeModule === 'accueil' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Accueil</h2>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nouvelle Vente
                  </button>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                        </div>
                        <span className={`text-sm font-medium ${stat.color}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Activités récentes */}
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Activités Récentes</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${
                              activity.type === 'vente' ? 'bg-green-400' :
                              activity.type === 'stock' ? 'bg-blue-400' : 'bg-purple-400'
                            }`}></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                          </div>
                          {activity.amount && (
                            <span className="text-sm font-medium text-green-600">{activity.amount}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModule === 'ventes' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Point de Vente</h2>
                <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                  <ShoppingCartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Module Point de Vente</h3>
                  <p className="text-gray-600 mb-6">Interface de caisse et gestion des ventes</p>
                  <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    Ouvrir la Caisse
                  </button>
                </div>
              </div>
            )}

            {activeModule === 'clients' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Gestion des Clients</h2>
                <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                  <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Base de Données Clients</h3>
                  <p className="text-gray-600 mb-6">Gestion complète de votre clientèle</p>
                  <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    Voir les Clients
                  </button>
                </div>
              </div>
            )}

            {activeModule === 'inventaire' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Gestion d'Inventaire</h2>
                <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                  <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Inventaire & Stocks</h3>
                  <p className="text-gray-600 mb-6">Suivi en temps réel de vos stocks</p>
                  <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    Gérer l'Inventaire
                  </button>
                </div>
              </div>
            )}

            {activeModule === 'rapports' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Rapports & Analytics</h2>
                <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                  <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Tableaux de Bord</h3>
                  <p className="text-gray-600 mb-6">Analytics avancés et rapports détaillés</p>
                  <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    Voir les Rapports
                  </button>
                </div>
              </div>
            )}

            {activeModule === 'parametres' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Paramètres Système</h2>
                <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                  <CogIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Configuration</h3>
                  <p className="text-gray-600 mb-6">Paramètres de la pharmacie et du système</p>
                  <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    Configurer
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pharmacySlug } = context.params!;
  
  // Simulation de vérification d'authentification
  // En production, vérifier le token JWT et les permissions
  
  return {
    props: {
      pharmacySlug,
      user: {
        id: 1,
        name: 'Dr. Jean Mukasa',
        role: 'pharmacist',
        pharmacy: pharmacySlug
      }
    }
  };
};

export default TenantDashboard;