import React, { useState } from "react";
import { useFormik } from "formik";
import { Button, Input, Modal } from "@/design-system";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import { CreateInvoiceDto } from "@/types";

const invoiceSchema = Yup.object({
  customerId: Yup.string().required("Le client est requis"),
  invoiceNumber: Yup.string().required("Le numéro de facture est requis"),
  invoiceDate: Yup.date().required("La date de facture est requise"),
  dueDate: Yup.date().required("La date d'échéance est requise"),
  items: Yup.array()
    .of(
      Yup.object({
        description: Yup.string().required("Description requise"),
        quantity: Yup.number()
          .min(1, "Quantité minimale 1")
          .required("Quantité requise"),
        unitPrice: Yup.number()
          .min(0, "Prix unitaire positif")
          .required("Prix unitaire requis"),
      })
    )
    .min(1, "Au moins un article est requis"),
  subtotal: Yup.number().min(0, "Sous-total positif").required(),
  taxAmount: Yup.number().min(0, "Montant taxe positif").required(),
  totalAmount: Yup.number().min(0, "Montant total positif").required(),
});

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const createInvoiceMutation = useMutation({
    mutationFn: async (data: CreateInvoiceDto) => apiClient.createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Journal créée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création d'un journal");
    },
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * Number(item.unitPrice),
    0
  );
  const taxRate = 0.16; // 16% TVA
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  const formik = useFormik({
    initialValues: {
      customerId: "",
      invoiceNumber: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 30 jours
    },
    validationSchema: invoiceSchema,
    onSubmit: (values) => {
      createInvoiceMutation.mutate({
        ...values,
        items: items.map((item) => ({
          ...item,
          amount: item.quantity * item.unitPrice,
        })),
        subtotal,
        taxAmount,
        totalAmount,
      });
      onClose();
      setItems([{ description: "", quantity: 1, unitPrice: 0 }]);
      formik.resetForm();
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Créer une facture"
      size="3xl"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Numéro de facture"
            name="invoiceNumber"
            value={formik.values.invoiceNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.invoiceNumber && formik.errors.invoiceNumber
                ? formik.errors.invoiceNumber
                : undefined
            }
            required
          />
          <Input
            label="Client"
            name="customerId"
            value={formik.values.customerId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.customerId && formik.errors.customerId
                ? formik.errors.customerId
                : undefined
            }
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date de facture"
            name="invoiceDate"
            type="date"
            value={formik.values.invoiceDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.invoiceDate && formik.errors.invoiceDate
                ? formik.errors.invoiceDate
                : undefined
            }
            required
          />
          <Input
            label="Date d'échéance"
            name="dueDate"
            type="date"
            value={formik.values.dueDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.dueDate && formik.errors.dueDate
                ? formik.errors.dueDate
                : undefined
            }
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900">Articles</h4>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <PlusIcon className="h-4 w-4 mr-1" />
              Ajouter un article
            </Button>
          </div>

          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-4 items-start border border-gray-300 rounded-lg p-3"
            >
              <div className="col-span-6">
                <Input
                  label="Description"
                  value={item.description}
                  onChange={(e) =>
                    updateItem(index, "description", e.target.value)
                  }
                  required
                />
              </div>
              <div className="col-span-2">
                <Input
                  label="Quantité"
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, "quantity", e.target.value)
                  }
                  required
                />
              </div>
              <div className="col-span-3">
                <Input
                  label="Prix unitaire"
                  type="number"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => {
                    updateItem(index, "unitPrice", e.target.value);
                  }}
                  required
                />
              </div>
              <div className="col-span-1 flex items-center mt-8">
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
              <div className="col-span-12">
                <span className="text-sm font-medium">
                  Total:{" "}
                  {(item.quantity * Number(item.unitPrice)).toLocaleString()} FC
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-300 pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Sous-total:</span>
            <span className="font-medium">{subtotal.toLocaleString()} FC</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">TVA (16%):</span>
            <span className="font-medium">{taxAmount.toLocaleString()} FC</span>
          </div>
          <div className="flex justify-between font-bold border-t border-gray-300 pt-2">
            <span>Total:</span>
            <span>{totalAmount.toLocaleString()} FC</span>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={createInvoiceMutation.isPending}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="flex-1"
            loading={createInvoiceMutation.isPending}
            disabled={createInvoiceMutation.isPending}
          >
            Créer la facture
          </Button>
        </div>
      </form>
    </Modal>
  );
};
