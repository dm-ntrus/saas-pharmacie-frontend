import React from "react";
import { useFormik } from "formik";
import { Button, Input, Modal } from "@/design-system";
import * as Yup from "yup";
import apiClient from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CreateTransactionDto } from "@/types";

const transactionSchema = Yup.object({
  accountId: Yup.string().required("Le compte est requis"),
  amount: Yup.number()
    .min(0, "Le montant doit être positif")
    .required("Le montant est requis"),
  description: Yup.string().required("La description est requise"),
  date: Yup.date().required("La date est requise"),
  type: Yup.string()
    .oneOf(["income", "expense"])
    .required("Le type est requis"),
  category: Yup.string().required("La catégorie est requise"),
});

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const createTransactionMutation = useMutation({
    mutationFn: async (data: CreateTransactionDto) =>
      apiClient.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction créée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création d'une transation");
    },
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => apiClient.getAccounts(),
  });

  const formik = useFormik({
    initialValues: {
      accountId: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      type: "expense",
      category: "",
    },
    validationSchema: transactionSchema,
    onSubmit: (values) => {
      createTransactionMutation.mutate(values);
    },
  });

  const categories = {
    income: ["Ventes", "Services", "Intérêts", "Autres revenus"],
    expense: [
      "Achats",
      "Personnel",
      "Charges",
      "Marketing",
      "Entretien",
      "Autres dépenses",
    ],
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nouvelle Transaction"
      size="xl"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="text-red-600">*</span>
            </label>
            <select
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border border-gray-300 bg-white px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
            >
              <option value="expense">Dépense</option>
              <option value="income">Revenu</option>
            </select>
          </div>

          <Input
            label="Date"
            name="date"
            type="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.date && formik.errors.date
                ? formik.errors.date
                : undefined
            }
            required
          />
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

        <div className="grid grid-cols-2 gap-4">
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
              {categories[formik.values.type as keyof typeof categories]?.map(
                (category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                )
              )}
            </select>
            {formik.touched.category && formik.errors.category && (
              <p className="mt-1 text-xs text-red-600">
                {formik.errors.category}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            className="flex-1"
            variant="outline"
            onClick={onClose}
            disabled={createTransactionMutation.isPending}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="flex-1"
            loading={createTransactionMutation.isPending}
            disabled={createTransactionMutation.isPending}
          >
            Créer la transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
};
