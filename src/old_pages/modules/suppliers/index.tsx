import React, { useState } from 'react';
import { 
  TruckIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  StarIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Card, Button } from '@/design-system';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  registrationNumber: string;
  taxNumber: string;
  category: string;
  rating: number;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'inactive' | 'suspended';
  paymentTerms: string;
  deliveryTime: string;
  products: string[];
  notes?: string;
}

const SuppliersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const suppliers: Supplier[] = [
    {
      id: '1',
      name: 'Pharma Distribution RDC',
      contactPerson: 'Jean-Claude Mavungu',
      email: 'contact@pharmadistrib.cd',
      phone: '+243 81 234 5678',
      address: '123 Av. Liberation',
      city: 'Kinshasa',
      country: 'RDC',
      registrationNumber: 'RC-KIN-2020-001',
      taxNumber: 'A123456789',
      category: 'Grossiste Pharmaceutique',
      rating: 4.8,
      totalOrders: 145,
      totalSpent: 2450000,
      lastOrderDate: '2025-01-18',
      status: 'active',
      paymentTerms: '30 jours',
      deliveryTime: '2-3 jours',
      products: ['Médicaments génériques', 'Antibiotiques', 'Analgésiques', 'Vitamines'],
      notes: 'Excellent fournisseur, livraisons toujours à temps'
    },
    {
      id: '2',
      name: 'MedImport Congo',
      contactPerson: 'Marie Kasongo',
      email: 'orders@medimport.cd',
      phone: '+243 97 345 6789',
      address: '45 Bd. du 30 Juin',
      city: 'Lubumbashi',
      country: 'RDC',
      registrationNumber: 'RC-LUB-2019-045',
      taxNumber: 'B987654321',
      category: 'Importateur',
      rating: 4.5,
      totalOrders: 89,
      totalSpent: 1680000,
      lastOrderDate: '2025-01-15',
      status: 'active',
      paymentTerms: '15 jours',
      deliveryTime: '5-7 jours',
      products: ['Médicaments spécialisés', 'Équipements médicaux', 'Dispositifs'],
      notes: 'Spécialisé dans les produits d\'importation européenne'
    },
    {
      id: '3',
      name: 'Laboratoires Galenika',
      contactPerson: 'Dr. Paul Mwamba',
      email: 'commercial@galenika.cd',
      phone: '+243 99 456 7890',
      address: '78 Rue Kasavubu',
      city: 'Goma',
      country: 'RDC',
      registrationNumber: 'RC-GOM-2021-012',
      taxNumber: 'C456789123',
      category: 'Laboratoire Local',
      rating: 4.2,
      totalOrders: 56,
      totalSpent: 890000,
      lastOrderDate: '2025-01-10',
      status: 'active',
      paymentTerms: '45 jours',
      deliveryTime: '1-2 jours',
      products: ['Sérums', 'Solutions injectable', 'Préparations magistrales']
    },
    {
      id: '4',
      name: 'East Africa Medical Supply',
      contactPerson: 'James Mukamana',
      email: 'info@eamedsupply.rw',
      phone: '+250 78 123 4567',
      address: 'KG 15 Ave',
      city: 'Kigali',
      country: 'Rwanda',
      registrationNumber: 'RC-KGL-2020-089',
      taxNumber: 'RW123456789',
      category: 'Grossiste Régional',
      rating: 3.8,
      totalOrders: 23,
      totalSpent: 450000,
      lastOrderDate: '2024-12-20',
      status: 'inactive',
      paymentTerms: '60 jours',
      deliveryTime: '7-10 jours',
      products: ['Médicaments génériques', 'Matériel médical']
    }
  ];

  const categories = ['all', 'Grossiste Pharmaceutique', 'Importateur', 'Laboratoire Local', 'Grossiste Régional'];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.products.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || supplier.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'suspended': return 'Suspendu';
      default: return 'Inconnu';
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const stats = [
    {
      title: 'Total Fournisseurs',
      value: suppliers.length.toString(),
      icon: BuildingOfficeIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Fournisseurs Actifs',
      value: suppliers.filter(s => s.status === 'active').length.toString(),
      icon: CheckCircleIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Commandes ce Mois',
      value: suppliers.reduce((sum, s) => sum + s.totalOrders, 0).toString(),
      icon: ClipboardDocumentListIcon,
      color: 'bg-cyan-500'
    },
    {
      title: 'Valeur Totale',
      value: (suppliers.reduce((sum, s) => sum + s.totalSpent, 0) / 1000000).toFixed(1) + 'M FC',
      icon: CurrencyDollarIcon,
      color: 'bg-sky-500'
    }
  ];

  return (
    <Layout title="Gestion des Fournisseurs">
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Fournisseurs</h1>
            <p className="text-gray-600">Relations fournisseurs et gestion des approvisionnements</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button variant="outline">
              <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
              Nouvelle Commande
            </Button>
            <Button variant="primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Nouveau Fournisseur
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un fournisseur..."
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
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="suspended">Suspendu</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Toutes catégories' : category}
                </option>
              ))}
            </select>

            <Button variant="outline">
              Filtres Avancés
            </Button>
          </div>
        </Card>

        {/* Liste des fournisseurs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                  <p className="text-sm text-gray-600">{supplier.category}</p>
                  <div className="flex items-center mt-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(supplier.status)}`}>
                      {getStatusText(supplier.status)}
                    </span>
                    <div className="flex items-center ml-3">
                      {renderStars(supplier.rating)}
                      <span className="text-sm text-gray-600 ml-1">({supplier.rating})</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  {supplier.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {supplier.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {supplier.address}, {supplier.city}, {supplier.country}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <TruckIcon className="h-4 w-4 mr-2" />
                  Livraison: {supplier.deliveryTime}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{supplier.totalOrders}</p>
                  <p className="text-xs text-gray-600">Commandes</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{supplier.totalSpent.toLocaleString()} FC</p>
                  <p className="text-xs text-gray-600">Total acheté</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Produits fournis</p>
                <div className="flex flex-wrap gap-1">
                  {supplier.products.slice(0, 3).map((product, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {product}
                    </span>
                  ))}
                  {supplier.products.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      +{supplier.products.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Contact:</span>
                  <span className="font-medium">{supplier.contactPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span>Conditions:</span>
                  <span className="font-medium">{supplier.paymentTerms}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dernière commande:</span>
                  <span className="font-medium">
                    {new Date(supplier.lastOrderDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              {supplier.notes && (
                <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400">
                  <p className="text-sm text-blue-700">{supplier.notes}</p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Voir
                </Button>
                <Button size="sm" variant="primary" className="flex-1">
                  <ClipboardDocumentListIcon className="h-4 w-4 mr-1" />
                  Commander
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredSuppliers.length === 0 && (
          <Card className="p-12 text-center">
            <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun fournisseur trouvé</h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche ou ajoutez un nouveau fournisseur.
            </p>
          </Card>
        )}

        {/* Indicateurs de performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Fournisseurs</h3>
            <div className="space-y-3">
              {suppliers
                .sort((a, b) => b.totalSpent - a.totalSpent)
                .slice(0, 5)
                .map((supplier, index) => (
                  <div key={supplier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-sky-600 text-white rounded-full text-xs flex items-center justify-center mr-3">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{supplier.name}</p>
                        <p className="text-xs text-gray-600">{supplier.totalOrders} commandes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {supplier.totalSpent.toLocaleString()} FC
                      </p>
                      <div className="flex items-center">
                        {renderStars(supplier.rating)}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes Fournisseurs</h3>
            <div className="space-y-3">
              {suppliers.filter(s => s.status === 'inactive').map((supplier) => (
                <div key={supplier.id} className="flex items-center p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">{supplier.name}</p>
                    <p className="text-xs text-yellow-700">Inactif depuis plus de 30 jours</p>
                  </div>
                </div>
              ))}
              
              {suppliers.filter(s => new Date(s.lastOrderDate) < new Date('2025-01-01')).map((supplier) => (
                <div key={`old-${supplier.id}`} className="flex items-center p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <ClockIcon className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">{supplier.name}</p>
                    <p className="text-xs text-blue-700">Pas de commande récente</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SuppliersPage;