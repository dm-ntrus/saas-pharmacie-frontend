import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { Button, Input, Modal } from "@/design-system";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { toast } from "react-hot-toast";
import { DispensePrescriptionDto } from "@/types";

interface DispensePrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: any;
}

const dispenseSchema = Yup.object().shape({
  dispenserId: Yup.string().required("Le dispensateur est requis"),
  items: Yup.array()
    .of(
      Yup.object().shape({
        prescriptionItemId: Yup.string().required(),
        quantityDispensed: Yup.number()
          .min(1, "La quantité doit être au moins 1")
          .required("La quantité est requise"),
        batchNumber: Yup.string().optional(),
      })
    )
    .min(1, "Au moins un médicament doit être dispensé"),
});

export const DispensePrescriptionModal: React.FC<
  DispensePrescriptionModalProps
> = ({ isOpen, onClose, prescription }) => {
  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => apiClient.getCurrentUser(),
  });

  const dispenseMutation = useMutation({
    mutationFn: (data: DispensePrescriptionDto) =>
      apiClient.dispensePrescription(prescription.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-prescriptions"] });
      toast.success("Ordonnance dispensée avec succès");
      handleClose();
    },
    onError: () => {
      toast.error("Erreur lors de la dispensation");
    },
  });

  const formik = useFormik({
    initialValues: {
      dispenserId: user?.id || "",
      items: prescription.items.map((item: any) => ({
        prescriptionItemId: item.id,
        quantityDispensed: item.quantity,
        batchNumber: "",
      })),
    },
    validationSchema: dispenseSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      dispenseMutation.mutate(values);
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={<DocumentTextIcon className="h-5 w-5 text-green-600" />}
      title="Dispenser l'ordonnance"
      size="2xl"
    >
      <form onSubmit={formik.handleSubmit} className="mt-4 space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-900">
            N° {prescription.prescriptionNumber}
          </p>
          <p className="text-sm text-gray-600">Dr. {prescription.doctorName}</p>
          <p className="text-sm text-gray-600">
            Patient: {prescription.patient?.firstName}{" "}
            {prescription.patient?.lastName}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900">
            Médicaments à dispenser
          </h3>
          {formik.values.items.map((item, index) => {
            const prescriptionItem = prescription.items[index];
            return (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg space-y-3"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {prescriptionItem.product?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantité prescrite: {prescriptionItem.quantity}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    label="Quantité dispensée"
                    min="1"
                    max={prescriptionItem.quantity}
                    {...formik.getFieldProps(
                      `items.${index}.quantityDispensed`
                    )}
                  />
                  <Input
                    label="N° de lot"
                    placeholder="Optionnel"
                    {...formik.getFieldProps(`items.${index}.batchNumber`)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
            disabled={dispenseMutation.isPending}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="flex-1"
            loading={dispenseMutation.isPending}
            disabled={dispenseMutation.isPending}
          >
            Confirmer la dispensation
          </Button>
        </div>
      </form>
    </Modal>
  );
};
