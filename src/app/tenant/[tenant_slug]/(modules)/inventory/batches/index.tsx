"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Package,
  Clock,
  AlertTriangle,
  SlidersVertical,
  Download,
  Filter,
} from "lucide-react";
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/design-system";
import { Pagination } from "@/components/Pagination";
import { apiClient } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useAuth";
import { UserRole, BatchStatus } from "@/types";
import { toast } from "react-hot-toast";
import { usePagination } from "@/hooks/usePerformance";
import { CreateBatchModal } from "@/components/inventory/CreateBatchModal";
import { AdjustBatchQuantityModal } from "@/components/inventory/AdjustBatchQuantityModal";

const BatchesPage: React.FC = () => {
  const user = useRequireAuth([
    UserRole.ADMIN,
    UserRole.PHARMACIST,
    UserRole.TECHNICIAN,
  ]);

  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState<BatchStatus | "">("");
  const [filterExpiringDays, setFilterExpiringDays] = useState("");
  const [filterLowStock, setFilterLowStock] = useState(false);

  // Modals
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  // Fetch batches
  const { data: batchesData, isLoading } = useQuery({
    queryKey: [
      "batches",
      currentPage,
      itemsPerPage,
      searchTerm,
      filterStatus,
      filterExpiringDays,
      filterLowStock,
    ],
    queryFn: () =>
      apiClient.getBatches({
        page: currentPage,
        limit: itemsPerPage,
        status: filterStatus || undefined,
        expiringDays: filterExpiringDays
          ? parseInt(filterExpiringDays)
          : undefined,
        lowStock: filterLowStock || undefined,
      }),
  });

  const pagination = usePagination(
    batchesData?.total || 0,
    itemsPerPage,
    currentPage
  );

  // Adjust quantity mutation
  const adjustQuantityMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.adjustBatchQuantity(id, data),
    onSuccess: () => {
      toast.success("Quantité ajustée avec succès!");
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsAdjustModalOpen(false);
      setSelectedBatch(null);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Erreur lors de l'ajustement"
      );
    },
  });

  const handleExport = () => {
    if (!batchesData?.data) return;

    const csvContent = [
      ["Numéro"],
      ...batchesData.data.map((patient) => [patient.patientNumber]),
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

  const getStatusColor = (status: BatchStatus) => {
    const colors = {
      [BatchStatus.ACTIVE]: "bg-green-100 text-green-800",
      [BatchStatus.EXPIRED]: "bg-red-100 text-red-800",
      [BatchStatus.DAMAGED]: "bg-orange-100 text-orange-800",
      [BatchStatus.RECALLED]: "bg-purple-100 text-purple-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: BatchStatus) => {
    const labels = {
      [BatchStatus.ACTIVE]: "Actif",
      [BatchStatus.EXPIRED]: "Expiré",
      [BatchStatus.DAMAGED]: "Endommagé",
      [BatchStatus.RECALLED]: "Rappelé",
    };
    return labels[status] || status;
  };

  const getExpirationStatus = (expirationDate: string) => {
    const now = new Date();
    const expiry = new Date(expirationDate);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry < 0) {
      return { color: "text-red-600", label: "Expiré", days: daysUntilExpiry };
    } else if (daysUntilExpiry <= 30) {
      return {
        color: "text-red-600",
        label: `${daysUntilExpiry}j restants`,
        days: daysUntilExpiry,
      };
    } else if (daysUntilExpiry <= 90) {
      return {
        color: "text-yellow-600",
        label: `${daysUntilExpiry}j restants`,
        days: daysUntilExpiry,
      };
    }
    return {
      color: "text-green-600",
      label: `${daysUntilExpiry}j restants`,
      days: daysUntilExpiry,
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Statistics
  const stats = [
    {
      title: "Total Lots",
      value: batchesData?.total || 0,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Expirant < 30j",
      value:
        batchesData?.batches.filter((b) => {
          const status = getExpirationStatus(b.expirationDate);
          return status.days >= 0 && status.days <= 30;
        }).length || 0,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Expirés",
      value:
        batchesData?.batches.filter((b) => b.status === BatchStatus.EXPIRED)
          .length || 0,
      icon: AlertTriangle,
      color: "bg-red-500",
    },
    {
      title: "Valeur Totale",
      value: formatCurrency(
        batchesData?.batches.reduce(
          (sum, b) => sum + b.currentQuantity * b.unitCost,
          0
        ) || 0
      ),
      icon: Package,
      color: "bg-green-500",
    },
  ];

  const EmptyState = () => (
    <div className="text-center py-12">
      <Package className="h-12 w-12 text-gray-400 mx-auto" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun lot</h3>
      <p className="mt-1 text-sm text-gray-500">
        Commencez par ajouter un nouveau lot.
      </p>
      <div className="mt-6">
        <Button icon={<Plus className="h-4 w-4" />}>
          <Link href="/inventory/batches/new">Créer un lot</Link>
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestion des Lots
            </h1>
            <p className="text-gray-600">
              Suivez les lots de produits et leurs dates d'expiration
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button variant="outline" asChild>
              <Link href="/inventory">Voir les produits</Link>
            </Button>
            <Button icon={<Plus className="h-4 w-4" />}>
              <Link href="/inventory/batches/new">Nouveau lot</Link>
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {typeof stat.value === "number" ? stat.value : stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Rechercher par numéro de lot, fournisseur..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    icon={<Search className="h-5 w-5" />}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  icon={<Filter className="h-5 w-5" />}
                >
                  Filtres
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  icon={<Download className="h-5 w-5" />}
                >
                  Exporter
                </Button>
              </div>
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statut
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => {
                        setFilterStatus(e.target.value as BatchStatus | "");
                        setCurrentPage(1);
                      }}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="">Tous</option>
                      <option value={BatchStatus.ACTIVE}>Actif</option>
                      <option value={BatchStatus.EXPIRED}>Expiré</option>
                      <option value={BatchStatus.DAMAGED}>Endommagé</option>
                      <option value={BatchStatus.RECALLED}>Rappelé</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration dans
                    </label>
                    <select
                      value={filterExpiringDays}
                      onChange={(e) => {
                        setFilterExpiringDays(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="">Tous</option>
                      <option value="7">7 jours</option>
                      <option value="30">30 jours</option>
                      <option value="60">60 jours</option>
                      <option value="90">90 jours</option>
                    </select>
                  </div>

                  <div className="flex items-center sm:mt-5">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterLowStock}
                        onChange={(e) => {
                          setFilterLowStock(e.target.checked);
                          setCurrentPage(1);
                        }}
                        className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">
                        Stock faible uniquement
                      </span>
                    </label>
                  </div>

                  <div className="flex items-end justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFilterStatus("");
                        setFilterExpiringDays("");
                        setFilterLowStock(false);
                        setCurrentPage(1);
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Batches Table */}
        {isLoading ? (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded h-16"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : !batchesData?.batches.length ? (
          <EmptyState />
        ) : (
          <>
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Produit / Lot
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Expiration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Valeur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {batchesData.batches.map((batch) => {
                      const expirationStatus = getExpirationStatus(
                        batch.expirationDate
                      );
                      return (
                        <tr key={batch.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {batch.product?.name || "N/A"}
                              </div>
                              <div className="text-sm text-gray-500">
                                Lot: {batch.batchNumber}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {batch.currentQuantity} unités
                              </div>
                              {batch.reservedQuantity > 0 && (
                                <div className="text-xs text-gray-500">
                                  {batch.reservedQuantity} réservées
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              <div>
                                Fab:{" "}
                                {new Date(
                                  batch.manufactureDate
                                ).toLocaleDateString("fr-FR")}
                              </div>
                              <div className="text-gray-500">
                                Reçu:{" "}
                                {new Date(
                                  batch.receivedDate
                                ).toLocaleDateString("fr-FR")}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm text-gray-900">
                                {new Date(
                                  batch.expirationDate
                                ).toLocaleDateString("fr-FR")}
                              </div>
                              <div
                                className={`text-xs font-medium ${expirationStatus.color}`}
                              >
                                {expirationStatus.label}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {formatCurrency(
                                  batch.currentQuantity * batch.unitCost
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatCurrency(batch.unitCost)}/unité
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                batch.status
                              )}`}
                            >
                              {getStatusLabel(batch.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBatch(batch);
                                setIsAdjustModalOpen(true);
                              }}
                              icon={
                                <SlidersVertical className="h-4 w-4" />
                              }
                            >
                              Ajuster
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              totalItems={batchesData.total}
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

      {selectedBatch && (
        <AdjustBatchQuantityModal
          isOpen={isAdjustModalOpen}
          onClose={() => {
            setIsAdjustModalOpen(false);
            setSelectedBatch(null);
          }}
          batch={selectedBatch}
          onConfirm={(data) =>
            adjustQuantityMutation.mutate({ id: selectedBatch.id, data })
          }
          isLoading={adjustQuantityMutation.isPending}
          userId={user?.id || ""}
        />
      )}
    </div>
  );
};

export default BatchesPage;
