"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Button, Modal, FormInput, Input } from "@/components/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import toast from "react-hot-toast";

const journalHeaderSchema = z.object({
  date: z.string().min(1, "La date est requise"),
  reference: z.string().optional(),
  description: z.string().optional(),
});

type JournalHeaderFormData = z.infer<typeof journalHeaderSchema>;

interface JournalLine {
  accountId: string;
  debit: number;
  credit: number;
  description: string;
}

interface CreateJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  pharmacyId: string;
}

export const CreateJournalEntryModal: React.FC<CreateJournalEntryModalProps> = ({
  isOpen,
  onClose,
  pharmacyId,
}) => {
  const queryClient = useQueryClient();
  const [lines, setLines] = useState<JournalLine[]>([
    { accountId: "", debit: 0, credit: 0, description: "" },
    { accountId: "", debit: 0, credit: 0, description: "" },
  ]);

  const methods = useForm<JournalHeaderFormData>({
    resolver: zodResolver(journalHeaderSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      reference: "",
      description: "",
    },
  });

  const { data: accounts = [] } = useQuery<any[]>({
    queryKey: ["accounts", pharmacyId],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/accounting/accounts`).then((r) => r.data),
  });

  const addLine = () => setLines([...lines, { accountId: "", debit: 0, credit: 0, description: "" }]);
  const removeLine = (i: number) => {
    if (lines.length <= 2) return;
    setLines(lines.filter((_, idx) => idx !== i));
  };
  const updateLine = (i: number, field: keyof JournalLine, value: string | number) => {
    const next = [...lines];
    next[i] = { ...next[i], [field]: value };
    setLines(next);
  };

  const totalDebit = lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((s, l) => s + (Number(l.credit) || 0), 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const createMutation = useMutation({
    mutationFn: (header: JournalHeaderFormData) =>
      apiService.post(`/pharmacies/${pharmacyId}/accounting/journal-entries`, {
        ...header,
        lines: lines.map((l) => ({ ...l, debit: Number(l.debit), credit: Number(l.credit) })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Écriture de journal créée avec succès");
      methods.reset();
      setLines([
        { accountId: "", debit: 0, credit: 0, description: "" },
        { accountId: "", debit: 0, credit: 0, description: "" },
      ]);
      onClose();
    },
    onError: () => {
      toast.error("Erreur lors de la création de l'écriture");
    },
  });

  const onSubmit = (data: JournalHeaderFormData) => {
    if (!isBalanced) {
      toast.error("Les totaux débit et crédit doivent être égaux");
      return;
    }
    createMutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Créer une écriture de journal" size="xl">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput<JournalHeaderFormData> name="date" label="Date" type="date" required />
            <FormInput<JournalHeaderFormData> name="reference" label="Référence" />
            <FormInput<JournalHeaderFormData> name="description" label="Description générale" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">Lignes d'écriture</h4>
              <Button type="button" variant="outline" size="sm" onClick={addLine}>
                <Plus className="h-4 w-4 mr-1" /> Ajouter une ligne
              </Button>
            </div>

            {lines.map((line, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-3 items-start border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                <div className="col-span-12 sm:col-span-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Compte</label>
                  <select
                    value={line.accountId}
                    onChange={(e) => updateLine(idx, "accountId", e.target.value)}
                    className="flex w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 h-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    required
                  >
                    <option value="">Sélectionner un compte</option>
                    {accounts.map((a: any) => (
                      <option key={a.id} value={a.id}>{a.accountCode} - {a.accountName}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <Input label="Débit" type="number" step="0.01" value={line.debit || ""} onChange={(e) => updateLine(idx, "debit", e.target.value)} />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <Input label="Crédit" type="number" step="0.01" value={line.credit || ""} onChange={(e) => updateLine(idx, "credit", e.target.value)} />
                </div>
                <div className="col-span-12 sm:col-span-3">
                  <Input label="Description" value={line.description} onChange={(e) => updateLine(idx, "description", e.target.value)} />
                </div>
                <div className="col-span-4 sm:col-span-1 flex items-center mt-7">
                  {lines.length > 2 && (
                    <button type="button" onClick={() => removeLine(idx)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 space-y-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-1 ${isBalanced ? "text-green-600" : "text-red-600"}`}>
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Total Débit: {totalDebit.toLocaleString()} FC</span>
              </div>
              <div className={`flex items-center gap-1 ${isBalanced ? "text-green-600" : "text-red-600"}`}>
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Total Crédit: {totalCredit.toLocaleString()} FC</span>
              </div>
              {!isBalanced && totalDebit + totalCredit > 0 && (
                <span className="text-sm text-red-600 font-medium">
                  Écart: {Math.abs(totalDebit - totalCredit).toLocaleString()} FC
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={createMutation.isPending}>
                Annuler
              </Button>
              <Button type="submit" className="flex-1" loading={createMutation.isPending} disabled={!isBalanced}>
                Créer l'écriture
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
