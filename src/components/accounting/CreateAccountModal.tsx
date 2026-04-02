"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Modal, FormInput, FormSelect } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import toast from "react-hot-toast";

const accountSchema = z.object({
  accountCode: z.string().min(1, "Le code compte est requis"),
  accountName: z.string().min(1, "Le nom du compte est requis"),
  accountType: z.string().min(1, "Le type de compte est requis"),
  normalBalance: z.string().min(1, "Le solde normal est requis"),
});

type AccountFormData = z.infer<typeof accountSchema>;

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  pharmacyId: string;
}

const accountTypeOptions = [
  { value: "asset", label: "Actif" },
  { value: "liability", label: "Passif" },
  { value: "equity", label: "Capitaux propres" },
  { value: "revenue", label: "Produits" },
  { value: "expense", label: "Charges" },
];

const normalBalanceOptions = [
  { value: "debit", label: "Débit" },
  { value: "credit", label: "Crédit" },
];

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  onClose,
  pharmacyId,
}) => {
  const queryClient = useQueryClient();
  const methods = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      accountCode: "",
      accountName: "",
      accountType: "",
      normalBalance: "",
    },
  });

  const createAccountMutation = useMutation({
    mutationFn: (data: AccountFormData) =>
      apiService.post(`/pharmacies/${pharmacyId}/accounting/accounts`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Compte créé avec succès");
      methods.reset();
      onClose();
    },
    onError: () => {
      toast.error("Erreur lors de la création du compte");
    },
  });

  const onSubmit = (data: AccountFormData) => {
    createAccountMutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Créer un compte comptable" size="lg">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput<AccountFormData>
            name="accountCode"
            label="Code du compte"
            required
            placeholder="Ex: 411000"
          />
          <FormInput<AccountFormData>
            name="accountName"
            label="Nom du compte"
            required
            placeholder="Ex: Clients"
          />
          <FormSelect<AccountFormData>
            name="accountType"
            label="Type de compte"
            required
            options={accountTypeOptions}
            placeholder="Sélectionner un type"
          />
          <FormSelect<AccountFormData>
            name="normalBalance"
            label="Solde normal"
            required
            options={normalBalanceOptions}
            placeholder="Sélectionner"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createAccountMutation.isPending}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              loading={createAccountMutation.isPending}
            >
              Créer le compte
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
