'use client';

import React, { useState, useEffect } from 'react';
import { usePaymentList, usePaymentStatistics } from '@/hooks/usePayments';
import {
  Payment,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  PAYMENT_PROVIDER_LABELS,
  PAYMENT_PROVIDER_ICONS,
} from '@/types/payments';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Alert,
  AlertDescription,
} from '@/components/ui';
import { Download, Filter, RefreshCw, Search, Eye, FileText } from 'lucide-react';
import Link from 'next/link';

interface PaymentListProps {
  tenantId: string;
  showFilters?: boolean;
  limit?: number;
  onPaymentSelect?: (payment: Payment) => void;
}

export function PaymentList({
  tenantId,
  showFilters = true,
  limit = 10,
  onPaymentSelect,
}: PaymentListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  
  const {
    isLoading,
    error,
    data: payments,
    total,
    loadPayments,
    updateFilters,
    refresh,
  } = usePaymentList(tenantId, limit);

  const { formatAmount, formatDate, getTimeAgo } = usePaymentStatistics(payments);

  // Charger les paiements au montage
  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  // Appliquer les filtres
  useEffect(() => {
    const filters: any = {};
    
    if (search) filters.search = search;
    if (statusFilter !== 'all') filters.status = statusFilter;
    if (providerFilter !== 'all') filters.provider = providerFilter;
    
    updateFilters(filters);
    loadPayments(filters);
  }, [search, statusFilter, providerFilter, updateFilters, loadPayments]);

  const handleRefresh = () => {
    refresh();
  };

  const handleExportCSV = () => {
    const csvContent = payments.map(p => 
      `${p.id},${p.invoiceId},${p.amount},${p.currency},${p.status},${p.provider},${formatDate(p.createdAt)}`
    ).join('\n');
    
    const blob = new Blob([`ID,Facture,Montant,Devise,Statut,Méthode,Date\n${csvContent}`], {
      type: 'text/csv',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paiements-${tenantId}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredPayments = payments.filter(payment => {
    if (statusFilter !== 'all' && payment.status !== statusFilter) return false;
    if (providerFilter !== 'all' && payment.provider !== providerFilter) return false;
    if (search && !payment.id.toLowerCase().includes(search.toLowerCase()) && 
        !payment.invoiceId.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Erreur lors du chargement des paiements : {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques et filtres */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Paiements</h2>
          <p className="text-muted-foreground">
            {total} paiement{total !== 1 ? 's' : ''} au total
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par ID ou facture..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtre par statut */}
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: 'all', label: 'Tous les statuts' },
                  { value: 'pending', label: 'En attente' },
                  { value: 'processing', label: 'En traitement' },
                  { value: 'completed', label: 'Terminé' },
                  { value: 'failed', label: 'Échoué' },
                  { value: 'cancelled', label: 'Annulé' },
                ]}
                placeholder="Statut"
              />

              {/* Filtre par méthode */}
              <Select
                value={providerFilter}
                onChange={setProviderFilter}
                options={[
                  { value: 'all', label: 'Toutes les méthodes' },
                  { value: 'manual', label: 'Manuel' },
                  { value: 'bank_transfer', label: 'Virement' },
                  { value: 'cash', label: 'Espèces' },
                ]}
                placeholder="Méthode"
              />

              {/* Bouton de réinitialisation */}
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setProviderFilter('all');
                }}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tableau des paiements */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des paiements</CardTitle>
          <CardDescription>
            {filteredPayments.length} paiement{filteredPayments.length !== 1 ? 's' : ''} trouvé{filteredPayments.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Aucun paiement trouvé</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Facture</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">
                        {payment.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">
                        {payment.invoiceId}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          {formatAmount(payment.amount, payment.currency)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={PAYMENT_STATUS_COLORS[payment.status]}>
                          {PAYMENT_STATUS_LABELS[payment.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{PAYMENT_PROVIDER_ICONS[payment.provider]}</span>
                          <span>{PAYMENT_PROVIDER_LABELS[payment.provider]}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{formatDate(payment.createdAt)}</span>
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(payment.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-8 w-8 p-0"
                          >
                            <Link href={`/tenant/${tenantId}/billing/payments/${payment.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Voir</span>
                            </Link>
                          </Button>
                          
                          {onPaymentSelect && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onPaymentSelect(payment)}
                              className="h-8"
                            >
                              Sélectionner
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {payments.filter(p => p.status === 'pending').length}
            </div>
            <p className="text-sm text-muted-foreground">En attente</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {payments.filter(p => p.status === 'completed').length}
            </div>
            <p className="text-sm text-muted-foreground">Terminés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
              })}
            </div>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {payments.filter(p => p.provider === 'manual').length}
            </div>
            <p className="text-sm text-muted-foreground">Manuels</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}