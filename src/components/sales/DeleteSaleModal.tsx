import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button, Modal } from "@/design-system";
import type { Sale } from "@/types";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteSaleModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  sale,
  onConfirm,
  isLoading = false,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={<ExclamationTriangleIcon className="h-5 w-5 text-red-600" />}
      title="Supprimer la vente"
      size="md"
    >
      <div className="mt-4 space-y-4">
        {/* Sale Info */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Numéro de vente</span>
            <span className="text-sm font-medium text-gray-900">
              {sale.saleNumber}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Date</span>
            <span className="text-sm font-medium text-gray-900">
              {new Date(sale.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Montant</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(sale.totalAmount)}
            </span>
          </div>
          {sale.patient && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Patient</span>
              <span className="text-sm font-medium text-gray-900">
                {sale.patient.firstName} {sale.patient.lastName}
              </span>
            </div>
          )}
        </div>

        {/* Warning */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-800">
            <p className="font-medium mb-1">Attention : Action irréversible</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Cette vente sera définitivement supprimée</li>
              <li>Les données ne pourront pas être récupérées</li>
              <li>Les stocks ne seront pas automatiquement ajustés</li>
              <li>Utilisez plutôt le remboursement si nécessaire</li>
            </ul>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Êtes-vous absolument certain de vouloir supprimer cette vente ? Cette
          action est irréversible.
        </p>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            className="flex-1"
            loading={isLoading}
            disabled={isLoading}
          >
            Supprimer définitivement
          </Button>
        </div>
      </div>
    </Modal>
  );
};
