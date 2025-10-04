import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field } from "formik";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import Layout from "@/components/layout/Layout";
import {
  Button,
  Card,
  CardContent,
  Modal,
} from "@/design-system";
import { Pagination } from "@/components/Pagination";
import { apiClient } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useAuth";
import { UserRole, AlertSeverity, AlertType } from "@/types";
import { toast } from "react-hot-toast";
import { usePagination } from "@/hooks/usePerformance";
import Link from "next/link";

const InventoryAlertsPage: React.FC = () => {
  useRequireAuth([UserRole.ADMIN, UserRole.PHARMACIST, UserRole.TECHNICIAN]);

  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    severity: "",
    type: "",
    resolved: false,
    page: 1,
    limit: 20,
  });
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  const { data: alertsData, isLoading } = useQuery({
    queryKey: ["inventory-alerts", filters],
    queryFn: () => apiClient.getInventoryAlerts(filters),
  });

  const acknowledgeMutation = useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      apiClient.acknowledgeAlert(id, { userId, notes: "" }),
    onSuccess: () => {
      toast.success("Alerte acquittée");
      queryClient.invalidateQueries({ queryKey: ["inventory-alerts"] });
    },
  });

  const resolveMutation = useMutation({
    mutationFn: ({
      id,
      resolvedBy,
      resolutionNotes,
    }: {
      id: string;
      resolvedBy: string;
      resolutionNotes: string;
    }) => apiClient.resolveAlert(id, { resolvedBy, resolutionNotes }),
    onSuccess: () => {
      toast.success("Alerte résolue");
      queryClient.invalidateQueries({ queryKey: ["inventory-alerts"] });
      setResolveModalOpen(false);
      setSelectedAlert(null);
    },
  });

  const snoozeMutation = useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      apiClient.snoozeAlert(id, {
        snoozeUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
        userId,
      }),
    onSuccess: () => {
      toast.success("Alerte reportée de 24h");
      queryClient.invalidateQueries({ queryKey: ["inventory-alerts"] });
    },
  });

  const pagination = usePagination(
    alertsData?.total || 0,
    filters.limit,
    filters.page
  );

  const getSeverityColor = (severity: AlertSeverity) => {
    const colors = {
      [AlertSeverity.LOW]: "bg-blue-100 text-blue-800",
      [AlertSeverity.MEDIUM]: "bg-yellow-100 text-yellow-800",
      [AlertSeverity.HIGH]: "bg-orange-100 text-orange-800",
      [AlertSeverity.CRITICAL]: "bg-red-100 text-red-800",
    };
    return colors[severity];
  };

  const getSeverityIcon = (severity: AlertSeverity) => {
    if (severity === AlertSeverity.CRITICAL) {
      return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
    }
    return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
  };

  const getTypeLabel = (type: AlertType) => {
    const labels = {
      [AlertType.LOW_STOCK]: "Stock faible",
      [AlertType.EXPIRING_SOON]: "Expiration proche",
      [AlertType.EXPIRED]: "Produit expiré",
      [AlertType.OVERSTOCK]: "Surstock",
      [AlertType.ABNORMAL_CONSUMPTION]: "Consommation anormale",
    };
    return labels[type] || type;
  };

  const ResolveAlertModal = () => (
    <Modal
      isOpen={resolveModalOpen}
      onClose={() => {
        setResolveModalOpen(false);
        setSelectedAlert(null);
      }}
      title="Résoudre l'alerte"
      size="md"
    >
      <Formik
        initialValues={{ resolutionNotes: "" }}
        onSubmit={(values) => {
          if (selectedAlert) {
            resolveMutation.mutate({
              id: selectedAlert.id,
              resolvedBy: "current-user-id",
              resolutionNotes: values.resolutionNotes,
            });
          }
        }}
      >
        {() => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes de résolution <span className="text-red-600">*</span>
              </label>
              <Field
                as="textarea"
                name="resolutionNotes"
                rows={4}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
                placeholder="Décrivez comment cette alerte a été résolue..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setResolveModalOpen(false);
                  setSelectedAlert(null);
                }}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                loading={resolveMutation.isPending}
                className="flex-1"
              >
                Confirmer la résolution
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );

  const AlertCard = ({ alert }: { alert: any }) => (
    <Card
      className={`border-l-4 ${
        alert.severity === AlertSeverity.CRITICAL
          ? "border-l-red-500"
          : alert.severity === AlertSeverity.HIGH
          ? "border-l-orange-500"
          : alert.severity === AlertSeverity.MEDIUM
          ? "border-l-yellow-500"
          : "border-l-blue-500"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {getSeverityIcon(alert.severity)}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {alert.title}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(
                    alert.severity
                  )}`}
                >
                  {getTypeLabel(alert.type)}
                </span>
                {alert.acknowledged && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Acquittée
                  </span>
                )}
                {alert.resolved && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Résolue
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-3">{alert.description}</p>

              <div className="text-sm text-gray-500 space-y-1">
                <p>Produit: {alert.product?.name || "N/A"}</p>
                <p>Lot: {alert.batchNumber || "N/A"}</p>
                <p>
                  Créée le:{" "}
                  {new Date(alert.createdAt).toLocaleDateString("fr-FR")}
                </p>
                {alert.acknowledgedAt && (
                  <p>
                    Acquittée le:{" "}
                    {new Date(alert.acknowledgedAt).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {!alert.resolved && (
          <div className="flex space-x-2 mt-4">
            {!alert.acknowledged && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  acknowledgeMutation.mutate({
                    id: alert.id,
                    userId: "current-user-id",
                  })
                }
                icon={<EyeSlashIcon className="h-4 w-4" />}
              >
                Acquitter
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                snoozeMutation.mutate({
                  id: alert.id,
                  userId: "current-user-id",
                })
              }
              icon={<ClockIcon className="h-4 w-4" />}
            >
              Reporter 24h
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setSelectedAlert(alert);
                setResolveModalOpen(true);
              }}
              icon={<CheckCircleIcon className="h-4 w-4" />}
            >
              Résoudre
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Layout title="Alertes d'inventaire - PharmacySaaS">
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Alertes d'inventaire
            </h1>
            <p className="text-gray-600">
              Surveillez et gérez les alertes de votre stock
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button variant="outline" asChild>
              <Link href="/inventory">Voir les produits</Link>
            </Button>
            <Button variant="outline">Vérifier les alertes</Button>
          </div>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={filters.severity}
                onChange={(e) =>
                  setFilters({ ...filters, severity: e.target.value, page: 1 })
                }
                className="rounded-md border border-gray-300 bg-white px-3  h-10 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
              >
                <option value="">Toutes les sévérités</option>
                {Object.values(AlertSeverity).map((severity) => (
                  <option key={severity} value={severity}>
                    {severity}
                  </option>
                ))}
              </select>

              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value, page: 1 })
                }
                className="rounded-md border border-gray-300 bg-white px-3  h-10 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
              >
                <option value="">Tous les types</option>
                {Object.values(AlertType).map((type) => (
                  <option key={type} value={type}>
                    {getTypeLabel(type)}
                  </option>
                ))}
              </select>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.resolved}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      resolved: e.target.checked,
                      page: 1,
                    })
                  }
                  className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Afficher résolues
                </span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Liste des alertes */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-32"></div>
              </div>
            ))}
          </div>
        ) : !alertsData?.alerts?.length ? (
          <div className="text-center py-12">
            <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucune alerte
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Toutes les alertes sont traitées ou aucun problème détecté.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {alertsData?.alerts?.map((alert: any) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>

            {/* Pagination */}
            {alertsData && alertsData.total > filters.limit && (
              <Pagination
                currentPage={filters.page}
                totalPages={pagination.totalPages}
                totalItems={alertsData.total}
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

        {/* Modal de résolution */}
        <ResolveAlertModal />
      </div>
    </Layout>
  );
};

export default InventoryAlertsPage;
