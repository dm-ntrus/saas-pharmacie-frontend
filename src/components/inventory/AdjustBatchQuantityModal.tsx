import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AdjustmentsVerticalIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, Modal } from "@/design-system";

interface AdjustBatchQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: any;
  onConfirm: (data: {
    quantity: number;
    reason: string;
    userId: string;
  }) => void;
  isLoading?: boolean;
  userId: string;
}

const adjustQuantitySchema = Yup.object().shape({
  adjustmentType: Yup.string().oneOf(["add", "remove"]).required(),
  quantity: Yup.number()
    .min(1, "La quantité doit être au moins 1")
    .required("La quantité est requise"),
  reason: Yup.string()
    .min(3, "La raison doit contenir au moins 3 caractères")
    .required("La raison est requise"),
});

export const AdjustBatchQuantityModal: React.FC<
  AdjustBatchQuantityModalProps
> = ({ isOpen, onClose, batch, onConfirm, isLoading = false, userId }) => {
  const formik = useFormik({
    initialValues: {
      adjustmentType: "add" as "add" | "remove",
      quantity: 0,
      reason: "",
    },
    validationSchema: adjustQuantitySchema,
    onSubmit: (values) => {
      const adjustedQuantity =
        values.adjustmentType === "add" ? values.quantity : -values.quantity;
      onConfirm({
        quantity: adjustedQuantity,
        reason: values.reason,
        userId: userId,
      });
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const newQuantity =
    batch.currentQuantity +
    (formik.values.adjustmentType === "add"
      ? formik.values.quantity
      : -formik.values.quantity);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={<AdjustmentsVerticalIcon className="h-5 w-5 text-sky-600" />}
      title="Ajuster la quantité"
      size="lg"
    >
      <form onSubmit={formik.handleSubmit} className="mt-4 space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-900">
            Lot #{batch.batchNumber}
          </p>
          <p className="text-sm text-gray-600">
            Stock actuel: {batch.currentQuantity} unités
          </p>
          <p className="text-sm text-gray-600">
            Expiration:{" "}
            {new Date(batch.expirationDate).toLocaleDateString("fr-FR")}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type d'ajustement
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => formik.setFieldValue("adjustmentType", "add")}
              className={`p-4 border-2 rounded-lg transition-all ${
                formik.values.adjustmentType === "add"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className="text-sm font-medium text-gray-900">Ajouter</p>
              <p className="text-xs text-gray-600">Augmenter le stock</p>
            </button>
            <button
              type="button"
              onClick={() => formik.setFieldValue("adjustmentType", "remove")}
              className={`p-4 border-2 rounded-lg transition-all ${
                formik.values.adjustmentType === "remove"
                  ? "border-red-600 bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className="text-sm font-medium text-gray-900">Retirer</p>
              <p className="text-xs text-gray-600">Diminuer le stock</p>
            </button>
          </div>
        </div>

        <Input
          type="number"
          label="Quantité"
          min="1"
          {...formik.getFieldProps("quantity")}
          error={
            formik.touched.quantity && formik.errors.quantity
              ? formik.errors.quantity
              : undefined
          }
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Raison
          </label>
          <select
            {...formik.getFieldProps("reason")}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
          >
            <option value="">Sélectionner une raison</option>
            <option value="Vente">Vente</option>
            <option value="Réception">Réception de stock</option>
            <option value="Correction">Correction d'inventaire</option>
            <option value="Dommage">Produit endommagé</option>
            <option value="Expiration">Produit expiré</option>
            <option value="Vol">Vol/Perte</option>
            <option value="Retour">Retour</option>
            <option value="Autre">Autre</option>
          </select>
          {formik.touched.reason && formik.errors.reason && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.reason}</p>
          )}
        </div>

        {formik.values.quantity > 0 && (
          <div
            className={`p-4 rounded-lg ${
              newQuantity < 0
                ? "bg-red-50 border border-red-200"
                : formik.values.adjustmentType === "add"
                ? "bg-green-50 border border-green-200"
                : "bg-orange-50 border border-orange-200"
            }`}
          >
            <p className="text-sm font-medium text-gray-900">
              Nouveau stock: {newQuantity} unités
            </p>
            <p
              className={`text-xs mt-1 ${
                newQuantity < 0
                  ? "text-red-600"
                  : formik.values.adjustmentType === "add"
                  ? "text-green-600"
                  : "text-orange-600"
              }`}
            >
              {formik.values.adjustmentType === "add" ? "+" : ""}
              {formik.values.adjustmentType === "add"
                ? formik.values.quantity
                : -formik.values.quantity}{" "}
              unités
            </p>
            {newQuantity < 0 && (
              <p className="text-xs text-red-600 mt-2">
                ⚠️ Attention: Le stock ne peut pas être négatif
              </p>
            )}
          </div>
        )}

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
            className="flex-1"
            loading={isLoading}
            disabled={isLoading || newQuantity < 0}
          >
            Confirmer
          </Button>
        </div>
      </form>
    </Modal>
  );
};
