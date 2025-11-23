import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  PrinterIcon,
  ArrowPathIcon,
  TrashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Layout from "@/components/layout/Layout";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/design-system";
import { apiClient } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useAuth";
import { UserRole, SaleStatus, PaymentMethod } from "@/types";
import { toast } from "react-hot-toast";
import { RefundModal } from "@/components/sales/RefundModal";
import { DeleteSaleModal } from "@/components/sales/DeleteSaleModal";
import { PrintReceiptModal } from "@/components/sales/PrintReceiptModal";

const SaleDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  useRequireAuth([
    UserRole.ADMIN,
    UserRole.PHARMACIST,
    UserRole.TECHNICIAN,
    UserRole.CASHIER,
  ]);

  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Fetch sale details
  const {
    data: sale,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sale", id],
    queryFn: () => apiClient.getSale(id as string),
    enabled: !!id,
  });

  // Refund mutation
  const refundMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiClient.refundSale(id, reason),
    onSuccess: () => {
      toast.success("Vente remboursée avec succès!");
      queryClient.invalidateQueries({ queryKey: ["sale", id] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      setIsRefundModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Erreur lors du remboursement"
      );
    },
  });

  // Delete mutation (si l'API le supporte)
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteSale(id),
    onSuccess: () => {
      toast.success("Vente supprimée avec succès!");
      router.push("/sales");
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
      currency: "EUR",
    }).format(amount);
  };

  const getStatusColor = (status: SaleStatus) => {
    const colors = {
      [SaleStatus.COMPLETED]: "bg-green-100 text-green-800 border-green-200",
      [SaleStatus.REFUNDED]: "bg-red-100 text-red-800 border-red-200",
      [SaleStatus.PARTIALLY_REFUNDED]:
        "bg-yellow-100 text-yellow-800 border-yellow-200",
      [SaleStatus.CANCELLED]: "bg-gray-100 text-gray-800 border-gray-200",
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

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    const labels = {
      [PaymentMethod.CASH]: "Espèces",
      [PaymentMethod.CARD]: "Carte bancaire",
      [PaymentMethod.INSURANCE]: "Assurance",
      [PaymentMethod.MIXED]: "Paiement mixte",
    };
    return labels[method];
  };

  const handleRefund = (reason: string) => {
    if (sale) {
      refundMutation.mutate({ id: sale.id, reason });
    }
  };

  const handleDelete = () => {
    if (sale) {
      deleteMutation.mutate(sale.id);
    }
  };

  if (isLoading) {
    return (
      <Layout title="Chargement... - PharmacySaaS">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600" />
        </div>
      </Layout>
    );
  }

  if (error || !sale) {
    return (
      <Layout title="Erreur - PharmacySaaS">
        <div className="text-center py-12">
          <p className="text-red-600">Erreur lors du chargement de la vente</p>
          <Button onClick={() => router.push("/sales")} className="mt-4">
            Retour aux ventes
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Vente ${sale.saleNumber} - PharmacySaaS`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              icon={<ArrowLeftIcon className="h-4 w-4" />}
            >
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Vente #{sale.saleNumber}
              </h1>
              <p className="text-gray-600">
                {new Date(sale.createdAt).toLocaleString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                sale?.status
              )}`}
            >
              {getStatusLabel(sale?.status)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsPrintModalOpen(true)}
                icon={<PrinterIcon className="h-4 w-4" />}
              >
                Imprimer le reçu
              </Button>

              {sale.status === SaleStatus.COMPLETED && (
                <Button
                  variant="outline"
                  onClick={() => setIsRefundModalOpen(true)}
                  icon={<ArrowPathIcon className="h-4 w-4" />}
                >
                  Rembourser
                </Button>
              )}

              {sale.status !== SaleStatus.REFUNDED && (
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteModalOpen(true)}
                  icon={<TrashIcon className="h-4 w-4" />}
                >
                  Supprimer
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informations client</CardTitle>
              </CardHeader>
              <CardContent>
                {sale.patient ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Nom complet</p>
                      <p className="font-medium text-gray-900">
                        {sale.patient.firstName} {sale.patient.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Téléphone</p>
                      <p className="font-medium text-gray-900">
                        {sale.patient.phone || "Non renseigné"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">
                        {sale.patient.email || "Non renseigné"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    Vente sans client enregistré
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Articles vendus ({sale.items?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Produit
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          Quantité
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Prix unitaire
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Remise
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sale.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.product?.name}
                              </p>
                              {item.batchNumber && (
                                <p className="text-xs text-gray-500">
                                  Lot: {item.batchNumber}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right text-gray-900">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="px-4 py-4 text-right text-red-600">
                            {item.discountAmount
                              ? `-${formatCurrency(item.discountAmount)}`
                              : "-"}
                          </td>
                          <td className="px-4 py-4 text-right font-medium text-gray-900">
                            {formatCurrency(item.totalPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {sale.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{sale.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Transaction Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de transaction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Caissier</p>
                  <p className="font-medium text-gray-900">
                    {sale.cashier?.firstName} {sale.cashier?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mode de paiement</p>
                  <p className="font-medium text-gray-900">
                    {getPaymentMethodLabel(sale.paymentMethod)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date de création</p>
                  <p className="font-medium text-gray-900">
                    {new Date(sale.createdAt).toLocaleString("fr-FR")}
                  </p>
                </div>
                {sale.updatedAt !== sale.createdAt && (
                  <div>
                    <p className="text-sm text-gray-600">
                      Dernière modification
                    </p>
                    <p className="font-medium text-gray-900">
                      {new Date(sale.updatedAt).toLocaleString("fr-FR")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Résumé financier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">
                    {formatCurrency(sale.subtotal)}
                  </span>
                </div>

                {sale.discountAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Remise totale</span>
                    <span className="font-medium">
                      -{formatCurrency(sale.discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">TVA (18%)</span>
                  <span className="font-medium">
                    {formatCurrency(sale.taxAmount)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-sky-600">
                      {formatCurrency(sale.totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Montant payé</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(sale.amountPaid)}
                    </span>
                  </div>

                  {sale.changeGiven > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rendu au client</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(sale.changeGiven)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status History */}
            {sale.status !== SaleStatus.COMPLETED && (
              <Card>
                <CardHeader>
                  <CardTitle>Historique</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Vente complétée
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(sale.createdAt).toLocaleString("fr-FR")}
                        </p>
                      </div>
                    </div>

                    {sale.status === SaleStatus.REFUNDED && (
                      <div className="flex items-start gap-3">
                        <ArrowPathIcon className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Remboursement effectué
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(sale.updatedAt).toLocaleString("fr-FR")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {sale && (
        <>
          <RefundModal
            isOpen={isRefundModalOpen}
            onClose={() => setIsRefundModalOpen(false)}
            sale={sale}
            onConfirm={handleRefund}
            isLoading={refundMutation.isPending}
          />

          <DeleteSaleModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            sale={sale}
            onConfirm={handleDelete}
            isLoading={deleteMutation.isPending}
          />

          <PrintReceiptModal
            isOpen={isPrintModalOpen}
            onClose={() => setIsPrintModalOpen(false)}
            sale={sale}
          />
        </>
      )}
    </Layout>
  );
};

export default SaleDetailPage;
