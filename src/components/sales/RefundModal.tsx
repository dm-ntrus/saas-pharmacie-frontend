"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button, Modal, FormTextarea } from "@/components/ui";
import { formatCurrency } from "@/utils/formatters";
import type { Sale } from "@/types";

const refundSchema = z.object({
  reason: z.string().min(10, "La raison doit contenir au moins 10 caractères"),
});

type RefundFormData = z.infer<typeof refundSchema>;

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

export const RefundModal: React.FC<RefundModalProps> = ({
  isOpen,
  onClose,
  sale,
  onConfirm,
  isLoading = false,
}) => {
  const methods = useForm<RefundFormData>({
    resolver: zodResolver(refundSchema),
    defaultValues: { reason: "" },
  });

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  const onSubmit = (data: RefundFormData) => {
    onConfirm(data.reason);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Rembourser la vente" size="md">
      <div className="mt-4 space-y-4">
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Numéro de vente</span>
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {sale.saleNumber}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Date</span>
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {new Date(sale.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Montant à rembourser
            </span>
            <span className="text-lg font-bold text-orange-600">
              {formatCurrency(sale.totalAmount)}
            </span>
          </div>
        </div>

        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
            Articles concernés
          </p>
          <ul className="space-y-1">
            {sale.items?.slice(0, 3).map((item, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-400">
                &bull; {(item as any).product?.name} - Qté: {item.quantity} -{" "}
                {formatCurrency(item.quantity * item.unitPrice)}
              </li>
            ))}
            {sale.items && sale.items.length > 3 && (
              <li className="text-sm text-slate-500">... et {sale.items.length - 3} autre(s)</li>
            )}
          </ul>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <FormTextarea<RefundFormData>
              name="reason"
              label="Raison du remboursement"
              required
              rows={4}
              placeholder="Ex: Produit défectueux, erreur de facturation, demande du client..."
            />

            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-800 dark:text-orange-200">
                <p className="font-medium mb-1">Attention : Action irréversible</p>
                <p>
                  Le remboursement mettra à jour les stocks et annulera cette transaction.
                  Cette action ne peut pas être annulée.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1" disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" variant="danger" className="flex-1" loading={isLoading}>
                Confirmer le remboursement
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Modal>
  );
};
