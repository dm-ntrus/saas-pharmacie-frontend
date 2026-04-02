"use client";

import React from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText } from "lucide-react";
import { Button, Modal, FormInput, Input } from "@/components/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const dispenseItemSchema = z.object({
  prescriptionItemId: z.string().min(1),
  quantityDispensed: z.number().min(1, "La quantité doit être au moins 1"),
  batchNumber: z.string().optional(),
});

const dispenseSchema = z.object({
  dispenserId: z.string().min(1, "Le dispensateur est requis"),
  items: z.array(dispenseItemSchema).min(1, "Au moins un médicament doit être dispensé"),
});

type DispenseFormData = z.infer<typeof dispenseSchema>;

interface DispensePrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: any;
  pharmacyId: string;
}

export const DispensePrescriptionModal: React.FC<DispensePrescriptionModalProps> = ({
  isOpen,
  onClose,
  prescription,
  pharmacyId,
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const methods = useForm<DispenseFormData>({
    resolver: zodResolver(dispenseSchema),
    defaultValues: {
      dispenserId: user?.id || "",
      items: prescription.items?.map((item: any) => ({
        prescriptionItemId: item.id,
        quantityDispensed: item.quantity,
        batchNumber: "",
      })) || [],
    },
  });

  const dispenseMutation = useMutation({
    mutationFn: (data: DispenseFormData) =>
      apiService.post(
        `/pharmacies/${pharmacyId}/prescriptions/${prescription.id}/dispense`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-prescriptions"] });
      toast.success("Ordonnance dispensée avec succès");
      methods.reset();
      onClose();
    },
    onError: () => {
      toast.error("Erreur lors de la dispensation");
    },
  });

  const onSubmit = (data: DispenseFormData) => {
    dispenseMutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dispenser l'ordonnance" size="xl">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              N° {prescription.prescriptionNumber}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dr. {prescription.doctorName}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Patient: {prescription.patient?.firstName} {prescription.patient?.lastName}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Médicaments à dispenser
            </h3>
            {prescription.items?.map((prescriptionItem: any, idx: number) => (
              <div key={idx} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {prescriptionItem.product?.name}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Quantité prescrite: {prescriptionItem.quantity}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormInput<DispenseFormData>
                    name={`items.${idx}.quantityDispensed` as any}
                    label="Quantité dispensée"
                    type="number"
                    min={1}
                    max={prescriptionItem.quantity}
                  />
                  <FormInput<DispenseFormData>
                    name={`items.${idx}.batchNumber` as any}
                    label="N° de lot"
                    placeholder="Optionnel"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={dispenseMutation.isPending}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1" loading={dispenseMutation.isPending}>
              Confirmer la dispensation
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
