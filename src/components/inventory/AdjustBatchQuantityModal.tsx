"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Modal, FormInput, FormSelect } from "@/components/ui";

const adjustSchema = z.object({
  adjustmentType: z.enum(["add", "remove"]),
  quantity: z.number().min(1, "La quantité doit être au moins 1"),
  reason: z.string().min(3, "La raison doit contenir au moins 3 caractères"),
});

type AdjustFormData = z.infer<typeof adjustSchema>;

interface AdjustBatchQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: any;
  onConfirm: (data: { quantity: number; reason: string; userId: string }) => void;
  isLoading?: boolean;
  userId: string;
}

const reasonOptions = [
  { value: "Vente", label: "Vente" },
  { value: "Réception", label: "Réception de stock" },
  { value: "Correction", label: "Correction d'inventaire" },
  { value: "Dommage", label: "Produit endommagé" },
  { value: "Expiration", label: "Produit expiré" },
  { value: "Vol", label: "Vol/Perte" },
  { value: "Retour", label: "Retour" },
  { value: "Autre", label: "Autre" },
];

export const AdjustBatchQuantityModal: React.FC<AdjustBatchQuantityModalProps> = ({
  isOpen,
  onClose,
  batch,
  onConfirm,
  isLoading = false,
  userId,
}) => {
  const methods = useForm<AdjustFormData>({
    resolver: zodResolver(adjustSchema),
    defaultValues: {
      adjustmentType: "add",
      quantity: 0,
      reason: "",
    },
  });

  const { watch, setValue } = methods;
  const adjustmentType = watch("adjustmentType");
  const quantity = watch("quantity");

  const newQuantity = batch.currentQuantity + (adjustmentType === "add" ? quantity : -quantity);

  const onSubmit = (data: AdjustFormData) => {
    const adjustedQuantity = data.adjustmentType === "add" ? data.quantity : -data.quantity;
    onConfirm({ quantity: adjustedQuantity, reason: data.reason, userId });
  };

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Ajuster la quantité" size="lg">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Lot #{batch.batchNumber}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Stock actuel: {batch.currentQuantity} unités
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Expiration: {new Date(batch.expirationDate).toLocaleDateString("fr-FR")}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Type d'ajustement
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue("adjustmentType", "add")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  adjustmentType === "add"
                    ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                }`}
              >
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Ajouter</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Augmenter le stock</p>
              </button>
              <button
                type="button"
                onClick={() => setValue("adjustmentType", "remove")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  adjustmentType === "remove"
                    ? "border-red-600 bg-red-50 dark:bg-red-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                }`}
              >
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Retirer</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Diminuer le stock</p>
              </button>
            </div>
          </div>

          <FormInput<AdjustFormData>
            name="quantity"
            label="Quantité"
            type="number"
            min={1}
            required
          />

          <FormSelect<AdjustFormData>
            name="reason"
            label="Raison"
            required
            options={reasonOptions}
            placeholder="Sélectionner une raison"
          />

          {quantity > 0 && (
            <div
              className={`p-4 rounded-lg ${
                newQuantity < 0
                  ? "bg-red-50 dark:bg-red-900/20 border border-red-200"
                  : adjustmentType === "add"
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200"
                  : "bg-orange-50 dark:bg-orange-900/20 border border-orange-200"
              }`}
            >
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Nouveau stock: {newQuantity} unités
              </p>
              <p className={`text-xs mt-1 ${
                newQuantity < 0 ? "text-red-600" : adjustmentType === "add" ? "text-green-600" : "text-orange-600"
              }`}>
                {adjustmentType === "add" ? "+" : "-"}{quantity} unités
              </p>
              {newQuantity < 0 && (
                <p className="text-xs text-red-600 mt-2">Attention: Le stock ne peut pas être négatif</p>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1" disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1" loading={isLoading} disabled={isLoading || newQuantity < 0}>
              Confirmer
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
