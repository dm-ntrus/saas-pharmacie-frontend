import React, { useState } from 'react';
import { 
  CubeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  AdjustmentsHorizontalIcon,
  QrCodeIcon,
  DocumentArrowDownIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Card, Button } from '@/design-system';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  location: string;
  batchNumber: string;
  expiryDate: string;
  supplier: string;
  costPrice: number;
  sellPrice: number;
  status: 'normal' | 'low' | 'critical' | 'expired';
}

const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const inventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'Paracétamol 500mg',
      category: 'Analgésiques',
      currentStock: 245,
      minStock: 100,
      maxStock: 500,
      unit: 'comprimés',
      location: 'A-1-15',
      batchNumber: 'LOT2025001',
      expiryDate: '2025-12-15',
      supplier: 'Pharma Distribution RDC',
      costPrice: 850,
      sellPrice: 1200,
      status: 'normal'
    },
    {
      id: '2',
      name: 'Amoxicilline 250mg',
      category: 'Antibiotiques',
      currentStock: 25,
      minStock: 50,
      maxStock: 200,
      unit: 'gélules',
      location: 'B-2-08',
      batchNumber: 'LOT2025002',
      expiryDate: '2025-08-20',
      supplier: 'MedImport Congo',
      costPrice: 1500,
      sellPrice: 2100,
      status: 'low'
    },
    {
      id: '3',
      name: 'Ibuprofène 400mg',
      category: 'Anti-inflammatoires',
      currentStock: 5,
      minStock: 30,
      maxStock: 150,
      unit: 'comprimés',
      location: 'A-3-22',
      batchNumber: 'LOT2025003',
      expiryDate: '2025-06-10',
      supplier: 'Pharma Distribution RDC',
      costPrice: 1200,
      sellPrice: 1800,
      status: 'critical'
    },
    {
      id: '4',
      name: 'Aspirine 500mg',
      category: 'Analgésiques',
      currentStock: 0,
      minStock: 50,
      maxStock: 200,
      unit: 'comprimés',
      location: 'A-1-10',
      batchNumber: 'LOT2024010',
      expiryDate: '2024-12-31',
      supplier: 'MedImport Congo',
      costPrice: 750,
      sellPrice: 1100,
      status: 'expired'
    }
  ];

  const categories = ['all', 'Analgésiques', 'Antibiotiques', 'Anti-inflammatoires', 'Vitamines', 'Autres'];
  const statuses = ['all', 'normal', 'low', 'critical', 'expired'];

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return 'Normal';
      case 'low': return 'Stock faible';
      case 'critical': return 'Critique';
      case 'expired': return 'Expiré';
      default: return 'Inconnu';
    }
  };

  const stats = [
    {
      title: 'Total Produits',
      value: inventoryItems.length.toString(),
      icon: CubeIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Stock Faible',
      value: inventoryItems.filter(i => i.status === 'low').length.toString(),
      icon: ExclamationTriangleIcon,
      color: 'bg-yellow-500'
    },
    {
      title: 'Stock Critique',
      value: inventoryItems.filter(i => i.status === 'critical').length.toString(),
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500'
    },
    {
      title: 'Expirés',
      value: inventoryItems.filter(i => i.status === 'expired').length.toString(),
      icon: ClockIcon,
      color: 'bg-gray-500'
    }
  ];

  return (
    <Layout title="Gestion des Stocks">
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Stocks</h1>
            <p className="text-gray-600">Suivi et contrôle de l'inventaire pharmaceutique</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button variant="outline">
              <QrCodeIcon className="h-5 w-5 mr-2" />
              Scanner
            </Button>
            <Button variant="outline">
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Importer
            </Button>
            <Button variant="primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Ajouter Produit
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
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Toutes catégories' : category}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'Tous statuts' : getStatusText(status)}
                </option>
              ))}
            </select>

            <Button variant="outline">
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Filtres Avancés
            </Button>
          </div>
        </Card>

        {/* Liste des produits */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emplacement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lot / Expiration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
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
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.currentStock} {item.unit}
                      </div>
                      <div className="text-sm text-gray-500">
                        Min: {item.minStock} / Max: {item.maxStock}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.batchNumber}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(item.expiryDate).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.sellPrice.toLocaleString()} FC
                      </div>
                      <div className="text-sm text-gray-500">
                        Coût: {item.costPrice.toLocaleString()} FC
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Modifier</Button>
                        <Button size="sm" variant="primary">Ajuster</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <CubeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-600">
                Essayez de modifier vos critères de recherche ou ajoutez de nouveaux produits.
              </p>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default InventoryPage;