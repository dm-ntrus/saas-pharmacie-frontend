"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Modal, FormInput, FormSelect } from "@/components/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import toast from "react-hot-toast";

const transactionSchema = z.object({
  accountId: z.string().min(1, "Le compte est requis"),
  amount: z.number().min(0, "Le montant doit être positif"),
  description: z.string().min(1, "La description est requise"),
  date: z.string().min(1, "La date est requise"),
  type: z.enum(["income", "expense"], { required_error: "Le type est requis" }),
  category: z.string().min(1, "La catégorie est requise"),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pharmacyId: string;
}

const typeOptions = [
  { value: "expense", label: "Dépense" },
  { value: "income", label: "Revenu" },
];

const categoryMap: Record<string, { value: string; label: string }[]> = {
  income: [
    { value: "Ventes", label: "Ventes" },
    { value: "Services", label: "Services" },
    { value: "Intérêts", label: "Intérêts" },
    { value: "Autres revenus", label: "Autres revenus" },
  ],
  expense: [
    { value: "Achats", label: "Achats" },
    { value: "Personnel", label: "Personnel" },
    { value: "Charges", label: "Charges" },
    { value: "Marketing", label: "Marketing" },
    { value: "Entretien", label: "Entretien" },
    { value: "Autres dépenses", label: "Autres dépenses" },
  ],
};

export const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({
  isOpen,
  onClose,
  pharmacyId,
}) => {
  const queryClient = useQueryClient();

  const methods = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      accountId: "",
      amount: 0,
      description: "",
      date: new Date().toISOString().split("T")[0],
      type: "expense",
      category: "",
    },
  });

  const selectedType = methods.watch("type");

  const { data: accounts = [] } = useQuery<any[]>({
    queryKey: ["accounts", pharmacyId],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/accounting/accounts`).then((r) => r.data),
  });

  const accountOptions = accounts.map((a: any) => ({
    value: a.id,
    label: `${a.accountCode} - ${a.accountName}`,
  }));

  const createTransactionMutation = useMutation({
    mutationFn: (data: TransactionFormData) =>
      apiService.post(`/pharmacies/${pharmacyId}/accounting/transactions`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction créée avec succès");
      methods.reset();
      onClose();
    },
    onError: () => {
      toast.error("Erreur lors de la création de la transaction");
    },
  });

  const onSubmit = (data: TransactionFormData) => {
    createTransactionMutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nouvelle Transaction" size="xl">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect<TransactionFormData>
              name="type"
              label="Type"
              required
              options={typeOptions}
            />
            <FormInput<TransactionFormData>
              name="date"
              label="Date"
              type="date"
              required
            />
          </div>

          <FormSelect<TransactionFormData>
            name="accountId"
            label="Compte"
            required
            options={accountOptions}
            placeholder="Sélectionner un compte"
          />

          <FormInput<TransactionFormData>
            name="description"
            label="Description"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput<TransactionFormData>
              name="amount"
              label="Montant"
              type="number"
              required
              step="0.01"
              min={0}
            />
            <FormSelect<TransactionFormData>
              name="category"
              label="Catégorie"
              required
              options={categoryMap[selectedType] || []}
              placeholder="Sélectionner une catégorie"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={createTransactionMutation.isPending}>
              Annuler
            </Button>
            <Button type="submit" loading={createTransactionMutation.isPending}>
              Créer la transaction
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
