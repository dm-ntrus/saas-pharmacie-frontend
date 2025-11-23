"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowLeftIcon,
  PencilIcon,
  CubeIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PlusIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/design-system";
import { apiClient } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useAuth";
import { UserRole, StockMovementType, DEASchedule } from "@/types";
import { CreateBatchModal } from "@/components/inventory/CreateBatchModal";
import { AdjustBatchQuantityModal } from "@/components/inventory/AdjustBatchQuantityModal";
import { Pagination } from "@/components/Pagination";
import { useParams, useRouter } from "next/navigation";

export const ProductDetailPage = () => {
  useRequireAuth([UserRole.ADMIN, UserRole.PHARMACIST, UserRole.TECHNICIAN]);
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<
    "info" | "batches" | "movements" | "pricing"
  >("info");
  const [showCreateBatch, setShowCreateBatch] = useState(false);
  const [showAdjustQuantity, setShowAdjustQuantity] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  // Pagination pour les mouvements
  const [movementsPage, setMovementsPage] = useState(1);
  const [movementsPerPage, setMovementsPerPage] = useState(20);

  // Fetch product data
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => apiClient.getProduct(id as string),
    enabled: !!id,
  });

  const { data: stockSummary } = useQuery({
    queryKey: ["product-stock-summary", id],
    queryFn: () => apiClient.getProductStockSummary(id as string),
    enabled: !!id,
  });

  const { data: batches } = useQuery({
    queryKey: ["product-batches", id],
    queryFn: () => apiClient.getBatches({ productId: id as string }),
    enabled: !!id,
  });

  // Utilisation correcte des logs des substances contrôlées pour les mouvements
  const { data: movementsData } = useQuery({
    queryKey: [
      "product-controlled-substance-logs",
      id,
      movementsPage,
      movementsPerPage,
    ],
    queryFn: () =>
      apiClient.getControlledSubstanceLogs({
        productId: id as string,
        page: movementsPage,
        limit: movementsPerPage,
      }),
    enabled: !!id && activeTab === "movements",
  });

  const movements = movementsData?.data || [];
  const totalMovements = movementsData?.total || 0;
  const totalMovementPages = movementsData?.totalPages || 1;

  const getStockStatus = () => {
    if (!stockSummary) return { label: "Chargement...", color: "gray" };

    const current = stockSummary.currentStock || 0;
    const min = stockSummary.minStock || 0;

    if (current === 0) {
      return { label: "Rupture", color: "red" };
    } else if (current <= min) {
      return { label: "Stock faible", color: "red" };
    } else if (current <= (stockSummary.reorderPoint || min * 1.5)) {
      return { label: "Stock critique", color: "yellow" };
    }
    return { label: "Stock normal", color: "green" };
  };

  const getActionLabel = (action: string) => {
    const actions: Record<string, string> = {
      dispense: "Dispensation",
      receive: "Réception",
      adjustment: "Ajustement",
      destruction: "Destruction",
      transfer: "Transfert",
      sale: "Vente",
      purchase: "Achat",
      return: "Retour",
      damage: "Détérioration",
      expiration: "Expiration",
    };
    return actions[action] || action;
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      dispense: "bg-blue-100 text-blue-800",
      receive: "bg-green-100 text-green-800",
      adjustment: "bg-yellow-100 text-yellow-800",
      destruction: "bg-red-100 text-red-800",
      transfer: "bg-purple-100 text-purple-800",
      sale: "bg-indigo-100 text-indigo-800",
      purchase: "bg-emerald-100 text-emerald-800",
    };
    return colors[action] || "bg-gray-100 text-gray-800";
  };

  const stockStatus = getStockStatus();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="h-96 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-600">Produit non trouvé</p>
          <Button onClick={() => router.push("/inventory")} className="mt-4">
            Retour à l'inventaire
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Mock data for stock chart
  const stockChartData = [
    { date: "Jan", stock: 450 },
    { date: "Fév", stock: 420 },
    { date: "Mar", stock: 480 },
    { date: "Avr", stock: 430 },
    { date: "Mai", stock: 460 },
    { date: "Juin", stock: stockSummary?.currentStock || 450 },
  ];

  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/inventory">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Retour
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="text-gray-600">SKU: {product.sku}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/inventory/products/${id}/edit`}>
                <PencilIcon className="h-4 w-4 mr-2" />
                Modifier
              </Link>
            </Button>
            <Button onClick={() => setShowCreateBatch(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Nouveau lot
            </Button>
          </div>
        </div>

        {/* Stock Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Stock actuel</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stockSummary?.currentStock || 0}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    stockStatus.color === "red"
                      ? "bg-red-500"
                      : stockStatus.color === "yellow"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                >
                  <CubeIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <span
                className={`mt-2 inline-block text-xs px-2 py-1 rounded-full ${
                  stockStatus.color === "red"
                    ? "bg-red-100 text-red-800"
                    : stockStatus.color === "yellow"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {stockStatus.label}
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Stock minimum</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stockSummary?.minStock || 0}
                  </p>
                </div>
                <div className="p-3 bg-orange-500 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Point de commande</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stockSummary?.reorderPoint || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-500 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Valeur totale</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${stockSummary?.totalValue?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="p-3 bg-green-500 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "info", label: "Informations" },
              { id: "batches", label: "Lots" },
              { id: "movements", label: "Historique" },
              { id: "pricing", label: "Prix et marges" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-sky-600 text-sky-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "info" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-medium">{product.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">SKU</p>
                  <p className="font-medium">{product.sku}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Catégorie</p>
                  <p className="font-medium">{product.category || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-medium">{product.description || "N/A"}</p>
                </div>
                {product.barcode && (
                  <div>
                    <p className="text-sm text-gray-500">Code-barres</p>
                    <p className="font-medium">{product.barcode}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Détails médicaux</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Fabricant</p>
                    <p className="font-medium">{product.manufacturer}</p>
                  </div>
                  {product.activeIngredient && (
                    <div>
                      <p className="text-sm text-gray-500">Ingrédient actif</p>
                      <p className="font-medium">{product.activeIngredient}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Force/Dosage</p>
                    <p className="font-medium">{product.strength || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Forme posologique</p>
                    <p className="font-medium">{product.dosageForm || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prescription</p>
                    <p className="font-medium">
                      {product.requiresPrescription ? "Requise" : "Non requise"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Évolution du stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={stockChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="stock"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "batches" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lots disponibles</CardTitle>
                <Button
                  onClick={() => setShowCreateBatch(true)}
                  size="sm"
                  icon={<PlusIcon className="h-4 w-4" />}
                >
                  Nouveau lot
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {batches && batches.data.length > 0 ? (
                <div className="space-y-4">
                  {batches.data.map((batch: any) => (
                    <div
                      key={batch.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">
                            Lot #{batch.batchNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            Stock: {batch.quantity} unités
                          </p>
                          <p className="text-sm text-gray-600">
                            Expiration:{" "}
                            {new Date(batch.expiryDate).toLocaleDateString(
                              "fr-FR"
                            )}
                          </p>
                          <p className="text-sm text-gray-600">
                            Coût unitaire: $
                            {batch.unitCost?.toFixed(2) || "0.00"}
                          </p>
                          {batch.supplier && (
                            <p className="text-sm text-gray-600">
                              Fournisseur: {batch.supplier}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBatch(batch);
                            setShowAdjustQuantity(true);
                          }}
                        >
                          Ajuster
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucun lot disponible</p>
                  <Button
                    onClick={() => setShowCreateBatch(true)}
                    className="mt-4"
                    size="sm"
                  >
                    Créer le premier lot
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "movements" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historique des mouvements</CardTitle>
              </CardHeader>
              <CardContent>
                {movements.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Action
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Quantité
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Lot
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Utilisateur
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Notes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {movements.map((movement: any) => (
                            <tr key={movement.id}>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {new Date(movement.createdAt).toLocaleString(
                                  "fr-FR"
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getActionColor(
                                    movement.action
                                  )}`}
                                >
                                  {getActionLabel(movement.action)}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                <span
                                  className={
                                    movement.quantity > 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {movement.quantity > 0 ? "+" : ""}
                                  {movement.quantity}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {movement.batch?.batchNumber || "N/A"}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {movement.user
                                  ? `${movement.user.firstName} ${movement.user.lastName}`
                                  : "N/A"}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {movement.notes || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination pour les mouvements */}
                    {totalMovementPages > 1 && (
                      <div className="mt-6">
                        <Pagination
                          currentPage={movementsPage}
                          totalPages={totalMovementPages}
                          totalItems={totalMovements}
                          itemsPerPage={movementsPerPage}
                          onPageChange={setMovementsPage}
                          onItemsPerPageChange={setMovementsPerPage}
                          showItemsPerPage
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aucun mouvement enregistré</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Prix et coûts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Prix de vente unitaire
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${product.costPrice?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prix d'achat unitaire</p>
                  <p className="text-xl font-medium text-gray-900">
                    ${product.price?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Coût moyen pondéré</p>
                  <p className="text-xl font-medium text-gray-900">
                    ${stockSummary?.averageCost?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Taux de TVA</p>
                  <p className="text-xl font-medium text-gray-900">
                    {stockSummary?.averageCost
                      ? (
                          (((product.price || 0) - stockSummary.averageCost) /
                            stockSummary.averageCost) *
                          100
                        ).toFixed(1)
                      : "0"}
                    %%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Marges et rentabilité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Marge unitaire brute</p>
                  <p className="text-xl font-medium text-green-600">
                    $
                    {((product.costPrice || 0) - (product.price || 0)).toFixed(
                      2
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Marge brute (%)</p>
                  <p className="text-xl font-medium text-green-600">
                    {product.price
                      ? (
                          (((product.costPrice || 0) - product.price) /
                            product.price) *
                          100
                        ).toFixed(1)
                      : "0"}
                    %
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    Valeur totale du stock
                  </p>
                  <p className="text-xl font-medium text-blue-600">
                    ${stockSummary?.totalValue?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rotation prévue</p>
                  <p className="text-xl font-medium text-gray-900">
                    {stockSummary?.turnoverRate || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateBatchModal
        isOpen={showCreateBatch}
        onClose={() => setShowCreateBatch(false)}
        productId={id as string}
        onConfirm={() => {
          queryClient.invalidateQueries({ queryKey: ["product-batches", id] });
          queryClient.invalidateQueries({
            queryKey: ["product-stock-summary", id],
          });
          setShowCreateBatch(false);
        }}
      />

      {selectedBatch && (
        <AdjustBatchQuantityModal
          isOpen={showAdjustQuantity}
          onClose={() => {
            setShowAdjustQuantity(false);
            setSelectedBatch(null);
          }}
          batch={selectedBatch}
          userId="current-user-id"
          onConfirm={() => {
            queryClient.invalidateQueries({
              queryKey: ["product-batches", id],
            });
            queryClient.invalidateQueries({
              queryKey: ["product-stock-summary", id],
            });
            queryClient.invalidateQueries({
              queryKey: ["product-controlled-substance-logs", id],
            });
            setShowAdjustQuantity(false);
            setSelectedBatch(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;
