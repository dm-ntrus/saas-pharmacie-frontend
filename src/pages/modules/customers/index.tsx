import React, { useState } from 'react';
import { 
  UserGroupIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  StarIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Card, Button } from '@/design-system';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  dateOfBirth: string;
  registrationDate: string;
  totalSpent: number;
  totalOrders: number;
  loyaltyPoints: number;
  status: 'active' | 'inactive' | 'vip';
  lastVisit: string;
  allergies?: string[];
  notes?: string;
}

const CustomersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const customers: Customer[] = [
    {
      id: '1',
      firstName: 'Jean',
      lastName: 'Mukasa',
      email: 'jean.mukasa@email.com',
      phone: '+243 99 123 4567',
      address: '123 Av. Lumumba',
      city: 'Kinshasa',
      dateOfBirth: '1985-05-15',
      registrationDate: '2024-01-15',
      totalSpent: 245000,
      totalOrders: 28,
      loyaltyPoints: 2450,
      status: 'vip',
      lastVisit: '2025-01-20',
      allergies: ['Pénicilline', 'Aspirine'],
      notes: 'Diabétique - surveiller les interactions médicamenteuses'
    },
    {
      id: '2',
      firstName: 'Marie',
      lastName: 'Kabila',
      email: 'marie.kabila@email.com',
      phone: '+243 97 234 5678',
      address: '45 Rue Kasavubu',
      city: 'Lubumbashi',
      dateOfBirth: '1990-08-22',
      registrationDate: '2024-03-10',
      totalSpent: 156000,
      totalOrders: 18,
      loyaltyPoints: 1560,
      status: 'active',
      lastVisit: '2025-01-19',
      allergies: ['Iode']
    },
    {
      id: '3',
      firstName: 'Pierre',
      lastName: 'Kasongo',
      email: 'pierre.kasongo@email.com',
      phone: '+243 98 345 6789',
      address: '78 Bd. du 30 Juin',
      city: 'Goma',
      dateOfBirth: '1978-12-03',
      registrationDate: '2023-11-20',
      totalSpent: 89000,
      totalOrders: 12,
      loyaltyPoints: 890,
      status: 'active',
      lastVisit: '2025-01-18'
    },
    {
      id: '4',
      firstName: 'Grace',
      lastName: 'Mbuyi',
      email: 'grace.mbuyi@email.com',
      phone: '+243 99 456 7890',
      address: '32 Av. Mobutu',
      city: 'Mbuji-Mayi',
      dateOfBirth: '1995-03-18',
      registrationDate: '2024-07-05',
      totalSpent: 34000,
      totalOrders: 5,
      loyaltyPoints: 340,
      status: 'inactive',
      lastVisit: '2024-12-15'
    }
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip': return 'bg-cyan-100 text-cyan-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'vip': return 'VIP';
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      default: return 'Inconnu';
    }
  };

  const stats = [
    {
      title: 'Total Clients',
      value: customers.length.toString(),
      icon: UserGroupIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Clients VIP',
      value: customers.filter(c => c.status === 'vip').length.toString(),
      icon: StarIcon,
      color: 'bg-cyan-500'
    },
    {
      title: 'Clients Actifs',
      value: customers.filter(c => c.status === 'active').length.toString(),
      icon: UserGroupIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Nouveaux ce Mois',
      value: customers.filter(c => new Date(c.registrationDate) > new Date('2025-01-01')).length.toString(),
      icon: PlusIcon,
      color: 'bg-sky-500'
    }
  ];

  return (
    <Layout title="Gestion des Clients">
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Clients</h1>
            <p className="text-gray-600">Base de données clients et programme de fidélisation</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button variant="outline">
              Exporter Liste
            </Button>
            <Button variant="primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Nouveau Client
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
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filtres et recherche */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="vip">VIP</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>

            <Button variant="outline">
              Filtres Avancés
            </Button>
          </div>
        </Card>

        {/* Liste des clients */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {customer.firstName} {customer.lastName}
                  </h3>
                  <div className="flex items-center mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                      {getStatusText(customer.status)}
                    </span>
                    {customer.status === 'vip' && (
                      <StarIcon className="h-4 w-4 text-cyan-600 ml-2" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  {customer.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {customer.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {customer.address}, {customer.city}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarDaysIcon className="h-4 w-4 mr-2" />
                  Dernière visite: {new Date(customer.lastVisit).toLocaleDateString('fr-FR')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <CurrencyDollarIcon className="h-4 w-4 text-gray-500 mr-1" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{customer.totalSpent.toLocaleString()} FC</p>
                  <p className="text-xs text-gray-600">Total dépensé</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <ShoppingBagIcon className="h-4 w-4 text-gray-500 mr-1" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{customer.totalOrders}</p>
                  <p className="text-xs text-gray-600">Commandes</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Points de fidélité</p>
                  <p className="text-lg font-bold text-sky-600">{customer.loyaltyPoints.toLocaleString()}</p>
                </div>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon 
                      key={star} 
                      className={`h-4 w-4 ${
                        star <= (customer.loyaltyPoints / 1000) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
              </div>

              {customer.allergies && customer.allergies.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400">
                  <p className="text-sm font-medium text-red-800 mb-1">Allergies</p>
                  <p className="text-sm text-red-700">{customer.allergies.join(', ')}</p>
                </div>
              )}

              {customer.notes && (
                <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                  <p className="text-sm font-medium text-yellow-800 mb-1">Notes</p>
                  <p className="text-sm text-yellow-700">{customer.notes}</p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Voir
                </Button>
                <Button size="sm" variant="primary" className="flex-1">
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <Card className="p-12 text-center">
            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche ou ajoutez un nouveau client.
            </p>
          </Card>
        )}

        {/* Programme de fidélité */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Programme de Fidélité</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-bronze-50 rounded-lg border">
              <StarIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-medium text-orange-900">Bronze</h4>
              <p className="text-sm text-orange-700">0 - 999 points</p>
              <p className="text-xs text-orange-600 mt-1">2% de cashback</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border">
              <StarIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Argent</h4>
              <p className="text-sm text-gray-700">1000 - 4999 points</p>
              <p className="text-xs text-gray-600 mt-1">5% de cashback</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border">
              <StarIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2 fill-current" />
              <h4 className="font-medium text-yellow-900">Or</h4>
              <p className="text-sm text-yellow-700">5000+ points</p>
              <p className="text-xs text-yellow-600 mt-1">10% de cashback</p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default CustomersPage;