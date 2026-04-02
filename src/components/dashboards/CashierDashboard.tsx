import React, { useState } from 'react';
import {
  ShoppingCart,
  CreditCard,
  BadgePercent,
  DollarSign,
  User,
  Clock,
  Banknote,
  QrCode,
} from 'lucide-react';
import { Card, Button } from '@/design-system';

const CashierDashboard: React.FC = () => {
  const [currentSale] = useState({
    items: [
      { id: 1, name: 'Paracétamol 500mg', quantity: 2, price: 1500, total: 3000 },
      { id: 2, name: 'Vitamine C', quantity: 1, price: 2500, total: 2500 }
    ],
    subtotal: 5500,
    tax: 550,
    total: 6050,
    customer: 'Jean Mukasa'
  });

  const [salesHistory] = useState([
    { id: 1, customer: 'Marie Kabila', amount: 12500, items: 3, time: '14:30', method: 'card' },
    { id: 2, customer: 'Paul Tshikala', amount: 8750, items: 2, time: '14:15', method: 'cash' },
    { id: 3, customer: 'Grace Mbuyi', amount: 15200, items: 5, time: '13:45', method: 'mobile' }
  ]);

  const stats = [
    {
      title: 'Ventes Aujourd\'hui',
      value: '125,000 FC',
      count: '23 transactions',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Vente en Cours',
      value: currentSale.total.toLocaleString() + ' FC',
      count: `${currentSale.items.length} articles`,
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    {
      title: 'Clients Servis',
      value: '18',
      count: 'depuis ce matin',
      icon: User,
      color: 'bg-cyan-500'
    },
    {
      title: 'Caisse',
      value: '85,000 FC',
      count: 'solde disponible',
      icon: Banknote,
      color: 'bg-emerald-500'
    }
  ];

  const paymentMethods = [
    { name: 'Espèces', icon: Banknote, color: 'bg-green-100 text-green-800' },
    { name: 'Carte Bancaire', icon: CreditCard, color: 'bg-blue-100 text-blue-800' },
    { name: 'Mobile Money', icon: QrCode, color: 'bg-cyan-100 text-cyan-800' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Point de Vente</h1>
          <p className="text-gray-600">Gestion des ventes et encaissements</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <BadgePercent className="h-5 w-5 mr-2" />
            Rapport Caisse
          </Button>
          <Button variant="default">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Nouvelle Vente
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
                <p className="text-sm text-gray-500 mt-1">{stat.count}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Zone de vente principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panier actuel */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vente en Cours</h3>
            
            {/* Client */}
            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <span className="font-medium">Client: {currentSale.customer}</span>
              </div>
              <Button size="sm" variant="outline">Changer</Button>
            </div>

            {/* Articles */}
            <div className="space-y-3 mb-6">
              {currentSale.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.price.toLocaleString()} FC × {item.quantity}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">-</Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">+</Button>
                    </div>
                    <span className="font-semibold text-gray-900 w-20 text-right">
                      {item.total.toLocaleString()} FC
                    </span>
                    <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">×</Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totaux */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{currentSale.subtotal.toLocaleString()} FC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>TVA (10%)</span>
                <span>{currentSale.tax.toLocaleString()} FC</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span>{currentSale.total.toLocaleString()} FC</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 mt-6">
              <Button variant="outline" className="flex-1">Suspendre</Button>
              <Button variant="default" className="flex-1">Procéder au Paiement</Button>
            </div>
          </Card>
        </div>

        {/* Méthodes de paiement */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Paiement</h3>
            <div className="space-y-3">
              {paymentMethods.map((method, index) => (
                <button 
                  key={index}
                  className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <method.icon className="h-6 w-6 text-gray-400 mr-3" />
                  <span className="font-medium text-gray-900">{method.name}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant reçu
              </label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="0"
              />
              <p className="text-sm text-gray-500 mt-1">
                Monnaie à rendre: 0 FC
              </p>
            </div>
          </Card>

          {/* Raccourcis */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <BadgePercent className="h-5 w-5 mr-2" />
                Appliquer Remise
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-5 w-5 mr-2" />
                Ventes Suspendues
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="h-5 w-5 mr-2" />
                Rechercher Client
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Historique des ventes */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventes Récentes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Articles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paiement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesHistory.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sale.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.amount.toLocaleString()} FC
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.items} articles
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      sale.method === 'cash' ? 'bg-green-100 text-green-800' :
                      sale.method === 'card' ? 'bg-blue-100 text-blue-800' :
                      'bg-cyan-100 text-cyan-800'
                    }`}>
                      {sale.method === 'cash' ? 'Espèces' :
                       sale.method === 'card' ? 'Carte' : 'Mobile'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button size="sm" variant="outline">
                      Reçu
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default CashierDashboard;