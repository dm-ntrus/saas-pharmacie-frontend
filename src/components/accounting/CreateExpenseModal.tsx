import React, { useState } from "react";
import { useFormik } from "formik";
import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import { Button, Input, Modal } from "@/design-system";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import { CreateExpenseDto } from "@/types";

const expenseSchema = Yup.object({
  accountId: Yup.number().required('Le compte est requis'),
  amount: Yup.number().min(0, 'Le montant doit être positif').required('Le montant est requis'),
  description: Yup.string().required('La description est requise'),
  expenseDate: Yup.date().required('La date est requise'),
  category: Yup.string().required('La catégorie est requise'),
});

interface CreateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateExpenseModal: React.FC<CreateExpenseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const createExpenseMutation = useMutation({
    mutationFn: async (data: CreateExpenseDto) => apiClient.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Dépense créée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création d'une dépense");
    },
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => apiClient.getAccounts(),
  });

  const [attachments, setAttachments] = useState<File[]>([]);

  const formik = useFormik({
    initialValues: {
      accountId: "",
      amount: "",
      description: "",
      expenseDate: new Date().toISOString().split("T")[0],
      category: "",
    },
    validationSchema: expenseSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      createExpenseMutation.mutate(formData);
      onClose();
      setAttachments([]);
      formik.resetForm();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const expenseCategories = [
    "Achats",
    "Personnel",
    "Charges",
    "Marketing",
    "Entretien",
    "Autres dépenses",
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Créer une dépense"
      size="xl"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date de la dépense"
            name="expenseDate"
            type="date"
            value={formik.values.expenseDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.expenseDate && formik.errors.expenseDate
                ? formik.errors.expenseDate
                : undefined
            }
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie <span className="text-red-600">*</span>
            </label>
            <select
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border border-gray-300 bg-white px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
            >
              <option value="">Sélectionner une catégorie</option>
              {expenseCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {formik.touched.category && formik.errors.category && (
              <p className="mt-1 text-xs text-red-600">
                {formik.errors.category}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Compte <span className="text-red-600">*</span>
          </label>
          <select
            name="accountId"
            value={formik.values.accountId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-md border border-gray-300 bg-white px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
          >
            <option value="">Sélectionner un compte</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.accountCode} - {account.accountName}
              </option>
            ))}
          </select>
          {formik.touched.accountId && formik.errors.accountId && (
            <p className="mt-1 text-xs text-red-600">
              {formik.errors.accountId}
            </p>
          )}
        </div>

        <Input
          label="Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.description && formik.errors.description
              ? formik.errors.description
              : undefined
          }
          required
        />

        <Input
          label="Montant"
          name="amount"
          type="number"
          step="0.01"
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.amount && formik.errors.amount
              ? formik.errors.amount
              : undefined
          }
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Justificatifs (reçus)
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <DocumentArrowUpIcon className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Cliquer pour uploader</span>{" "}
                  ou glisser-déposer
                </p>
                <p className="text-xs text-gray-500">
                  PDF, JPG, PNG (MAX. 10MB)
                </p>
              </div>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </label>
          </div>
          {attachments.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Fichiers sélectionnés:</p>
              <ul className="text-sm text-gray-600">
                {attachments.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={createExpenseMutation.isPending}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="flex-1"
            loading={createExpenseMutation.isPending}
            disabled={createExpenseMutation.isPending}
          >
            Créer la dépense
          </Button>
        </div>
      </form>
    </Modal>
  );
};
