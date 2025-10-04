import React from "react";
import { useFormik } from "formik";
import { Button, Input, Modal } from "@/design-system";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";

const invoicePaymentSchema = Yup.object({
  paidAmount: Yup.number()
    .min(0, "Le montant doit être positif")
    .required("Le montant est requis"),
  paidDate: Yup.date().required("La date de paiement est requise"),
});

interface RecordInvoicePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
  invoiceNumber: string;
  totalAmount: number;
}

export const RecordInvoicePaymentModal: React.FC<
  RecordInvoicePaymentModalProps
> = ({ isOpen, onClose, invoiceId, invoiceNumber, totalAmount }) => {
  const queryClient = useQueryClient();

  const recordInvoicePaymentMutation = useMutation({
    mutationFn: async ({
      id,
      paymentData,
    }: {
      id: string;
      paymentData: { paidAmount: number; paidDate: Date };
    }) => apiClient.recordInvoicePayment(id, paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Paiement de facture enregistré avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de l'enregistrement de paiement de facture");
    },
  });

  const formik = useFormik({
    initialValues: {
      paidAmount: totalAmount,
      paidDate: new Date().toISOString().split("T")[0],
    },
    validationSchema: invoicePaymentSchema,
    onSubmit: (values) => {
      recordInvoicePaymentMutation.mutate({
        id: invoiceId,
        paymentData: {
          paidAmount: Number(values.paidAmount),
          paidDate: new Date(values.paidDate),
        },
      });
      onClose();
      formik.resetForm();
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Enregistrer le paiement - Facture ${invoiceNumber}`}
      size="md"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Montant à payer (FC)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max={totalAmount}
            name="paidAmount"
            value={formik.values.paidAmount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Montant total de la facture: {totalAmount.toLocaleString()} FC
          </p>
          {formik.touched.paidAmount && formik.errors.paidAmount && (
            <p className="mt-1 text-xs text-red-600">
              {formik.errors.paidAmount}
            </p>
          )}
        </div>

        <Input
          label="Date de paiement"
          name="paidDate"
          type="date"
          value={formik.values.paidDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.paidDate && formik.errors.paidDate
              ? formik.errors.paidDate
              : undefined
          }
          required
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={recordInvoicePaymentMutation.isPending}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="flex-1"
            loading={recordInvoicePaymentMutation.isPending}
            disabled={recordInvoicePaymentMutation.isPending}
          >
            Enregistrer le paiement
          </Button>
        </div>
      </form>
    </Modal>
  );
};
