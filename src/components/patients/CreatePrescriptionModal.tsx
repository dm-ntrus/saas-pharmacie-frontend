"use client";

import React, { useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, Plus, Trash2 } from "lucide-react";
import { Button, Modal, FormInput, FormTextarea, Input } from "@/components/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import { toast } from "react-hot-toast";

const prescriptionItemSchema = z.object({
  productId: z.string().min(1, "Le produit est requis"),
  quantity: z.number().min(1, "La quantité doit être au moins 1"),
  dosage: z.string().min(1, "Le dosage est requis"),
  frequency: z.string().min(1, "La fréquence est requise"),
  duration: z.string().min(1, "La durée est requise"),
  instructions: z.string().optional(),
});

const prescriptionSchema = z.object({
  doctorName: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  doctorLicense: z.string().optional(),
  doctorPhone: z.string().optional(),
  prescriptionDate: z.string().min(1, "La date est requise"),
  validUntil: z.string().min(1, "La date de validité est requise"),
  items: z.array(prescriptionItemSchema).min(1, "Au moins un médicament est requis"),
  notes: z.string().optional(),
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

interface CreatePrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  pharmacyId: string;
}

export const CreatePrescriptionModal: React.FC<CreatePrescriptionModalProps> = ({
  isOpen,
  onClose,
  patientId,
  patientName,
  pharmacyId,
}) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const methods = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      doctorName: "",
      doctorLicense: "",
      doctorPhone: "",
      prescriptionDate: new Date().toISOString().split("T")[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      items: [{ productId: "", quantity: 1, dosage: "", frequency: "", duration: "", instructions: "" }],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control: methods.control, name: "items" });

  const { data: productsData } = useQuery({
    queryKey: ["products-search", searchTerm],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/products`, { params: { search: searchTerm, limit: 10 } }).then((r) => r.data),
    enabled: searchTerm.length > 2,
  });
  const products = (productsData as any)?.data ?? productsData ?? [];

  const createMutation = useMutation({
    mutationFn: (data: PrescriptionFormData) =>
      apiService.post(`/pharmacies/${pharmacyId}/prescriptions`, { ...data, patientId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-prescriptions", patientId] });
      toast.success("Ordonnance créée avec succès");
      methods.reset();
      onClose();
    },
    onError: () => {
      toast.error("Erreur lors de la création de l'ordonnance");
    },
  });

  const onSubmit = (data: PrescriptionFormData) => {
    createMutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Nouvelle ordonnance - ${patientName}`} size="xl">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Informations du médecin
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormInput<PrescriptionFormData> name="doctorName" label="Nom du médecin" required />
              <FormInput<PrescriptionFormData> name="doctorLicense" label="Licence" />
              <FormInput<PrescriptionFormData> name="doctorPhone" label="Téléphone" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Dates de validité
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput<PrescriptionFormData> name="prescriptionDate" label="Date de prescription" type="date" required />
              <FormInput<PrescriptionFormData> name="validUntil" label="Valide jusqu'au" type="date" required />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Médicaments prescrits
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({ productId: "", quantity: 1, dosage: "", frequency: "", duration: "", instructions: "" })
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Ajouter
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {fields.map((field, idx) => (
                <div key={field.id} className="p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Médicament #{idx + 1}
                    </span>
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(idx)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Produit</label>
                      <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      />
                      {Array.isArray(products) && products.length > 0 && (
                        <div className="mt-1 max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-md">
                          {products.map((product: any) => (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() => {
                                methods.setValue(`items.${idx}.productId`, product.id);
                                setSearchTerm("");
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm"
                            >
                              {product.name} - {product.sku}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <FormInput<PrescriptionFormData> name={`items.${idx}.quantity` as any} label="Quantité" type="number" min={1} />
                    <FormInput<PrescriptionFormData> name={`items.${idx}.dosage` as any} label="Dosage" placeholder="Ex: 500mg" />
                    <FormInput<PrescriptionFormData> name={`items.${idx}.frequency` as any} label="Fréquence" placeholder="Ex: 3x par jour" />
                    <FormInput<PrescriptionFormData> name={`items.${idx}.duration` as any} label="Durée" placeholder="Ex: 7 jours" />
                    <div className="col-span-2">
                      <FormTextarea<PrescriptionFormData>
                        name={`items.${idx}.instructions` as any}
                        label="Instructions"
                        rows={2}
                        placeholder="Instructions spéciales..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <FormTextarea<PrescriptionFormData>
            name="notes"
            label="Notes additionnelles"
            rows={3}
            placeholder="Notes pour le pharmacien..."
          />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={createMutation.isPending}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1" loading={createMutation.isPending}>
              Créer l'ordonnance
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
