import React, { useState } from "react";
import { useFormik } from "formik";
import { Button, Input, Modal } from "@/design-system";
import {
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";

const journalEntrySchema = Yup.object({
  date: Yup.date().required("La date est requise"),
  reference: Yup.string(),
  description: Yup.string(),
  lines: Yup.array()
    .of(
      Yup.object({
        accountId: Yup.string().required("Le compte est requis"),
        debit: Yup.number().min(0, "Le débit doit être positif"),
        credit: Yup.number().min(0, "Le crédit doit être positif"),
        description: Yup.string(),
      })
    )
    .min(2, "Au moins deux lignes sont requises"),
});

interface JournalEntryLine {
  accountId: string;
  debit: number;
  credit: number;
  description: string;
}

interface CreateJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateJournalEntryModal: React.FC<
  CreateJournalEntryModalProps
> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();

  const createJournalEntryMutation = useMutation({
    mutationFn: async (data: any) => apiClient.createJournalEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Journal créée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création d'un journal");
    },
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => apiClient.getAccounts(),
  });

  const [lines, setLines] = useState<JournalEntryLine[]>([
    { accountId: "", debit: 0, credit: 0, description: "" },
    { accountId: "", debit: 0, credit: 0, description: "" },
  ]);

  const addLine = () => {
    setLines([
      ...lines,
      { accountId: "", debit: 0, credit: 0, description: "" },
    ]);
  };

  const removeLine = (index: number) => {
    if (lines.length <= 2) return;
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLine = (
    index: number,
    field: keyof JournalEntryLine,
    value: string | number
  ) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setLines(newLines);
  };

  const totalDebit = lines.reduce(
    (sum, line) => sum + (Number(line.debit) || 0),
    0
  );
  const totalCredit = lines.reduce(
    (sum, line) => sum + (Number(line.credit) || 0),
    0
  );
  const isBalanced = totalDebit === totalCredit;

  const formik = useFormik({
    initialValues: {
      date: new Date().toISOString().split("T")[0],
      reference: "",
      description: "",
    },
    validationSchema: journalEntrySchema,
    onSubmit: (values) => {
      if (!isBalanced) {
        alert("Les totaux débit et crédit doivent être égaux.");
        return;
      }
      createJournalEntryMutation.mutate({
        ...values,
        lines: lines.map((line) => ({
          ...line,
          debit: Number(line.debit),
          credit: Number(line.credit),
        })),
      });
      onClose();
      setLines([
        { accountId: "", debit: 0, credit: 0, description: "" },
        { accountId: "", debit: 0, credit: 0, description: "" },
      ]);
      formik.resetForm();
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Créer une écriture de journal"
      size="3xl"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Date"
            name="date"
            type="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            required
          />
          <Input
            label="Référence"
            name="reference"
            value={formik.values.reference}
            onChange={formik.handleChange}
          />
          <Input
            label="Description générale"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900">Lignes d'écriture</h4>
            <Button type="button" variant="outline" size="sm" onClick={addLine}>
              <PlusIcon className="h-4 w-4 mr-1" />
              Ajouter une ligne
            </Button>
          </div>

          {lines.map((line, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-4 items-start border border-gray-300 rounded-lg p-4"
            >
              <div className="col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compte
                </label>
                <select
                  value={line.accountId}
                  onChange={(e) =>
                    updateLine(index, "accountId", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                  required
                >
                  <option value="">Sélectionner un compte</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.accountCode} - {account.accountName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <Input
                  label="Débit"
                  type="number"
                  step="0.01"
                  value={line.debit || ""}
                  onChange={(e) => updateLine(index, "debit", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Input
                  label="Crédit"
                  type="number"
                  step="0.01"
                  value={line.credit || ""}
                  onChange={(e) => updateLine(index, "credit", e.target.value)}
                />
              </div>
              <div className="col-span-3">
                <Input
                  label="Description"
                  value={line.description}
                  onChange={(e) =>
                    updateLine(index, "description", e.target.value)
                  }
                />
              </div>
              <div className="col-span-1 flex items-center mt-8">
                {lines.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeLine(index)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 space-y-4 border-t border-gray-300">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center ${
                isBalanced ? "text-green-600" : "text-red-600"
              }`}
            >
              <CheckCircleIcon className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">
                Total Débit: {totalDebit.toLocaleString()} FC
              </span>
            </div>
            <div
              className={`flex items-center ${
                isBalanced ? "text-green-600" : "text-red-600"
              }`}
            >
              <CheckCircleIcon className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">
                Total Crédit: {totalCredit.toLocaleString()} FC
              </span>
            </div>
            {!isBalanced && (
              <span className="text-sm text-red-600 font-medium">
                Écart: {Math.abs(totalDebit - totalCredit).toLocaleString()} FC
              </span>
            )}
          </div>
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={createJournalEntryMutation.isPending}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1"
              loading={createJournalEntryMutation.isPending}
              disabled={!isBalanced}
            >
              Créer l'écriture
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
