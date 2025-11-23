"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
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
import { UserRole, ProductType, ProductStatus } from "@/types";
import { toast } from "react-hot-toast";
import { DeleteProductModal } from "@/components/inventory/DeleteProductModal";
import { usePagination } from "@/hooks/usePerformance";

const ProductsPage: React.FC = () => {
  useRequireAuth([UserRole.ADMIN, UserRole.PHARMACIST, UserRole.TECHNICIAN]);

  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [filterType, setFilterType] = useState<ProductType | "">("");
  const [filterStatus, setFilterStatus] = useState<ProductStatus>(
    ProductStatus.ACTIVE
  );
  const [filterManufacturer, setFilterManufacturer] = useState("");
  const [filterPrescription, setFilterPrescription] = useState<
    boolean | undefined
  >();
  const [filterLowStock, setFilterLowStock] = useState(false);

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch products
  const { data: productsData, isLoading } = useQuery({
    queryKey: [
      "products",
      currentPage,
      itemsPerPage,
      searchTerm,
      filterType,
      filterStatus,
      filterManufacturer,
      filterPrescription,
      filterLowStock,
    ],
    queryFn: () =>
      apiClient.getProducts({
        search: searchTerm,
        page: currentPage,
        limit: itemsPerPage,
        type: filterType || undefined,
        status: filterStatus,
        manufacturer: filterManufacturer || undefined,
        requiresPrescription: filterPrescription,
        lowStock: filterLowStock,
      }),
  });

  const pagination = usePagination(
    productsData?.total || 0,
    itemsPerPage,
    currentPage
  );

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteProduct(id),
    onSuccess: () => {
      toast.success("Produit supprimé avec succès!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Erreur lors de la suppression"
      );
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status: ProductStatus) => {
    const colors = {
      [ProductStatus.ACTIVE]: "bg-green-100 text-green-800",
      [ProductStatus.DISCONTINUED]: "bg-red-100 text-red-800",
      [ProductStatus.OUT_OF_STOCK]: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: ProductStatus) => {
    const labels = {
      [ProductStatus.ACTIVE]: "Actif",
      [ProductStatus.DISCONTINUED]: "Discontinué",
      [ProductStatus.OUT_OF_STOCK]: "Rupture",
    };
    return labels[status] || status;
  };

  const getStockStatus = (product: any) => {
    const stock = product.currentStock || 0;
    const min = product.minStockLevel || 0;
    const reorder = product.reorderPoint || 0;

    if (stock === 0) return { color: "text-red-600", label: "Rupture" };
    if (stock <= min) return { color: "text-red-600", label: "Critique" };
    if (stock <= reorder) return { color: "text-yellow-600", label: "Faible" };
    return { color: "text-green-600", label: "Normal" };
  };

  const resetFilters = () => {
    setFilterType("");
    setFilterStatus(ProductStatus.ACTIVE);
    setFilterManufacturer("");
    setFilterPrescription(undefined);
    setFilterLowStock(false);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (!productsData?.products) return;

    const csvContent = [
      ["Nom", "SKU", "Type", "Fabricant", "Stock", "Prix", "Statut"],
      ...productsData.products.map((product) => [
        product.name,
        product.sku,
        product.type,
        product.manufacturer,
        product.currentStock || 0,
        product.price,
        product.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `produits-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Statistics
  const stats = [
    {
      title: "Total Produits",
      value: productsData?.total || 0,
      icon: CubeIcon,
      color: "bg-blue-500",
    },
    {
      title: "Stock Faible",
      value:
        productsData?.products.filter(
          (p) => (p.currentStock || 0) <= (p.reorderPoint || 0)
        ).length || 0,
      icon: ExclamationTriangleIcon,
      color: "bg-yellow-500",
    },
    {
      title: "Rupture",
      value:
        productsData?.products.filter((p) => (p.currentStock || 0) === 0)
          .length || 0,
      icon: ExclamationTriangleIcon,
      color: "bg-red-500",
    },
    {
      title: "Valeur Stock",
      value: formatCurrency(
        productsData?.products.reduce(
          (sum, p) => sum + (p.currentStock || 0) * (p.costPrice || 0),
          0
        ) || 0
      ),
      icon: CubeIcon,
      color: "bg-green-500",
    },
  ];

  const EmptyState = () => (
    <div className="text-center py-12">
      <CubeIcon className="h-12 w-12 text-gray-400 mx-auto" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun produit</h3>
      <p className="mt-1 text-sm text-gray-500">
        Commencez par ajouter un nouveau produit à l'inventaire.
      </p>
      <div className="mt-6">
        <Button asChild icon={<PlusIcon className="h-4 w-4" />}>
          <Link href="/inventory/products/new">Ajouter un produit</Link>
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestion des Produits
            </h1>
            <p className="text-gray-600">
              Gérez votre inventaire pharmaceutique
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" asChild>
              <Link href="/inventory/reports">Rapports</Link>
            </Button>
            {/* <Button variant="outline" asChild>
              <Link href="/inventory/controlled-substances">Historiques</Link>
            </Button> */}
            <Button variant="outline" asChild>
              <Link href="/inventory/locations">Gérer les emplacements</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/inventory/alerts">Gérer les alertes</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/inventory/batches">Gérer les lots</Link>
            </Button>
            <Button asChild icon={<PlusIcon className="h-4 w-4" />}>
              <Link href="/inventory/products/new">Ajouter un produit</Link>
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

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Rechercher par nom, SKU ou code-barres..."
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

              {/* Advanced Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={filterType}
                      onChange={(e) => {
                        setFilterType(e.target.value as ProductType | "");
                        setCurrentPage(1);
                      }}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                    >
                      <option value="">Tous</option>
                      <option value={ProductType.MEDICATION}>Médicament</option>
                      <option value={ProductType.OTC}>Sans ordonnance</option>
                      <option value={ProductType.MEDICAL_DEVICE}>
                        Dispositif médical
                      </option>
                      <option value={ProductType.SUPPLEMENT}>Complément</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statut
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => {
                        setFilterStatus(e.target.value as ProductStatus);
                        setCurrentPage(1);
                      }}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                    >
                      <option value={ProductStatus.ACTIVE}>Actif</option>
                      <option value={ProductStatus.DISCONTINUED}>
                        Discontinué
                      </option>
                      <option value={ProductStatus.OUT_OF_STOCK}>
                        Rupture
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fabricant
                    </label>
                    <input
                      type="text"
                      value={filterManufacturer}
                      onChange={(e) => {
                        setFilterManufacturer(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                      placeholder="Filtrer par fabricant"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prescription
                    </label>
                    <select
                      value={
                        filterPrescription === undefined
                          ? ""
                          : filterPrescription.toString()
                      }
                      onChange={(e) => {
                        setFilterPrescription(
                          e.target.value === ""
                            ? undefined
                            : e.target.value === "true"
                        );
                        setCurrentPage(1);
                      }}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                    >
                      <option value="">Tous</option>
                      <option value="true">Requis</option>
                      <option value="false">Non requis</option>
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
                        className="w-5 h-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                      />
                      <span className="text-sm text-gray-700">
                        Stock faible uniquement
                      </span>
                    </label>
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

        {/* Products Table */}
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
        ) : !productsData?.products.length ? (
          <EmptyState />
        ) : (
          <>
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Produit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Prix
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Fabricant
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
                    {productsData.products.map((product) => {
                      const stockStatus = getStockStatus(product);
                      return (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                SKU: {product.sku}
                                {product.barcode && ` | ${product.barcode}`}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {product.type}
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {product.currentStock || 0}
                              </div>
                              <div className={`text-xs ${stockStatus.color}`}>
                                {stockStatus.label}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {formatCurrency(product.price)}
                              </div>
                              <div className="text-xs text-gray-500">
                                Coût: {formatCurrency(product.costPrice)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {product.manufacturer}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                product.status
                              )}`}
                            >
                              {getStatusLabel(product.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link
                                  href={`/inventory/products/${product.id}`}
                                >
                                  Détails
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                icon={<PencilIcon className="h-4 w-4" />}
                              >
                                <Link
                                  href={`/inventory/products/${product.id}/edit`}
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setIsDeleteModalOpen(true);
                                }}
                              >
                                <TrashIcon className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
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
              totalItems={productsData.total}
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

      {/* Delete Modal */}
      {selectedProduct && (
        <DeleteProductModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onConfirm={() => deleteMutation.mutate(selectedProduct.id)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};

export default ProductsPage;
