import React from "react";
import { useFormik } from "formik";
import { Button, Input, Modal } from "@/design-system";
import * as Yup from "yup";
import apiClient from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateAccountDto } from "@/types";
import toast from "react-hot-toast";

const accountSchema = Yup.object({
  accountCode: Yup.string().required("Le code compte est requis"),
  accountName: Yup.string().required("Le nom du compte est requis"),
  accountType: Yup.string().required("Le type de compte est requis"),
  normalBalance: Yup.string().required("Le solde normal est requis"),
});

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const createAccountMutation = useMutation({
    mutationFn: async(data: CreateAccountDto) => apiClient.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Compte créée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création d'un compte");
    },
  });

  const formik = useFormik({
    initialValues: {
      accountCode: "",
      accountName: "",
      accountType: "",
      normalBalance: "",
    },
    validationSchema: accountSchema,
    onSubmit: (values) => {
      createAccountMutation.mutate(values);
    },
  });

  const accountTypes = [
    { value: "asset", label: "Actif" },
    { value: "liability", label: "Passif" },
    { value: "equity", label: "Capitaux propres" },
    { value: "revenue", label: "Produits" },
    { value: "expense", label: "Charges" },
  ];

  const normalBalances = [
    { value: "debit", label: "Débit" },
    { value: "credit", label: "Crédit" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Créer un compte comptable"
      size="lg"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Code du compte"
            name="accountCode"
            value={formik.values.accountCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.accountCode && formik.errors.accountCode
                ? formik.errors.accountCode
                : undefined
            }
            required
          />

          <Input
            label="Nom du compte"
            name="accountName"
            value={formik.values.accountName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.accountName && formik.errors.accountName
                ? formik.errors.accountName
                : undefined
            }
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de compte <span className="text-red-600">*</span>
            </label>
            <select
              name="accountType"
              value={formik.values.accountType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border border-gray-300 bg-white px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
            >
              <option value="">Sélectionner un type</option>
              {accountTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {formik.touched.accountType && formik.errors.accountType && (
              <p className="mt-1 text-xs text-red-600">
                {formik.errors.accountType}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Solde normal <span className="text-red-600">*</span>
            </label>
            <select
              name="normalBalance"
              value={formik.values.normalBalance}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border border-gray-300 bg-white px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
            >
              <option value="">Sélectionner</option>
              {normalBalances.map((balance) => (
                <option key={balance.value} value={balance.value}>
                  {balance.label}
                </option>
              ))}
            </select>
            {formik.touched.normalBalance && formik.errors.normalBalance && (
              <p className="mt-1 text-xs text-red-600">
                {formik.errors.normalBalance}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={createAccountMutation.isPending}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="flex-1"
            loading={createAccountMutation.isPending}
            disabled={createAccountMutation.isPending}
          >
            Créer le compte
          </Button>
        </div>
      </form>
    </Modal>
  );
};
