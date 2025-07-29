import React, { useState } from 'react';
import { 
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  DocumentTextIcon,
  ChartPieIcon,
  BanknotesIcon,
  ReceiptRefundIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PrinterIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Card, Button } from '@/design-system';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  account: string;
  status: 'pending' | 'approved' | 'paid';
  reference?: string;
  attachments?: string[];
}

const AccountingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('this_month');

  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2025-01-21',
      description: 'Vente médicaments',
      type: 'income',
      category: 'Ventes',
      amount: 125000,
      account: 'Caisse Principale',
      status: 'paid',
      reference: 'FACT-2025-001'
    },
    {
      id: '2',
      date: '2025-01-20',
      description: 'Achat stocks fournisseur',
      type: 'expense',
      category: 'Achats',
      amount: 85000,
      account: 'Compte Bancaire',
      status: 'approved',
      reference: 'BC-2025-012'
    },
    {
      id: '3',
      date: '2025-01-19',
      description: 'Salaires personnel',
      type: 'expense',
      category: 'Personnel',
      amount: 450000,
      account: 'Compte Bancaire',
      status: 'paid',
      reference: 'SAL-2025-01'
    },
    {
      id: '4',
      date: '2025-01-18',
      description: 'Électricité pharmacie',
      type: 'expense',
      category: 'Charges',
      amount: 35000,
      account: 'Compte Bancaire',
      status: 'pending',
      reference: 'SNEL-2025-01'
    }
  ];

  const monthlyData = [
    { month: 'Sep', revenus: 2800000, depenses: 1950000, benefice: 850000 },
    { month: 'Oct', revenus: 3200000, depenses: 2100000, benefice: 1100000 },
    { month: 'Nov', revenus: 2950000, depenses: 2250000, benefice: 700000 },
    { month: 'Déc', revenus: 3800000, depenses: 2600000, benefice: 1200000 },
    { month: 'Jan', revenus: 3500000, depenses: 2400000, benefice: 1100000 }
  ];

  const expensesByCategory = [
    { name: 'Achats Médicaments', value: 45, amount: 1800000, color: '#3B82F6' },
    { name: 'Personnel', value: 25, amount: 1000000, color: '#10B981' },
    { name: 'Charges Fixes', value: 15, amount: 600000, color: '#F59E0B' },
    { name: 'Marketing', value: 8, amount: 320000, color: '#EF4444' },
    { name: 'Autres', value: 7, amount: 280000, color: '#6B7280' }
  ];

  const kpiData = [
    {
      title: 'Chiffre d\'Affaires',
      value: '3,500,000 FC',
      change: '+8.5%',
      trend: 'up',
      icon: CurrencyDollarIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Total Dépenses',
      value: '2,400,000 FC',
      change: '-3.2%',
      trend: 'down',
      icon: ReceiptRefundIcon,
      color: 'bg-red-500'
    },
    {
      title: 'Bénéfice Net',
      value: '1,100,000 FC',
      change: '+15.8%',
      trend: 'up',
      icon: ChartPieIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Marge Brute',
      value: '31.4%',
      change: '+2.1%',
      trend: 'up',
      icon: ArrowTrendingUpIcon,
      color: 'bg-purple-500'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Payé';
      case 'approved': return 'Approuvé';
      case 'pending': return 'En attente';
      default: return 'Inconnu';
    }
  };

  const stats = [
    {
      title: 'Transactions ce Mois',
      value: transactions.length.toString(),
      icon: DocumentTextIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'En Attente',
      value: transactions.filter(t => t.status === 'pending').length.toString(),
      icon: ExclamationTriangleIcon,
      color: 'bg-yellow-500'
    },
    {
      title: 'Approuvées',
      value: transactions.filter(t => t.status === 'approved').length.toString(),
      icon: CheckCircleIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Comptes Actifs',
      value: '5',
      icon: BanknotesIcon,
      color: 'bg-purple-500'
    }
  ];

  return (
    <Layout title="Comptabilité">
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Comptabilité</h1>
            <p className="text-gray-600">Gestion financière et comptable</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="this_month">Ce mois</option>
              <option value="last_month">Mois dernier</option>
              <option value="this_year">Cette année</option>
            </select>
            <Button variant="outline">
              <PrinterIcon className="h-5 w-5 mr-2" />
              Rapports
            </Button>
            <Button variant="primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Nouvelle Transaction
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

        {/* Onglets */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: ChartPieIcon },
              { id: 'transactions', label: 'Transactions', icon: DocumentTextIcon },
              { id: 'reports', label: 'Rapports', icon: PrinterIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Graphiques de tendance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution Mensuelle</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${parseInt(value).toLocaleString()} FC`, '']} />
                      <Line type="monotone" dataKey="revenus" stroke="#10B981" strokeWidth={3} name="Revenus" />
                      <Line type="monotone" dataKey="depenses" stroke="#EF4444" strokeWidth={3} name="Dépenses" />
                      <Line type="monotone" dataKey="benefice" stroke="#3B82F6" strokeWidth={3} name="Bénéfice" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des Dépenses</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensesByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        dataKey="value"
                      >
                        {expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 gap-2 mt-4">
                  {expensesByCategory.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm text-gray-900">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{category.amount.toLocaleString()} FC</span>
                        <span className="text-xs text-gray-600 ml-2">({category.value}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Comptes et soldes */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comptes et Soldes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Caisse Principale', balance: 850000, type: 'Liquide', color: 'bg-green-500' },
                  { name: 'Compte Bancaire Principal', balance: 2450000, type: 'Bancaire', color: 'bg-blue-500' },
                  { name: 'Compte Épargne', balance: 1200000, type: 'Épargne', color: 'bg-purple-500' },
                ].map((account, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{account.name}</h4>
                      <div className={`w-3 h-3 rounded-full ${account.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{account.balance.toLocaleString()} FC</p>
                    <p className="text-sm text-gray-600">{account.type}</p>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {activeTab === 'transactions' && (
          <>
            {/* Statistiques des transactions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Filtre et recherche */}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher une transaction..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full md:w-80 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <Button variant="outline">Filtrer</Button>
                  <Button variant="outline">Exporter</Button>
                </div>
              </div>
            </Card>

            {/* Liste des transactions */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Compte
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                            {transaction.reference && (
                              <div className="text-sm text-gray-500">Réf: {transaction.reference}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()} FC
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.account}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                            {getStatusText(transaction.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button size="sm" variant="outline">
                            <EyeIcon className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Bilan Comptable', description: 'État des actifs et passifs', icon: ChartPieIcon },
              { title: 'Compte de Résultat', description: 'Revenus et charges de la période', icon: DocumentTextIcon },
              { title: 'Tableau de Trésorerie', description: 'Flux de trésorerie détaillés', icon: BanknotesIcon },
              { title: 'Grand Livre', description: 'Historique de tous les comptes', icon: DocumentTextIcon },
              { title: 'Balance Générale', description: 'Soldes de tous les comptes', icon: ChartPieIcon },
              { title: 'Analyse Financière', description: 'Ratios et indicateurs clés', icon: ArrowTrendingUpIcon }
            ].map((report, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-500 p-3 rounded-lg mr-4">
                    <report.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-600">{report.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Consulter
                  </Button>
                  <Button size="sm" variant="primary" className="flex-1">
                    <PrinterIcon className="h-4 w-4 mr-1" />
                    Générer
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AccountingPage;