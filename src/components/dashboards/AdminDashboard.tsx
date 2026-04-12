import React, { useState, useEffect } from 'react';
import { useTranslations } from '@/lib/i18n-simple';
import {
  BarChart3,
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Card } from '@/design-system';
// Import for API calls - implement as needed

interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockItems: number;
  expiredItems: number;
  pendingOrders: number;
  completedOrders: number;
}

const AdminDashboard: React.FC = () => {
  const t = useTranslations('dashboardAdmin');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulate API call with mock data
        const mockStats = {
          totalSales: 245,
          totalRevenue: 1250000,
          totalCustomers: 156,
          totalProducts: 1245,
          lowStockItems: 8,
          expiredItems: 2,
          pendingOrders: 5,
          completedOrders: 28
        };
        setStats(mockStats);
      } catch (error) {
        console.error(t('errors.loadStats'), error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-32 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const defaultStats: DashboardStats = {
    totalSales: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockItems: 0,
    expiredItems: 0,
    pendingOrders: 0,
    completedOrders: 0,
    ...stats
  };

  const statCards = [
    {
      title: t('stats.salesToday'),
      value: defaultStats.totalSales.toLocaleString(),
      icon: BarChart3,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: t('stats.revenue'),
      value: `${defaultStats.totalRevenue.toLocaleString()} FC`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: t('stats.activeCustomers'),
      value: defaultStats.totalCustomers.toLocaleString(),
      icon: Users,
      color: 'bg-cyan-500',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: t('stats.productsInStock'),
      value: defaultStats.totalProducts.toLocaleString(),
      icon: ShoppingCart,
      color: 'bg-emerald-500',
      change: '+3%',
      changeType: 'positive'
    },
    {
      title: t('stats.lowStock'),
      value: defaultStats.lowStockItems.toString(),
      icon: AlertTriangle,
      color: 'bg-orange-500',
      change: '-2',
      changeType: 'negative'
    },
    {
      title: t('stats.expiredProducts'),
      value: defaultStats.expiredItems.toString(),
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: '+1',
      changeType: 'negative'
    },
    {
      title: t('stats.pendingOrders'),
      value: defaultStats.pendingOrders.toString(),
      icon: Clock,
      color: 'bg-yellow-500',
      change: '+5',
      changeType: 'neutral'
    },
    {
      title: t('stats.completedOrders'),
      value: defaultStats.completedOrders.toString(),
      icon: CheckCircle,
      color: 'bg-emerald-500',
      change: '+24',
      changeType: 'positive'
    }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('header.title')}</h1>
          <p className="text-gray-600">{t('header.subtitle')}</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <select className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>{t('filters.today')}</option>
            <option>{t('filters.thisWeek')}</option>
            <option>{t('filters.thisMonth')}</option>
            <option>{t('filters.thisYear')}</option>
          </select>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp
                    className={`h-4 w-4 mr-1 ${
                      stat.changeType === 'positive' ? 'text-green-500' : 
                      stat.changeType === 'negative' ? 'text-red-500' : 'text-gray-500'
                    }`}
                  />
                  <span 
                    className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Graphiques et analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des ventes */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('sections.salesTrend')}</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">{t('sections.salesChartPlaceholder')}</p>
            </div>
          </div>
        </Card>

        {/* Top produits */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('sections.topProducts')}</h3>
          <div className="space-y-4">
            {[
              { name: 'Paracétamol 500mg', sales: 245, trend: '+12%' },
              { name: 'Amoxicilline 250mg', sales: 198, trend: '+8%' },
              { name: 'Ibuprofène 400mg', sales: 156, trend: '+15%' },
              { name: 'Oméprazole 20mg', sales: 134, trend: '+5%' },
              { name: 'Métformine 500mg', sales: 121, trend: '+3%' }
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{t('salesCount', { count: product.sales })}</p>
                </div>
                <span className="text-sm font-medium text-green-600">{product.trend}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Alertes et notifications */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('sections.importantAlerts')}</h3>
        <div className="space-y-3">
          {[
            {
              type: 'warning',
              message: t('alerts.a1.message'),
              time: t('alerts.a1.time')
            },
            {
              type: 'error',
              message: t('alerts.a2.message'),
              time: t('alerts.a2.time')
            },
            {
              type: 'success',
              message: t('alerts.a3.message'),
              time: t('alerts.a3.time')
            },
            {
              type: 'info',
              message: t('alerts.a4.message'),
              time: t('alerts.a4.time')
            }
          ].map((alert, index) => (
            <div 
              key={index} 
              className={`flex items-start p-4 rounded-lg ${
                alert.type === 'warning' ? 'bg-orange-50 border-l-4 border-orange-500' :
                alert.type === 'error' ? 'bg-red-50 border-l-4 border-red-500' :
                alert.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' :
                'bg-blue-50 border-l-4 border-blue-500'
              }`}
            >
              <div className="flex-1">
                <p className="text-sm text-gray-900">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;