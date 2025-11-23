import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  BanknotesIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ArrowPathIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Layout from "@/components/layout/Layout";
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/design-system";
import { Pagination } from "@/components/Pagination";
import { usePagination } from "@/hooks/usePerformance";
import { apiClient } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useAuth";
import { UserRole, type Sale, SaleStatus, PaymentMethod } from "@/types";
import { toast } from "react-hot-toast";
import { PrintReceiptModal } from "@/components/sales/PrintReceiptModal";
import { DeleteSaleModal } from "@/components/sales/DeleteSaleModal";
import { RefundModal } from "@/components/sales/RefundModal";

const SalesPage: React.FC = () => {
  useRequireAuth([
    UserRole.ADMIN,
    UserRole.PHARMACIST,
    UserRole.TECHNICIAN,
    UserRole.CASHIER,
  ]);

  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState<SaleStatus | "">("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<
    PaymentMethod | ""
  >("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  // Modals state
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const { data: salesData, isLoading } = useQuery({
    queryKey: [
      "sales",
      currentPage,
      itemsPerPage,
      searchTerm,
      filterStatus,
      filterPaymentMethod,
      filterDateFrom,
      filterDateTo,
    ],
    queryFn: () =>
      apiClient.getSales({
        search: searchTerm,
        page: currentPage,
        limit: itemsPerPage,
        status: filterStatus || undefined,
        paymentMethod: filterPaymentMethod || undefined,
        startDate: filterDateFrom || undefined,
        endDate: filterDateTo || undefined,
      }),
  });

  const pagination = usePagination(
    salesData?.total || 0,
    itemsPerPage,
    currentPage
  );

  // Refund mutation
  const refundMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiClient.refundSale(id, reason),
    onSuccess: () => {
      toast.success("Vente remboursée avec succès!");
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      setIsRefundModalOpen(false);
      setSelectedSale(null);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Erreur lors du remboursement"
      );
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteSale(id),
    onSuccess: () => {
      toast.success("Vente supprimée avec succès!");
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      setIsDeleteModalOpen(false);
      setSelectedSale(null);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Erreur lors de la suppression"
      );
    },
  });

  const getStatusColor = (status: SaleStatus) => {
    const colors = {
      [SaleStatus.COMPLETED]: "bg-green-100 text-green-800",
      [SaleStatus.REFUNDED]: "bg-red-100 text-red-800",
      [SaleStatus.PARTIALLY_REFUNDED]: "bg-yellow-100 text-yellow-800",
      [SaleStatus.CANCELLED]: "bg-gray-100 text-gray-800",
    };
    return colors[status];
  };

  const getStatusLabel = (status: SaleStatus) => {
    const labels = {
      [SaleStatus.COMPLETED]: "Complétée",
      [SaleStatus.REFUNDED]: "Remboursée",
      [SaleStatus.PARTIALLY_REFUNDED]: "Partiellement remboursée",
      [SaleStatus.CANCELLED]: "Annulée",
    };
    return labels[status];
  };

  const getPaymentMethodColor = (method: PaymentMethod) => {
    const colors = {
      [PaymentMethod.CASH]: "bg-green-100 text-green-800",
      [PaymentMethod.CARD]: "bg-blue-100 text-blue-800",
      [PaymentMethod.INSURANCE]: "bg-cyan-100 text-cyan-800",
      [PaymentMethod.MIXED]: "bg-orange-100 text-orange-800",
    };
    return colors[method];
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    const labels = {
      [PaymentMethod.CASH]: "Espèces",
      [PaymentMethod.CARD]: "Carte",
      [PaymentMethod.INSURANCE]: "Assurance",
      [PaymentMethod.MIXED]: "Mixte",
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
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const handleExport = () => {
    if (!salesData?.data) return;

    const csvContent = [
      [
        "Numéro",
        "Date",
        "Patient",
        "Caissier",
        "Mode paiement",
        "Statut",
        "Total",
      ],
      ...salesData.data.map((sale) => [
        sale.saleNumber,
        new Date(sale.saleDate).toLocaleString("fr-FR"),
        sale.patient
          ? `${sale.patient.firstName} ${sale.patient.lastName}`
          : "N/A",
        `${sale.cashier?.firstName} ${sale.cashier?.lastName}`,
        sale.paymentMethod,
        sale.status,
        sale.totalAmount,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ventes-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const resetFilters = () => {
    setFilterStatus("");
    setFilterPaymentMethod("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const SaleCard = ({ sale }: { sale: Sale }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="flex-shrink-0">
              <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Vente #{sale.saleNumber}
                </h3>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      sale.status
                    )}`}
                  >
                    {getStatusLabel(sale.status)}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentMethodColor(
                      sale.paymentMethod
                    )}`}
                  >
                    {getPaymentMethodIcon(sale.paymentMethod)}
                    <span className="ml-1">
                      {getPaymentMethodLabel(sale.paymentMethod)}
                    </span>
                  </span>
                </div>
              </div>

              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(sale.saleDate).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {sale.patient && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Patient:</span>{" "}
                    {sale.patient.firstName} {sale.patient.lastName}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Caissier:</span>{" "}
                  {sale.cashier?.firstName} {sale.cashier?.lastName}
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
                        • {item.product?.name} - Qté: {item.quantity} -{" "}
                        {formatCurrency(item.totalPrice)}
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
                <p className="font-medium text-gray-900">
                  {formatCurrency(sale.subtotal)}
                </p>
                <p className="text-gray-500">Sous-total</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {formatCurrency(sale.taxAmount)}
                </p>
                <p className="text-gray-500">TVA</p>
              </div>
              <div>
                <p className="font-bold text-lg text-gray-900">
                  {formatCurrency(sale.totalAmount)}
                </p>
                <p className="text-gray-500">Total</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedSale(sale);
                  setIsPrintModalOpen(true);
                }}
                icon={<PrinterIcon className="h-4 w-4" />}
              />
              <Button variant="outline" size="sm" asChild>
                <Link href={`/sales/${sale.id}`}>Détails</Link>
              </Button>
              {sale.status === SaleStatus.COMPLETED && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedSale(sale);
                    setIsRefundModalOpen(true);
                  }}
                  icon={<ArrowPathIcon className="h-4 w-4" />}
                >
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
    const totalSales = salesData?.total || 0;
    const totalRevenue =
      salesData?.data.reduce((sum, sale) => sum + sale.totalAmount, 0) || 0;
    const completedSales =
      salesData?.data.filter((sale) => sale.status === SaleStatus.COMPLETED)
        .length || 0;
    const avgSaleAmount = totalSales > 0 ? totalRevenue / totalSales : 0;

    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total ventes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalSales}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Chiffre d'affaires
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(totalRevenue)}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCardIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Ventes complétées
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {completedSales}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BanknotesIcon className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Panier moyen
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {formatCurrency(avgSaleAmount)}
                  </dd>
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
        <Button asChild icon={<PlusIcon className="h-4 w-4" />}>
          <Link href="/sales/new">Nouvelle vente</Link>
        </Button>
      </div>
    </div>
  );

  return (
    <Layout title="Ventes - PharmacySaaS">
      <div className="space-y-4">
        {/* En-tête */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ventes</h1>
            <p className="text-gray-600">
              Gérez les transactions et les ventes de votre pharmacie
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button variant="outline" asChild>
              <Link href="/sales/reports">Rapports</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/sales/pos">Point de vente</Link>
            </Button>
            <Button asChild icon={<PlusIcon className="h-4 w-4" />}>
              <Link href="/sales/new">Nouvelle vente</Link>
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <Stats />

        {/* Barre de recherche et filtres */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Rechercher par numéro de vente, patient, caissier..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  icon={<FunnelIcon className="h-5 w-5" />}
                >
                  Filtres
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  icon={<ArrowDownTrayIcon className="h-5 w-5" />}
                >
                  Exporter
                </Button>
              </div>

              {/* Filtres avancés */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statut
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => {
                        setFilterStatus(e.target.value as SaleStatus | "");
                        setCurrentPage(1);
                      }}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                    >
                      <option value="">Tous</option>
                      <option value={SaleStatus.COMPLETED}>Complétée</option>
                      <option value={SaleStatus.REFUNDED}>Remboursée</option>
                      <option value={SaleStatus.PARTIALLY_REFUNDED}>
                        Partiellement remboursée
                      </option>
                      <option value={SaleStatus.CANCELLED}>Annulée</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mode de paiement
                    </label>
                    <select
                      value={filterPaymentMethod}
                      onChange={(e) => {
                        setFilterPaymentMethod(
                          e.target.value as PaymentMethod | ""
                        );
                        setCurrentPage(1);
                      }}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                    >
                      <option value="">Tous</option>
                      <option value={PaymentMethod.CASH}>Espèces</option>
                      <option value={PaymentMethod.CARD}>Carte</option>
                      <option value={PaymentMethod.INSURANCE}>Assurance</option>
                      <option value={PaymentMethod.MIXED}>Mixte</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => {
                        setFilterDateFrom(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => {
                        setFilterDateTo(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>

                  <div className="col-span-full flex justify-end">
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Liste des ventes */}
        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48"></div>
              </div>
            ))}
          </div>
        ) : !salesData?.data.length ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid gap-4">
              {salesData.data.map((sale) => (
                <SaleCard key={sale.id} sale={sale} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              totalItems={salesData.total}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(newSize) => {
                setItemsPerPage(newSize);
                setCurrentPage(1);
              }}
              showItemsPerPage
            />
          </>
        )}
      </div>

      {/* Modals */}
      {selectedSale && (
        <>
          <RefundModal
            isOpen={isRefundModalOpen}
            onClose={() => {
              setIsRefundModalOpen(false);
              setSelectedSale(null);
            }}
            sale={selectedSale}
            onConfirm={(reason) =>
              refundMutation.mutate({ id: selectedSale.id, reason })
            }
            isLoading={refundMutation.isPending}
          />

          <DeleteSaleModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedSale(null);
            }}
            sale={selectedSale}
            onConfirm={() => deleteMutation.mutate(selectedSale.id)}
            isLoading={deleteMutation.isPending}
          />

          <PrintReceiptModal
            isOpen={isPrintModalOpen}
            onClose={() => {
              setIsPrintModalOpen(false);
              setSelectedSale(null);
            }}
            sale={selectedSale}
          />
        </>
      )}
    </Layout>
  );
};

export default SalesPage;
