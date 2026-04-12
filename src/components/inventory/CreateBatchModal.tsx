"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Package } from "lucide-react";
import { Button, Modal, FormInput } from "@/components/ui";
import { formatCurrency } from "@/utils/formatters";

const batchSchema = z.object({
  productId: z.string().min(1, "Le produit est requis"),
  batchNumber: z.string().min(3, "Le numéro de lot doit contenir au moins 3 caractères"),
  manufactureDate: z.string().min(1, "La date de fabrication est requise"),
  expirationDate: z.string().min(1, "La date d'expiration est requise"),
  receivedDate: z.string().min(1, "La date de réception est requise"),
  initialQuantity: z.number().min(1, "La quantité doit être au moins 1"),
  unitCost: z.number().min(0, "Le coût doit être positif"),
  supplierName: z.string().optional(),
}).refine((data) => {
  if (data.manufactureDate && data.expirationDate) {
    return new Date(data.expirationDate) > new Date(data.manufactureDate);
  }
  return true;
}, {
  message: "La date d'expiration doit être postérieure à la fabrication",
  path: ["expirationDate"],
});

type BatchFormData = z.infer<typeof batchSchema>;

interface CreateBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  onConfirm: (data: any) => void;
  isLoading?: boolean;
}

export const CreateBatchModal: React.FC<CreateBatchModalProps> = ({
  isOpen,
  onClose,
  productId,
  onConfirm,
  isLoading = false,
}) => {
  const methods = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      productId: productId || "",
      batchNumber: "",
      manufactureDate: "",
      expirationDate: "",
      receivedDate: new Date().toISOString().split("T")[0],
      initialQuantity: 0,
      unitCost: 0,
      supplierName: "",
    },
  });

  const { watch } = methods;
  const initialQuantity = watch("initialQuantity");
  const unitCost = watch("unitCost");

  const onSubmit = (data: BatchFormData) => {
    onConfirm({
      ...data,
      currentQuantity: data.initialQuantity,
      reservedQuantity: 0,
    });
  };

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nouveau lot" size="xl">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <FormInput<BatchFormData>
            name="batchNumber"
            label="Numéro de lot"
            required
            placeholder="Ex: LOT2025001"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput<BatchFormData>
              name="manufactureDate"
              label="Date de fabrication"
              type="date"
              required
            />
            <FormInput<BatchFormData>
              name="expirationDate"
              label="Date d'expiration"
              type="date"
              required
            />
            <FormInput<BatchFormData>
              name="receivedDate"
              label="Date de réception"
              type="date"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput<BatchFormData>
              name="initialQuantity"
              label="Quantité initiale"
              type="number"
              required
              min={1}
            />
            <FormInput<BatchFormData>
              name="unitCost"
              label="Coût unitaire"
              type="number"
              required
              step="0.01"
              min={0}
            />
          </div>

          <FormInput<BatchFormData>
            name="supplierName"
            label="Fournisseur"
            placeholder="Ex: Pharma Distribution"
          />

          {initialQuantity > 0 && unitCost > 0 && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">Valeur totale du lot</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(initialQuantity * unitCost)}
              </p>
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
            <Button type="submit" className="flex-1" loading={isLoading}>
              Créer le lot
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
