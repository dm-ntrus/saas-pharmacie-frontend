"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload } from "lucide-react";
import { Button, Modal, FormInput, FormSelect, FormTextarea } from "@/components/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import toast from "react-hot-toast";

const expenseSchema = z.object({
  accountId: z.string().min(1, "Le compte est requis"),
  amount: z.number().min(0, "Le montant doit être positif"),
  description: z.string().min(1, "La description est requise"),
  expenseDate: z.string().min(1, "La date est requise"),
  category: z.string().min(1, "La catégorie est requise"),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface CreateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  pharmacyId: string;
}

const expenseCategoryOptions = [
  { value: "Achats", label: "Achats" },
  { value: "Personnel", label: "Personnel" },
  { value: "Charges", label: "Charges" },
  { value: "Marketing", label: "Marketing" },
  { value: "Entretien", label: "Entretien" },
  { value: "Autres dépenses", label: "Autres dépenses" },
];

export const CreateExpenseModal: React.FC<CreateExpenseModalProps> = ({
  isOpen,
  onClose,
  pharmacyId,
}) => {
  const queryClient = useQueryClient();
  const [attachments, setAttachments] = useState<File[]>([]);

  const methods = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      accountId: "",
      amount: 0,
      description: "",
      expenseDate: new Date().toISOString().split("T")[0],
      category: "",
    },
  });

  const { data: accounts = [] } = useQuery<any[]>({
    queryKey: ["accounts", pharmacyId],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/accounting/accounts`).then((r) => r.data),
  });

  const accountOptions = accounts.map((a: any) => ({
    value: a.id,
    label: `${a.accountCode} - ${a.accountName}`,
  }));

  const createExpenseMutation = useMutation({
    mutationFn: (data: ExpenseFormData) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, String(value)));
      attachments.forEach((file) => formData.append("attachments", file));
      return apiService.post(`/pharmacies/${pharmacyId}/accounting/expenses`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Dépense créée avec succès");
      methods.reset();
      setAttachments([]);
      onClose();
    },
    onError: () => {
      toast.error("Erreur lors de la création de la dépense");
    },
  });

  const onSubmit = (data: ExpenseFormData) => {
    createExpenseMutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Créer une dépense" size="xl">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput<ExpenseFormData>
              name="expenseDate"
              label="Date de la dépense"
              type="date"
              required
            />
            <FormSelect<ExpenseFormData>
              name="category"
              label="Catégorie"
              required
              options={expenseCategoryOptions}
              placeholder="Sélectionner une catégorie"
            />
          </div>

          <FormSelect<ExpenseFormData>
            name="accountId"
            label="Compte"
            required
            options={accountOptions}
            placeholder="Sélectionner un compte"
          />

          <FormInput<ExpenseFormData>
            name="description"
            label="Description"
            required
          />

          <FormInput<ExpenseFormData>
            name="amount"
            label="Montant"
            type="number"
            required
            step="0.01"
            min={0}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Justificatifs (reçus)
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-slate-400" />
                <p className="mb-2 text-sm text-slate-500">
                  <span className="font-semibold">Cliquer pour uploader</span> ou glisser-déposer
                </p>
                <p className="text-xs text-slate-500">PDF, JPG, PNG (MAX. 10MB)</p>
              </div>
              <input
                type="file"
                multiple
                onChange={(e) => e.target.files && setAttachments(Array.from(e.target.files))}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </label>
            {attachments.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Fichiers sélectionnés:</p>
                <ul className="text-sm text-slate-600 dark:text-slate-400">
                  {attachments.map((file, i) => (
                    <li key={i}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={createExpenseMutation.isPending}>
              Annuler
            </Button>
            <Button type="submit" loading={createExpenseMutation.isPending}>
              Créer la dépense
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
