import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Button, Modal } from "@/design-system";
import type { Sale } from "@/types";

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

const refundSchema = Yup.object().shape({
  reason: Yup.string()
    .min(10, "La raison doit contenir au moins 10 caractères")
    .required("La raison du remboursement est requise"),
});

export const RefundModal: React.FC<RefundModalProps> = ({
  isOpen,
  onClose,
  sale,
  onConfirm,
  isLoading = false,
}) => {
  const formik = useFormik({
    initialValues: {
      reason: "",
    },
    validationSchema: refundSchema,
    onSubmit: (values) => {
      onConfirm(values.reason);
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

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
      icon={<ArrowPathIcon className="h-5 w-5 text-orange-600" />}
      title="Rembourser la vente"
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
          <div className="flex justify-between border-t border-gray-200 pt-2">
            <span className="text-sm font-medium text-gray-900">
              Montant à rembourser
            </span>
            <span className="text-lg font-bold text-orange-600">
              {formatCurrency(sale.totalAmount)}
            </span>
          </div>
        </div>

        {/* Items List */}
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-900 mb-2">
            Articles concernés
          </p>
          <ul className="space-y-1">
            {sale.items?.slice(0, 3).map((item, index) => (
              <li key={index} className="text-sm text-gray-600">
                • {item.product?.name} - Qté: {item.quantity} -{" "}
                {formatCurrency(item.quantity * item.unitPrice)}
              </li>
            ))}
            {sale.items && sale.items.length > 3 && (
              <li className="text-sm text-gray-500">
                ... et {sale.items.length - 3} autre(s)
              </li>
            )}
          </ul>
        </div>

        {/* Reason Input */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Raison du remboursement <span className="text-red-600">*</span>
            </label>
            <textarea
              {...formik.getFieldProps("reason")}
              rows={4}
              placeholder="Ex: Produit défectueux, erreur de facturation, demande du client..."
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 ${
                formik.touched.reason && formik.errors.reason
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.reason && formik.errors.reason && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.reason}
              </p>
            )}
          </div>

          {/* Warning */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-orange-800">
              <p className="font-medium mb-1">
                Attention : Action irréversible
              </p>
              <p>
                Le remboursement mettra à jour les stocks et annulera cette
                transaction. Cette action ne peut pas être annulée.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="flex-1"
              loading={isLoading}
              disabled={isLoading}
            >
              Confirmer le remboursement
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
