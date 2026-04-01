import React from "react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { Button, Modal } from "@/design-system";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast";

interface VerifyPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: any;
}

export const VerifyPrescriptionModal: React.FC<
  VerifyPrescriptionModalProps
> = ({ isOpen, onClose, prescription }) => {
  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => apiClient.getCurrentUser(),
  });

  const verifyMutation = useMutation({
    mutationFn: () =>
      apiClient.verifyPrescription(prescription.id, { verifierId: (user as any)?.id || "" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-prescriptions"] });
      toast.success("Ordonnance vérifiée avec succès");
      onClose();
    },
    onError: () => {
      toast.error("Erreur lors de la vérification");
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={<DocumentTextIcon className="h-5 w-5 text-sky-600" />}
      title="Vérifier l'ordonnance"
      size="md"
    >
      <div className="mt-4 space-y-4">
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

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Attention:</strong> En vérifiant cette ordonnance, vous
            confirmez avoir examiné la prescription et validé sa conformité.
          </p>
        </div>

        <p className="text-sm text-gray-600">
          Voulez-vous vérifier cette ordonnance ?
        </p>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={verifyMutation.isPending}
          >
            Annuler
          </Button>
          <Button
            onClick={() => verifyMutation.mutate()}
            className="flex-1"
            loading={verifyMutation.isPending}
            disabled={verifyMutation.isPending}
          >
            Vérifier
          </Button>
        </div>
      </div>
    </Modal>
  );
};
