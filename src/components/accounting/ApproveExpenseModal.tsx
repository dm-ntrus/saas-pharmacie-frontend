import React from "react";
import { useFormik } from "formik";
import { Button, Input, Modal } from "@/design-system";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";

const expenseApprovalSchema = Yup.object({
  approvedBy: Yup.string().required(
    "Le nom de la personne qui approuve est requis"
  ),
  comments: Yup.string(),
});

interface ApproveExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseId: string;
  expenseDescription: string;
  expenseAmount: number;
}

export const ApproveExpenseModal: React.FC<ApproveExpenseModalProps> = ({
  isOpen,
  onClose,
  expenseId,
  expenseDescription,
  expenseAmount,
}) => {
  const queryClient = useQueryClient();

  const approveExpenseMutation = useMutation({
    mutationFn: async({ id, approvedBy }: { id: string; approvedBy: string }) =>
      apiClient.approveExpense(id, approvedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Dépense approuvée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la approuvement du dépense");
    },
  });

  const formik = useFormik({
    initialValues: {
      approvedBy: "",
      comments: "",
    },
    validationSchema: expenseApprovalSchema,
    onSubmit: (values) => {
      approveExpenseMutation.mutate({
        id: expenseId,
        approvedBy: values.approvedBy,
      });
      onClose();
      formik.resetForm();
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Approuver la dépense"
      size="md"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">
            Détails de la dépense
          </h4>
          <p className="text-sm text-gray-600">{expenseDescription}</p>
          <p className="text-sm font-medium text-gray-900 mt-1">
            Montant: {expenseAmount.toLocaleString()} FC
          </p>
        </div>

        <Input
          label="Approuvé par"
          name="approvedBy"
          value={formik.values.approvedBy}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.approvedBy && formik.errors.approvedBy
              ? formik.errors.approvedBy
              : undefined
          }
          placeholder="Nom de la personne qui approuve"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Commentaires (optionnel)
          </label>
          <textarea
            name="comments"
            value={formik.values.comments}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={3}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
            placeholder="Ajouter des commentaires sur l'approbation..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={approveExpenseMutation.isPending}
          >
            Rejeter
          </Button>
          <Button
            type="submit"
            className="flex-1"
            loading={approveExpenseMutation.isPending}
            disabled={approveExpenseMutation.isPending}
          >
            Approuver la dépense
          </Button>
        </div>
      </form>
    </Modal>
  );
};
