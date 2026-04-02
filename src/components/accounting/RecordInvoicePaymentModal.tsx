"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Modal, FormInput } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import toast from "react-hot-toast";
import { formatCurrency } from "@/utils/formatters";

const paymentSchema = z.object({
  paidAmount: z.number().min(0, "Le montant doit être positif"),
  paidDate: z.string().min(1, "La date de paiement est requise"),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface RecordInvoicePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
  invoiceNumber: string;
  totalAmount: number;
  pharmacyId: string;
}

export const RecordInvoicePaymentModal: React.FC<RecordInvoicePaymentModalProps> = ({
  isOpen,
  onClose,
  invoiceId,
  invoiceNumber,
  totalAmount,
  pharmacyId,
}) => {
  const queryClient = useQueryClient();

  const methods = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paidAmount: totalAmount,
      paidDate: new Date().toISOString().split("T")[0],
    },
  });

  const recordPaymentMutation = useMutation({
    mutationFn: (data: PaymentFormData) =>
      apiService.post(`/pharmacies/${pharmacyId}/accounting/invoices/${invoiceId}/payments`, {
        paidAmount: data.paidAmount,
        paidDate: new Date(data.paidDate),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Paiement enregistré avec succès");
      methods.reset();
      onClose();
    },
    onError: () => {
      toast.error("Erreur lors de l'enregistrement du paiement");
    },
  });

  const onSubmit = (data: PaymentFormData) => {
    recordPaymentMutation.mutate(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Enregistrer le paiement - Facture ${invoiceNumber}`}
      size="md"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput<PaymentFormData>
            name="paidAmount"
            label="Montant à payer (FC)"
            type="number"
            required
            step="0.01"
            min={0}
            max={totalAmount}
            helperText={`Montant total de la facture: ${formatCurrency(totalAmount)}`}
          />

          <FormInput<PaymentFormData>
            name="paidDate"
            label="Date de paiement"
            type="date"
            required
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={recordPaymentMutation.isPending}>
              Annuler
            </Button>
            <Button type="submit" loading={recordPaymentMutation.isPending}>
              Enregistrer le paiement
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
