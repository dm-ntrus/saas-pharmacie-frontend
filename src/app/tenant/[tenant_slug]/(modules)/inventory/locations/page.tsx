"use client";
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  PlusIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  ArchiveBoxIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Modal,
} from "@/design-system";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useAuth";
import { UserRole, InventoryLocationType } from "@/types";
import { toast } from "react-hot-toast";
import { Pagination } from "@/components/Pagination";
import { usePagination } from "@/hooks/usePerformance";

const locationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Minimum 3 caractères")
    .required("Le nom est requis"),
  type: Yup.string().required("Le type est requis"),
  displayCategory: Yup.string().optional(),
  description: Yup.string().optional(),
});

const InventoryLocationsPage: React.FC = () => {
  useRequireAuth([UserRole.ADMIN, UserRole.PHARMACIST, UserRole.TECHNICIAN]);

  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    search: "",
    page: 1,
    limit: 20,
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: locationsData, isLoading } = useQuery({
    queryKey: ["inventory-locations", filters],
    queryFn: () => apiClient.getInventoryLocations(filters),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiClient.createInventoryLocation(data),
    onSuccess: () => {
      toast.success("Emplacement créé avec succès!");
      queryClient.invalidateQueries({ queryKey: ["inventory-locations"] });
      setIsCreateModalOpen(false);
    },
    onError: () => {
      toast.error("Erreur lors de la création");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.updateInventoryLocation(id, data),
    onSuccess: () => {
      toast.success("Emplacement mis à jour!");
      queryClient.invalidateQueries({ queryKey: ["inventory-locations"] });
      setEditingLocation(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteInventoryLocation(id),
    onSuccess: () => {
      toast.success("Emplacement supprimé!");
      queryClient.invalidateQueries({ queryKey: ["inventory-locations"] });
    },
  });

  const pagination = usePagination(
    locationsData?.total || 0,
    filters.limit,
    filters.page
  );

  // Obtenir toutes les catégories uniques pour le filtre
  const categories = useMemo(() => {
    if (!locationsData?.locations) return [];
    const uniqueCategories = new Set(
      locationsData?.locations
        .map((location) => location.displayCategory)
        .filter(Boolean)
        .sort()
    );
    return Array.from(uniqueCategories);
  }, [locationsData]);

  const getLocationIcon = (type: InventoryLocationType) => {
    const icons = {
      [InventoryLocationType.SHELF]: ArchiveBoxIcon,
      [InventoryLocationType.REFRIGERATOR]: BuildingStorefrontIcon,
      [InventoryLocationType.FREEZER]: TruckIcon,
      [InventoryLocationType.COUNTER]: MapPinIcon,
      [InventoryLocationType.WAREHOUSE]: BuildingStorefrontIcon,
    };
    return icons[type] || MapPinIcon;
  };

  const getLocationTypeLabel = (type: InventoryLocationType) => {
    const labels = {
      [InventoryLocationType.SHELF]: "Rayon",
      [InventoryLocationType.REFRIGERATOR]: "Réfrigérateur",
      [InventoryLocationType.FREEZER]: "Congélateur",
      [InventoryLocationType.COUNTER]: "Comptoir",
      [InventoryLocationType.WAREHOUSE]: "Entrepôt",
    };
    return labels[type] || type;
  };

  const resetFilters = () => {
    setFilters({ ...filters, type: "", category: "", search: "" });
  };

  const hasActiveFilters = filters.type || filters.category || filters.search;

  const CreateLocationModal = () => (
    <Modal
      isOpen={isCreateModalOpen}
      onClose={() => setIsCreateModalOpen(false)}
      title="Nouvel emplacement"
      size="lg"
    >
      <Formik
        initialValues={{
          name: "",
          type: InventoryLocationType.SHELF,
          displayCategory: "",
          description: "",
        }}
        validationSchema={locationSchema}
        onSubmit={(values) => createMutation.mutate(values)}
      >
        {() => (
          <Form className="space-y-4">
            <div>
              <Field
                as={Input}
                name="name"
                label="Nom"
                required
                placeholder="Ex: Rayon A, Réfrigérateur principal..."
              />
              <ErrorMessage
                name="name"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-600">*</span>
              </label>
              <Field
                as="select"
                name="type"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {Object.values(InventoryLocationType).map((type) => {
                  const Icon = getLocationIcon(type);
                  return (
                    <option key={type} value={type}>
                      {getLocationTypeLabel(type)}
                    </option>
                  );
                })}
              </Field>
            </div>

            <div>
              <Field
                as={Input}
                name="displayCategory"
                label="Catégorie d'affichage"
                placeholder="Ex: Médicaments, Soins..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Description de l'emplacement..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                loading={createMutation.isPending}
                className="flex-1"
              >
                Créer l'emplacement
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );

  const EditLocationModal = () => (
    <Modal
      isOpen={!!editingLocation}
      onClose={() => setEditingLocation(null)}
      title="Modifier l'emplacement"
      size="lg"
    >
      <Formik
        initialValues={editingLocation || {}}
        validationSchema={locationSchema}
        onSubmit={(values) =>
          updateMutation.mutate({ id: editingLocation.id, data: values })
        }
      >
        {() => (
          <Form className="space-y-4">
            <div>
              <Field as={Input} name="name" label="Nom" required />
              <ErrorMessage
                name="name"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-600">*</span>
              </label>
              <Field
                as="select"
                name="type"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {Object.values(InventoryLocationType).map((type) => (
                  <option key={type} value={type}>
                    {getLocationTypeLabel(type)}
                  </option>
                ))}
              </Field>
            </div>

            <div>
              <Field
                as={Input}
                name="displayCategory"
                label="Catégorie d'affichage"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingLocation(null)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                loading={updateMutation.isPending}
                className="flex-1"
              >
                Mettre à jour
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );

  const LocationCard = ({ location }: { location: any }) => {
    const Icon = getLocationIcon(location.type);

    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Icon className="h-8 w-8 text-sky-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {location.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                    {getLocationTypeLabel(location.type)}
                  </span>
                  {location.displayCategory && (
                    <span className="ml-2 text-gray-600">
                      • {location.displayCategory}
                    </span>
                  )}
                </p>
                {location.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {location.description}
                  </p>
                )}
                <div className="mt-3 text-sm text-gray-500">
                  <p>
                    Créé le{" "}
                    {new Date(location.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon={<PencilIcon className="h-4 w-4" />}
                onClick={() => setEditingLocation(location)}
              >
                Modifier
              </Button>
              <Button
                variant="destructive"
                size="sm"
                icon={<TrashIcon className="h-4 w-4" />}
                onClick={() => {
                  if (
                    confirm(
                      "Êtes-vous sûr de vouloir supprimer cet emplacement?"
                    )
                  ) {
                    deleteMutation.mutate(location.id);
                  }
                }}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Emplacements d'inventaire
          </h1>
          <p className="text-gray-600">
            Gérez les différents emplacements de stockage de votre pharmacie
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" asChild>
            <Link href="/inventory">Voir les produits</Link>
          </Button>
          <Button
            icon={<PlusIcon className="h-4 w-4" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Nouvel emplacement
          </Button>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Barre de recherche */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher par nom, description ou catégorie..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
              <Button
                variant="outline"
                icon={<FunnelIcon className="h-4 w-4" />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filtres
              </Button>
            </div>

            {/* Filtres avancés */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                {/* Filtre par type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'emplacement
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) =>
                      setFilters({ ...filters, type: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 bg-white px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                  >
                    <option value="">Tous les types</option>
                    {Object.values(InventoryLocationType).map((type) => (
                      <option key={type} value={type}>
                        {getLocationTypeLabel(type)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtre par catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      setFilters({ ...filters, category: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 bg-white px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end justify-end">
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    Réinitialiser les filtres
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Liste des emplacements */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48"></div>
            </div>
          ))}
        </div>
      ) : !locationsData?.locations.length ? (
        <div className="text-center py-12">
          <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {hasActiveFilters
              ? "Aucun emplacement trouvé"
              : "Aucun emplacement"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {hasActiveFilters
              ? "Essayez de modifier vos critères de recherche ou de filtrage."
              : "Commencez par créer votre premier emplacement d'inventaire."}
          </p>
          <div className="mt-6">
            {hasActiveFilters ? (
              <Button variant="outline" onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            ) : (
              <Button
                icon={<PlusIcon className="h-4 w-4" />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Nouvel emplacement
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {locationsData?.locations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>

          {/* Pagination */}
          {locationsData && locationsData.total > filters.limit && (
            <Pagination
              currentPage={filters.page}
              totalPages={pagination.totalPages}
              totalItems={locationsData.total}
              itemsPerPage={filters.limit}
              onPageChange={(page) => setFilters({ ...filters, page })}
              onItemsPerPageChange={(limit) =>
                setFilters({ ...filters, limit, page: 1 })
              }
              showItemsPerPage
            />
          )}
        </>
      )}

      {/* Modals */}
      <CreateLocationModal />
      <EditLocationModal />
    </div>
  );
};

export default InventoryLocationsPage;
