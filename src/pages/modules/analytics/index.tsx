import React, { useState } from 'react';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
  DocumentChartBarIcon,
  ArrowPathIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Card, Button } from '@/design-system';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Données simulées pour les graphiques
  const salesData = [
    { name: 'Lun', ventes: 45000, commandes: 12, clients: 8 },
    { name: 'Mar', ventes: 52000, commandes: 18, clients: 14 },
    { name: 'Mer', ventes: 48000, commandes: 15, clients: 11 },
    { name: 'Jeu', ventes: 61000, commandes: 22, clients: 18 },
    { name: 'Ven', ventes: 75000, commandes: 28, clients: 22 },
    { name: 'Sam', ventes: 83000, commandes: 35, clients: 29 },
    { name: 'Dim', ventes: 67000, commandes: 25, clients: 19 }
  ];

  const productCategories = [
    { name: 'Analgésiques', value: 35, color: '#3B82F6' },
    { name: 'Antibiotiques', value: 28, color: '#10B981' },
    { name: 'Vitamines', value: 20, color: '#F59E0B' },
    { name: 'Anti-inflammatoires', value: 12, color: '#EF4444' },
    { name: 'Autres', value: 5, color: '#6B7280' }
  ];

  const topProducts = [
    { name: 'Paracétamol 500mg', ventes: 1250, revenus: 1875000 },
    { name: 'Amoxicilline 250mg', ventes: 890, revenus: 1869000 },
    { name: 'Vitamine C', ventes: 674, revenus: 1685000 },
    { name: 'Ibuprofène 400mg', ventes: 445, revenus: 801000 },
    { name: 'Oméprazole 20mg', ventes: 321, revenus: 1027200 }
  ];

  const kpiData = [
    {
      title: 'Chiffre d\'Affaires',
      value: '2,456,000 FC',
      change: '+12.5%',
      trend: 'up',
      icon: CurrencyDollarIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Nombre de Ventes',
      value: '1,247',
      change: '+8.3%',
      trend: 'up',
      icon: ShoppingCartIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Clients Actifs',
      value: '342',
      change: '+5.7%',
      trend: 'up',
      icon: UserGroupIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Panier Moyen',
      value: '12,450 FC',
      change: '-2.1%',
      trend: 'down',
      icon: ChartBarIcon,
      color: 'bg-indigo-500'
    }
  ];

  const monthlyComparison = [
    { month: 'Jan', thisYear: 2200000, lastYear: 1950000 },
    { month: 'Fév', thisYear: 2450000, lastYear: 2100000 },
    { month: 'Mar', thisYear: 2680000, lastYear: 2300000 },
    { month: 'Avr', thisYear: 2890000, lastYear: 2550000 },
    { month: 'Mai', thisYear: 3100000, lastYear: 2800000 }
  ];

  const customerInsights = [
    {
      segment: 'Clients VIP',
      count: 45,
      revenue: 1200000,
      avgOrder: 26667,
      color: '#8B5CF6'
    },
    {
      segment: 'Clients Réguliers',
      count: 156,
      revenue: 890000,
      avgOrder: 5705,
      color: '#10B981'
    },
    {
      segment: 'Nouveaux Clients',
      count: 89,
      revenue: 234000,
      avgOrder: 2629,
      color: '#F59E0B'
    },
    {
      segment: 'Clients Occasionnels',
      count: 234,
      revenue: 132000,
      avgOrder: 564,
      color: '#6B7280'
    }
  ];

  const timeRanges = [
    { value: '7d', label: '7 derniers jours' },
    { value: '30d', label: '30 derniers jours' },
    { value: '90d', label: '3 derniers mois' },
    { value: '1y', label: '12 derniers mois' }
  ];

  return (
    <Layout title="Analyses et Rapports">
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analyses et Rapports</h1>
            <p className="text-gray-600">Tableaux de bord et analyses business intelligence</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
            <Button variant="outline">
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Actualiser
            </Button>
            <Button variant="primary">
              <PrinterIcon className="h-5 w-5 mr-2" />
              Exporter Rapport
            </Button>
          </div>
        </div>

        {/* KPIs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    {kpi.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div className={`${kpi.color} p-3 rounded-lg`}>
                  <kpi.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Évolution des ventes */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Évolution des Ventes</h3>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={selectedMetric === 'revenue' ? 'primary' : 'outline'}
                  onClick={() => setSelectedMetric('revenue')}
                >
                  Revenus
                </Button>
                <Button
                  size="sm"
                  variant={selectedMetric === 'orders' ? 'primary' : 'outline'}
                  onClick={() => setSelectedMetric('orders')}
                >
                  Commandes
                </Button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey={selectedMetric === 'revenue' ? 'ventes' : 'commandes'}
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Répartition par catégories */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Ventes par Catégorie</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {productCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {productCategories.map((category, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {category.name} ({category.value}%)
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Comparaison mensuelle */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Comparaison Année en Cours vs Année Précédente</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${parseInt(value).toLocaleString()} FC`, '']}
                />
                <Bar dataKey="thisYear" fill="#3B82F6" name="2025" />
                <Bar dataKey="lastYear" fill="#E5E7EB" name="2024" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Analyses détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top produits */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Produits</h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-indigo-600 text-white rounded-full text-sm flex items-center justify-center mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-600">{product.ventes} unités vendues</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {product.revenus.toLocaleString()} FC
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Segments clients */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Analyse des Segments Clients</h3>
            <div className="space-y-4">
              {customerInsights.map((segment, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">{segment.segment}</h4>
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Clients</p>
                      <p className="font-medium">{segment.count}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Revenus</p>
                      <p className="font-medium">{segment.revenue.toLocaleString()} FC</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Panier moyen</p>
                      <p className="font-medium">{segment.avgOrder.toLocaleString()} FC</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Rapports rapides */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Rapports Rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex flex-col items-center p-6 h-auto">
              <DocumentChartBarIcon className="h-8 w-8 text-gray-600 mb-2" />
              <span className="font-medium">Rapport de Ventes</span>
              <span className="text-sm text-gray-600">Détails des transactions</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-6 h-auto">
              <ChartBarIcon className="h-8 w-8 text-gray-600 mb-2" />
              <span className="font-medium">Analyse de Stock</span>
              <span className="text-sm text-gray-600">Mouvements d'inventaire</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-6 h-auto">
              <UserGroupIcon className="h-8 w-8 text-gray-600 mb-2" />
              <span className="font-medium">Rapport Clients</span>
              <span className="text-sm text-gray-600">Analyse comportementale</span>
            </Button>
          </div>
        </Card>

        {/* Métriques de performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Taux de Conversion</h4>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-green-600">85.4%</span>
              <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mt-2">+3.2% vs mois dernier</p>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Temps Moyen de Service</h4>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-blue-600">4.2min</span>
              <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mt-2">-0.8min vs mois dernier</p>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Satisfaction Client</h4>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-purple-600">4.7/5</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ⭐
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">+0.3 vs mois dernier</p>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;