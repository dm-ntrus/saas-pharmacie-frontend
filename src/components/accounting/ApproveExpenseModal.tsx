"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Modal, FormInput, FormTextarea } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import toast from "react-hot-toast";
import { formatCurrency } from "@/utils/formatters";

const approvalSchema = z.object({
  approvedBy: z.string().min(1, "Le nom de la personne qui approuve est requis"),
  comments: z.string().optional(),
});

type ApprovalFormData = z.infer<typeof approvalSchema>;

interface ApproveExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseId: string;
  expenseDescription: string;
  expenseAmount: number;
  pharmacyId: string;
}

export const ApproveExpenseModal: React.FC<ApproveExpenseModalProps> = ({
  isOpen,
  onClose,
  expenseId,
  expenseDescription,
  expenseAmount,
  pharmacyId,
}) => {
  const queryClient = useQueryClient();
  const methods = useForm<ApprovalFormData>({
    resolver: zodResolver(approvalSchema),
    defaultValues: { approvedBy: "", comments: "" },
  });

  const approveExpenseMutation = useMutation({
    mutationFn: (data: ApprovalFormData) =>
      apiService.post(`/pharmacies/${pharmacyId}/accounting/expenses/${expenseId}/approve`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Dépense approuvée avec succès");
      methods.reset();
      onClose();
    },
    onError: () => {
      toast.error("Erreur lors de l'approbation de la dépense");
    },
  });

  const onSubmit = (data: ApprovalFormData) => {
    approveExpenseMutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Approuver la dépense" size="md">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
              Détails de la dépense
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{expenseDescription}</p>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-1">
              Montant: {formatCurrency(expenseAmount)}
            </p>
          </div>

          <FormInput<ApprovalFormData>
            name="approvedBy"
            label="Approuvé par"
            required
            placeholder="Nom de la personne qui approuve"
          />

          <FormTextarea<ApprovalFormData>
            name="comments"
            label="Commentaires (optionnel)"
            rows={3}
            placeholder="Ajouter des commentaires sur l'approbation..."
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={approveExpenseMutation.isPending}>
              Rejeter
            </Button>
            <Button type="submit" loading={approveExpenseMutation.isPending}>
              Approuver la dépense
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
