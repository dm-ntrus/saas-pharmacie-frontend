"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Button, Modal, FormInput, Input } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import toast from "react-hot-toast";

const invoiceHeaderSchema = z.object({
  customerId: z.string().min(1, "Le client est requis"),
  invoiceNumber: z.string().min(1, "Le numéro de facture est requis"),
  invoiceDate: z.string().min(1, "La date de facture est requise"),
  dueDate: z.string().min(1, "La date d'échéance est requise"),
});

type InvoiceHeaderFormData = z.infer<typeof invoiceHeaderSchema>;

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  pharmacyId: string;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  pharmacyId,
}) => {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  const methods = useForm<InvoiceHeaderFormData>({
    resolver: zodResolver(invoiceHeaderSchema),
    defaultValues: {
      customerId: "",
      invoiceNumber: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
  });

  const addItem = () => setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  const removeItem = (i: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== i));
  };
  const updateItem = (i: number, field: keyof InvoiceItem, value: string | number) => {
    const next = [...items];
    next[i] = { ...next[i], [field]: value };
    setItems(next);
  };

  const subtotal = items.reduce((s, it) => s + it.quantity * Number(it.unitPrice), 0);
  const taxRate = 0.16;
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  const createInvoiceMutation = useMutation({
    mutationFn: (header: InvoiceHeaderFormData) =>
      apiService.post(`/pharmacies/${pharmacyId}/accounting/invoices`, {
        ...header,
        items: items.map((it) => ({ ...it, amount: it.quantity * it.unitPrice })),
        subtotal,
        taxAmount,
        totalAmount,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Facture créée avec succès");
      methods.reset();
      setItems([{ description: "", quantity: 1, unitPrice: 0 }]);
      onClose();
    },
    onError: () => {
      toast.error("Erreur lors de la création de la facture");
    },
  });

  const onSubmit = (data: InvoiceHeaderFormData) => {
    createInvoiceMutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Créer une facture" size="xl">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput<InvoiceHeaderFormData>
              name="invoiceNumber"
              label="Numéro de facture"
              required
            />
            <FormInput<InvoiceHeaderFormData>
              name="customerId"
              label="Client"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput<InvoiceHeaderFormData>
              name="invoiceDate"
              label="Date de facture"
              type="date"
              required
            />
            <FormInput<InvoiceHeaderFormData>
              name="dueDate"
              label="Date d'échéance"
              type="date"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">Articles</h4>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" />
                Ajouter un article
              </Button>
            </div>

            {items.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-3 items-start border border-slate-200 dark:border-slate-700 rounded-lg p-3"
              >
                <div className="col-span-12 sm:col-span-6">
                  <Input
                    label="Description"
                    value={item.description}
                    onChange={(e) => updateItem(idx, "description", e.target.value)}
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <Input
                    label="Quantité"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <Input
                    label="Prix unitaire"
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(idx, "unitPrice", Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 flex items-center mt-7">
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(idx)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <div className="col-span-12">
                  <span className="text-sm font-medium">
                    Total: {(item.quantity * Number(item.unitPrice)).toLocaleString()} FC
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Sous-total:</span>
              <span>{subtotal.toLocaleString()} FC</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">TVA (16%):</span>
              <span>{taxAmount.toLocaleString()} FC</span>
            </div>
            <div className="flex justify-between font-bold border-t border-slate-200 dark:border-slate-700 pt-2">
              <span>Total:</span>
              <span>{totalAmount.toLocaleString()} FC</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={createInvoiceMutation.isPending}>
              Annuler
            </Button>
            <Button type="submit" loading={createInvoiceMutation.isPending}>
              Créer la facture
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
