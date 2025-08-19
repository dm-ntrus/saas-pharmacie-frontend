import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/design-system';
import { apiClient } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useAuth';
import { UserRole, type Product, BatchStatus, ProductCategory } from '@/types';

const InventoryPage: React.FC = () => {
  useRequireAuth([UserRole.ADMIN, UserRole.PHARMACIST, UserRole.TECHNICIAN]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', currentPage, searchTerm],
    queryFn: () => apiClient.getProducts(currentPage, pageSize),
  });

  const { data: lowStockAlerts } = useQuery({
    queryKey: ['low-stock-alerts'],
    queryFn: () => apiClient.getLowStockAlerts(),
  });

  const { data: expiringProducts } = useQuery({
    queryKey: ['expiring-products'],
    queryFn: () => apiClient.getExpiringProducts(),
  });

  const getCategoryColor = (category: ProductCategory) => {
    const colors = {
      [ProductCategory.PRESCRIPTION]: 'bg-blue-100 text-blue-800',
      [ProductCategory.OTC]: 'bg-green-100 text-green-800',
      [ProductCategory.SUPPLEMENT]: 'bg-cyan-100 text-cyan-800',
      [ProductCategory.MEDICAL_DEVICE]: 'bg-orange-100 text-orange-800',
      [ProductCategory.COSMETIC]: 'bg-pink-100 text-pink-800',
      [ProductCategory.PERSONAL_CARE]: 'bg-gray-100 text-gray-800',
    };
    
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: ProductCategory) => {
    const labels = {
      [ProductCategory.PRESCRIPTION]: 'Prescription',
      [ProductCategory.OTC]: 'Vente libre',
      [ProductCategory.SUPPLEMENT]: 'Complément',
      [ProductCategory.MEDICAL_DEVICE]: 'Dispositif médical',
      [ProductCategory.COSMETIC]: 'Cosmétique',
      [ProductCategory.PERSONAL_CARE]: 'Soins personnels',
    };
    
    return labels[category] || category;
  };

  const getStockStatus = (product: Product) => {
    const totalQuantity = product.batches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0;
    const minStock = 10; // Valeur par défaut

    if (totalQuantity === 0) {
      return { status: 'out-of-stock', label: 'Rupture de stock', color: 'text-red-600' };
    } else if (totalQuantity <= minStock) {
      return { status: 'low-stock', label: 'Stock faible', color: 'text-yellow-600' };
    } else {
      return { status: 'in-stock', label: 'En stock', color: 'text-green-600' };
    }
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const totalQuantity = product.batches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0;
    const stockStatus = getStockStatus(product);
    
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <CubeIcon className="h-8 w-8 text-gray-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {product.manufacturer} • {product.strength}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                    {getCategoryLabel(product.category)}
                  </span>
                  {product.requiresPrescription && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Sur ordonnance
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-900">{product.price.toFixed(2)} €</p>
              <p className="text-gray-500">Prix de vente</p>
            </div>
            <div>
              <p className={`font-medium ${stockStatus.color}`}>{totalQuantity}</p>
              <p className="text-gray-500">Quantité</p>
            </div>
            <div>
              <p className={`font-medium ${stockStatus.color}`}>{stockStatus.label}</p>
              <p className="text-gray-500">Statut</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              NDC: {product.ndc}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/inventory/${product.id}`}>
                  Voir détails
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/inventory/${product.id}/edit`}>
                  Modifier
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const AlertsSidebar = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
            Stock faible ({lowStockAlerts?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lowStockAlerts?.length ? (
            <div className="space-y-3">
              {lowStockAlerts.slice(0, 5).map((alert: any, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900">{alert.productName}</p>
                    <p className="text-xs text-yellow-700">{alert.currentQuantity} restant(s)</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Commander
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aucun produit en stock faible.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
            Expiration proche ({expiringProducts?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {expiringProducts?.length ? (
            <div className="space-y-3">
              {expiringProducts.slice(0, 5).map((product: any, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">{product.productName}</p>
                    <p className="text-xs text-red-700">
                      Expire le {new Date(product.expirationDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Gérer
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aucun produit proche de l'expiration.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <CubeIcon className="h-12 w-12 text-gray-400 mx-auto" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun produit</h3>
      <p className="mt-1 text-sm text-gray-500">
        Commencez par ajouter des produits à votre inventaire.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/inventory/new">
            <PlusIcon className="h-4 w-4 mr-2" />
            Nouveau produit
          </Link>
        </Button>
      </div>
    </div>
  );

  const Stats = () => {
    const totalProducts = productsData?.meta?.total || 0;
    const lowStockCount = lowStockAlerts?.length || 0;
    const expiringCount = expiringProducts?.length || 0;
    const inStockCount = totalProducts - lowStockCount;

    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CubeIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total produits</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalProducts}</dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">En stock</dt>
                  <dd className="text-lg font-medium text-gray-900">{inStockCount}</dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Stock faible</dt>
                  <dd className="text-lg font-medium text-gray-900">{lowStockCount}</dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">À expirer</dt>
                  <dd className="text-lg font-medium text-gray-900">{expiringCount}</dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Layout title="Inventaire - PharmacySaaS">
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventaire</h1>
            <p className="text-gray-600">
              Gérez votre stock de produits pharmaceutiques
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" asChild>
              <Link href="/inventory/import">
                Importer
              </Link>
            </Button>
            <Button asChild>
              <Link href="/inventory/new">
                <PlusIcon className="h-4 w-4 mr-2" />
                Nouveau produit
              </Link>
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <Stats />

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {/* Barre de recherche */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Rechercher par nom, NDC, fabricant..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                    />
                  </div>
                  <Button variant="outline">
                    Filtres
                  </Button>
                  <Button variant="outline">
                    Exporter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Liste des produits */}
            {isLoading ? (
              <div className="grid gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-40"></div>
                  </div>
                ))}
              </div>
            ) : !productsData?.data.length ? (
              <EmptyState />
            ) : (
              <div className="grid gap-6">
                {productsData.data.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar des alertes */}
          <div className="lg:col-span-1">
            <AlertsSidebar />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InventoryPage;