import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/design-system';
import { apiClient } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useAuth';
import { UserRole, type Sale, SaleStatus, PaymentMethod } from '@/types';

const SalesPage: React.FC = () => {
  useRequireAuth([UserRole.ADMIN, UserRole.PHARMACIST, UserRole.TECHNICIAN, UserRole.CASHIER]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const { data: salesData, isLoading } = useQuery({
    queryKey: ['sales', currentPage, searchTerm],
    queryFn: () => apiClient.getSales(currentPage, pageSize),
  });

  const getStatusColor = (status: SaleStatus) => {
    const colors = {
      [SaleStatus.COMPLETED]: 'bg-green-100 text-green-800',
      [SaleStatus.REFUNDED]: 'bg-red-100 text-red-800',
      [SaleStatus.PARTIALLY_REFUNDED]: 'bg-yellow-100 text-yellow-800',
      [SaleStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
    };
    
    return colors[status];
  };

  const getStatusLabel = (status: SaleStatus) => {
    const labels = {
      [SaleStatus.COMPLETED]: 'Complétée',
      [SaleStatus.REFUNDED]: 'Remboursée',
      [SaleStatus.PARTIALLY_REFUNDED]: 'Partiellement remboursée',
      [SaleStatus.CANCELLED]: 'Annulée',
    };
    
    return labels[status];
  };

  const getPaymentMethodColor = (method: PaymentMethod) => {
    const colors = {
      [PaymentMethod.CASH]: 'bg-green-100 text-green-800',
      [PaymentMethod.CARD]: 'bg-blue-100 text-blue-800',
      [PaymentMethod.INSURANCE]: 'bg-purple-100 text-purple-800',
      [PaymentMethod.MIXED]: 'bg-orange-100 text-orange-800',
    };
    
    return colors[method];
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    const labels = {
      [PaymentMethod.CASH]: 'Espèces',
      [PaymentMethod.CARD]: 'Carte',
      [PaymentMethod.INSURANCE]: 'Assurance',
      [PaymentMethod.MIXED]: 'Mixte',
    };
    
    return labels[method];
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CASH:
        return <BanknotesIcon className="h-4 w-4" />;
      case PaymentMethod.CARD:
        return <CreditCardIcon className="h-4 w-4" />;
      case PaymentMethod.INSURANCE:
        return <CurrencyDollarIcon className="h-4 w-4" />;
      default:
        return <CurrencyDollarIcon className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const SaleCard = ({ sale }: { sale: Sale }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Vente #{sale.saleNumber}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                    {getStatusLabel(sale.status)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentMethodColor(sale.paymentMethod)}`}>
                    {getPaymentMethodIcon(sale.paymentMethod)}
                    <span className="ml-1">{getPaymentMethodLabel(sale.paymentMethod)}</span>
                  </span>
                </div>
              </div>
              
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span> {new Date(sale.saleDate).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                {sale.patient && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Patient:</span> {sale.patient.firstName} {sale.patient.lastName}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Caissier:</span> {sale.cashier?.firstName} {sale.cashier?.lastName}
                </p>
              </div>
              
              {sale.items && sale.items.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500">
                    {sale.items.length} article(s):
                  </p>
                  <ul className="mt-1 space-y-1">
                    {sale.items.slice(0, 2).map((item, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        • {item.product?.name} - Qté: {item.quantity} - {formatCurrency(item.totalPrice)}
                      </li>
                    ))}
                    {sale.items.length > 2 && (
                      <li className="text-sm text-gray-500">
                        ... et {sale.items.length - 2} autre(s)
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-900">{formatCurrency(sale.subtotal)}</p>
                <p className="text-gray-500">Sous-total</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">{formatCurrency(sale.taxAmount)}</p>
                <p className="text-gray-500">TVA</p>
              </div>
              <div>
                <p className="font-bold text-lg text-gray-900">{formatCurrency(sale.totalAmount)}</p>
                <p className="text-gray-500">Total</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/sales/${sale.id}`}>
                  Voir détails
                </Link>
              </Button>
              {sale.status === SaleStatus.COMPLETED && (
                <Button size="sm" variant="outline">
                  Rembourser
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const Stats = () => {
    const totalSales = salesData?.data.length || 0;
    const totalRevenue = salesData?.data.reduce((sum, sale) => sum + sale.totalAmount, 0) || 0;
    const completedSales = salesData?.data.filter(sale => sale.status === SaleStatus.COMPLETED).length || 0;
    const avgSaleAmount = totalSales > 0 ? totalRevenue / totalSales : 0;

    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total ventes</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalSales}</dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Chiffre d'affaires</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatCurrency(totalRevenue)}</dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCardIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Ventes complétées</dt>
                  <dd className="text-lg font-medium text-gray-900">{completedSales}</dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BanknotesIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Panier moyen</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatCurrency(avgSaleAmount)}</dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune vente</h3>
      <p className="mt-1 text-sm text-gray-500">
        Commencez par enregistrer une nouvelle vente.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/sales/new">
            <PlusIcon className="h-4 w-4 mr-2" />
            Nouvelle vente
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <Layout title="Ventes - PharmacySaaS">
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ventes</h1>
            <p className="text-gray-600">
              Gérez les transactions et les ventes de votre pharmacie
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" asChild>
              <Link href="/sales/pos">
                Point de vente
              </Link>
            </Button>
            <Button asChild>
              <Link href="/sales/new">
                <PlusIcon className="h-4 w-4 mr-2" />
                Nouvelle vente
              </Link>
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <Stats />

        {/* Barre de recherche */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher par numéro de vente, patient, caissier..."
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

        {/* Liste des ventes */}
        {isLoading ? (
          <div className="grid gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48"></div>
              </div>
            ))}
          </div>
        ) : !salesData?.data.length ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6">
            {salesData.data.map((sale) => (
              <SaleCard key={sale.id} sale={sale} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SalesPage;