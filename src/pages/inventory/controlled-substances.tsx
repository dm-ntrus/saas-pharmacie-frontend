// pages/inventory/controlled-substances.tsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  XMarkIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import Layout from "@/components/layout/Layout";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Modal,
} from "@/design-system";
import { apiClient } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useAuth";
import { UserRole, DEASchedule, type ControlledSubstanceLog } from "@/types";
import { toast } from "react-hot-toast";
import { Pagination } from "@/components/Pagination";

const ControlledSubstancesPage: React.FC = () => {
  useRequireAuth([UserRole.ADMIN, UserRole.PHARMACIST]);

  const router = useRouter();
  
  // États pour la pagination et les filtres
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filters, setFilters] = useState({
    productId: "",
    batchId: "",
    action: "",
    deaSchedule: "",
    dateFrom: "",
    dateTo: "",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ControlledSubstanceLog | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);

  // Query pour récupérer les logs avec filtres et pagination
  const { data: logsData, isLoading } = useQuery({
    queryKey: ["controlled-substance-logs", currentPage, itemsPerPage, filters],
    queryFn: () =>
      apiClient.getControlledSubstanceLogs({
        page: currentPage,
        limit: itemsPerPage,
        productId: filters.productId || undefined,
        batchId: filters.batchId || undefined,
        action: filters.action || undefined,
        deaSchedule: filters.deaSchedule as DEASchedule || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        search: filters.search || undefined,
      }),
  });

  const logs = logsData?.data || [];
  const totalItems = logsData?.total || 0;
  const totalPages = logsData?.totalPages || 1;

  // Query pour récupérer les produits et lots pour les filtres (optionnel)
  const { data: productsData } = useQuery({
    queryKey: ["products-for-filters"],
    queryFn: () => apiClient.getProducts({ limit: 1000 }),
  });

  // Actions disponibles pour le filtre
  const availableActions = [
    { value: "dispense", label: "Dispensation", color: "blue" },
    { value: "receive", label: "Réception", color: "green" },
    { value: "adjustment", label: "Ajustement", color: "yellow" },
    { value: "destruction", label: "Destruction", color: "red" },
    { value: "transfer", label: "Transfert", color: "purple" },
    { value: "sale", label: "Vente", color: "indigo" },
    { value: "purchase", label: "Achat", color: "emerald" },
    { value: "return", label: "Retour", color: "orange" },
    { value: "damage", label: "Détérioration", color: "red" },
    { value: "expiration", label: "Expiration", color: "gray" },
  ];

  // Schedules DEA pour le filtre
  const deaSchedules = [
    { value: DEASchedule.SCHEDULE_I, label: "Schedule I - Haut risque" },
    { value: DEASchedule.SCHEDULE_II, label: "Schedule II - Risque élevé" },
    { value: DEASchedule.SCHEDULE_III, label: "Schedule III - Risque modéré" },
    { value: DEASchedule.SCHEDULE_IV, label: "Schedule IV - Risque faible" },
    { value: DEASchedule.SCHEDULE_V, label: "Schedule V - Risque minimal" },
    { value: DEASchedule.UNSCHEDULED, label: "Non contrôlé" },
  ];

  const getActionLabel = (action: string) => {
    return availableActions.find(a => a.value === action)?.label || action;
  };

  const getActionColor = (action: string) => {
    const color = availableActions.find(a => a.value === action)?.color || "gray";
    return `bg-${color}-100 text-${color}-800`;
  };

  const getDEAScheduleLabel = (schedule: DEASchedule) => {
    return deaSchedules.find(s => s.value === schedule)?.label || schedule;
  };

  const getRiskLevel = (schedule: DEASchedule) => {
    switch (schedule) {
      case DEASchedule.SCHEDULE_I:
      case DEASchedule.SCHEDULE_II:
        return { level: "haut", color: "red" };
      case DEASchedule.SCHEDULE_III:
        return { level: "modéré", color: "orange" };
      case DEASchedule.SCHEDULE_IV:
      case DEASchedule.SCHEDULE_V:
        return { level: "faible", color: "yellow" };
      default:
        return { level: "non contrôlé", color: "gray" };
    }
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      productId: "",
      batchId: "",
      action: "",
      deaSchedule: "",
      dateFrom: "",
      dateTo: "",
      search: "",
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  // Fonction pour l'export (à implémenter selon l'API)
  const handleExport = async () => {
    try {
      // Implémentation de l'export selon votre API
      toast.success("Export des logs en cours...");
      // await apiClient.exportControlledSubstanceLogs(filters);
    } catch (error) {
      toast.error("Erreur lors de l'export");
    }
  };

  // Calcul des dates par défaut pour les boutons rapides
  const getDefaultDateFrom = () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  };

  const getDefaultDateTo = () => {
    return new Date().toISOString().split('T')[0];
  };

  const LogDetailModal = () => (
    <Modal
      isOpen={showLogModal}
      onClose={() => {
        setShowLogModal(false);
        setSelectedLog(null);
      }}
      title="Détails du mouvement"
      size="lg"
    >
      {selectedLog && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Date et heure</p>
              <p className="text-sm text-gray-900">
                {new Date(selectedLog.createdAt).toLocaleString("fr-FR")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Action</p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getActionColor(selectedLog.action)}`}>
                {getActionLabel(selectedLog.action)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Produit</p>
              <p className="text-sm text-gray-900">
                {selectedLog.product?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Lot</p>
              <p className="text-sm text-gray-900">
                {selectedLog.batch?.batchNumber || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Quantité</p>
              <p className={`text-sm font-medium ${selectedLog.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                {selectedLog.quantity > 0 ? "+" : ""}{selectedLog.quantity}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Schedule DEA</p>
              <p className="text-sm text-gray-900">
                {getDEAScheduleLabel(selectedLog.deaSchedule)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Utilisateur</p>
              <p className="text-sm text-gray-900">
                {selectedLog.user ? `${selectedLog.user.firstName} ${selectedLog.user.lastName}` : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Niveau de risque</p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs bg-${getRiskLevel(selectedLog.deaSchedule).color}-100 text-${getRiskLevel(selectedLog.deaSchedule).color}-800`}>
                {getRiskLevel(selectedLog.deaSchedule).level}
              </span>
            </div>
          </div>

          {selectedLog.patient && (
            <div>
              <p className="text-sm font-medium text-gray-500">Patient</p>
              <p className="text-sm text-gray-900">
                {selectedLog.patient.firstName} {selectedLog.patient.lastName}
              </p>
            </div>
          )}

          {selectedLog.prescriber && (
            <div>
              <p className="text-sm font-medium text-gray-500">Prescripteur</p>
              <p className="text-sm text-gray-900">
                Dr. {selectedLog.prescriber.firstName} {selectedLog.prescriber.lastName}
                {selectedLog.prescriber.licenseNumber && ` (${selectedLog.prescriber.licenseNumber})`}
              </p>
            </div>
          )}

          {selectedLog.notes && (
            <div>
              <p className="text-sm font-medium text-gray-500">Notes</p>
              <p className="text-sm text-gray-900">{selectedLog.notes}</p>
            </div>
          )}

          {selectedLog.witness && (
            <div>
              <p className="text-sm font-medium text-gray-500">Témoin</p>
              <p className="text-sm text-gray-900">
                {selectedLog.witness.firstName} {selectedLog.witness.lastName}
              </p>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              onClick={() => {
                setShowLogModal(false);
                setSelectedLog(null);
              }}
            >
              Fermer
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );

  return (
    <Layout title="Logs des substances contrôlées - PharmacySaaS">
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Logs des substances contrôlées
            </h1>
            <p className="text-gray-600">
              Historique complet des mouvements de substances contrôlées pour la conformité réglementaire
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              icon={<DocumentArrowDownIcon className="h-4 w-4" />}
              onClick={handleExport}
            >
              Exporter
            </Button>
          </div>
        </div>

        {/* Alert de conformité */}
        {/* <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-900">
                  Conformité réglementaire requise
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Cet historique est obligatoire pour le suivi des substances contrôlées selon les réglementations DEA.
                  Tous les mouvements doivent être traçables et disponibles pour inspection pendant 5 ans.
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Barre de recherche et filtres */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Barre de recherche */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Rechercher par produit, lot, utilisateur..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange({ search: e.target.value })
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
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    icon={<XMarkIcon className="h-4 w-4" />}
                    onClick={resetFilters}
                  >
                    Réinitialiser
                  </Button>
                )}
              </div>

              {/* Filtres avancés */}
              {showFilters && (
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Filtre par produit */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Produit
                      </label>
                      <select
                        value={filters.productId}
                        onChange={(e) =>
                          handleFilterChange({ productId: e.target.value })
                        }
                        className="w-full rounded-md border border-gray-300 bg-white px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                      >
                        <option value="">Tous les produits</option>
                        {productsData?.data.map((product: any) => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.sku})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filtre par action */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Action
                      </label>
                      <select
                        value={filters.action}
                        onChange={(e) =>
                          handleFilterChange({ action: e.target.value })
                        }
                        className="w-full rounded-md border border-gray-300 bg-white px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                      >
                        <option value="">Toutes les actions</option>
                        {availableActions.map((action) => (
                          <option key={action.value} value={action.value}>
                            {action.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filtre par DEA Schedule */}
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Schedule DEA
                      </label>
                      <select
                        value={filters.deaSchedule}
                        onChange={(e) =>
                          handleFilterChange({ deaSchedule: e.target.value })
                        }
                        className="w-full rounded-md border border-gray-300 bg-white px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                      >
                        <option value="">Tous les schedules</option>
                        {deaSchedules.map((schedule) => (
                          <option key={schedule.value} value={schedule.value}>
                            {schedule.label}
                          </option>
                        ))}
                      </select>
                    </div> */}

                    {/* Filtre par lot */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro de lot
                      </label>
                      <Input
                        placeholder="Numéro de lot..."
                        value={filters.batchId}
                        onChange={(e) =>
                          handleFilterChange({ batchId: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Filtres par date */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de début
                      </label>
                      <Input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) =>
                          handleFilterChange({ dateFrom: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de fin
                      </label>
                      <Input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) =>
                          handleFilterChange({ dateTo: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleFilterChange({
                              dateFrom: getDefaultDateFrom(),
                              dateTo: getDefaultDateTo(),
                            })
                          }
                        >
                          30 derniers jours
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const today = new Date();
                            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                            handleFilterChange({
                              dateFrom: firstDay.toISOString().split('T')[0],
                              dateTo: today.toISOString().split('T')[0],
                            });
                          }}
                        >
                          Ce mois-ci
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Indicateurs de filtres actifs */}
                  {hasActiveFilters && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t border-gray-200">
                      <span className="font-medium">Filtres actifs :</span>
                      {filters.productId && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          Produit: {productsData?.data.find((p: any) => p.id === filters.productId)?.name}
                          <button
                            onClick={() => handleFilterChange({ productId: "" })}
                            className="ml-1 hover:text-blue-600"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {filters.action && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Action: {getActionLabel(filters.action)}
                          <button
                            onClick={() => handleFilterChange({ action: "" })}
                            className="ml-1 hover:text-green-600"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {filters.deaSchedule && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                          DEA: {getDEAScheduleLabel(filters.deaSchedule as DEASchedule)}
                          <button
                            onClick={() => handleFilterChange({ deaSchedule: "" })}
                            className="ml-1 hover:text-purple-600"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {filters.dateFrom && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                          Du: {new Date(filters.dateFrom).toLocaleDateString('fr-FR')}
                          <button
                            onClick={() => handleFilterChange({ dateFrom: "" })}
                            className="ml-1 hover:text-orange-600"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {filters.dateTo && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                          Au: {new Date(filters.dateTo).toLocaleDateString('fr-FR')}
                          <button
                            onClick={() => handleFilterChange({ dateTo: "" })}
                            className="ml-1 hover:text-orange-600"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tableau des logs */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded h-16"></div>
                  </div>
                ))}
              </div>
            ) : logs.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">
                  {hasActiveFilters
                    ? "Aucun log trouvé avec les filtres actuels"
                    : "Aucun log de substance contrôlée enregistré"
                  }
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="mt-4"
                  >
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lot
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantité
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Schedule DEA
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {logs.map((log: ControlledSubstanceLog) => {
                        const riskLevel = getRiskLevel(log.deaSchedule);
                        return (
                          <tr
                            key={log.id}
                            className={`hover:bg-gray-50 ${
                              riskLevel.color === "red" ? "bg-red-50 hover:bg-red-100" : ""
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(log.createdAt).toLocaleString("fr-FR")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center">
                                {log.product?.name || "N/A"}
                                {riskLevel.color === "red" && (
                                  <ExclamationTriangleIcon className="h-4 w-4 text-red-500 ml-1" />
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {log.batch?.batchNumber || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getActionColor(
                                  log.action
                                )}`}
                              >
                                {getActionLabel(log.action)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <span className={log.quantity > 0 ? "text-green-600" : "text-red-600"}>
                                {log.quantity > 0 ? "+" : ""}{log.quantity}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {log.user
                                ? `${log.user.firstName} ${log.user.lastName}`
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs bg-${riskLevel.color}-100 text-${riskLevel.color}-800`}
                              >
                                {getDEAScheduleLabel(log.deaSchedule)}
                              {riskLevel.color === "red" && (
                                <ExclamationTriangleIcon className="h-3 w-3 ml-1" />
                              )}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<EyeIcon className="h-4 w-4" />}
                                onClick={() => {
                                  setSelectedLog(log);
                                  setShowLogModal(true);
                                }}
                              >
                                Détails
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="border-t border-gray-200">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalItems}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                      onItemsPerPageChange={setItemsPerPage}
                      showItemsPerPage
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de détail */}
      <LogDetailModal />
    </Layout>
  );
};

export default ControlledSubstancesPage;