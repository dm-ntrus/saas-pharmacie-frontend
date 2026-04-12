import React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Button, Modal } from "@/design-system";
import apiClient from "@/lib/api";
import { AlertTriangle } from "lucide-react";

interface DeletePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
  pharmacyId: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeletePatientModal: React.FC<DeletePatientModalProps> = ({
  isOpen,
  onClose,
  patient,
  pharmacyId,
  onConfirm,
  isLoading = false,
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteMutation = useMutation({
    mutationFn: () => apiClient?.deletePatient(pharmacyId, patient.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient supprimé avec succès");
      router.push("/patients");
      onClose();
      onConfirm();
    },
    onError: () => {
      toast.error("Erreur lors de la suppression du patient");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Supprimer le patient"
      size="md"
    >
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-900">
            {patient.firstName} {patient.lastName}
          </p>
          <p className="text-sm text-gray-600">N° {patient.patientNumber}</p>
          <p className="text-sm text-gray-600">Téléphone: {patient.phone}</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">
            <strong>Attention:</strong> Cette action est irréversible. Toutes
            les données du patient, y compris l'historique des ordonnances et
            des consultations, seront définitivement supprimées.
          </p>
        </div>

        <p className="text-sm text-gray-600">
          Êtes-vous absolument sûr de vouloir supprimer ce patient ?
        </p>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={deleteMutation.isPending}
          >
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            className="flex-1"
            loading={deleteMutation.isPending}
            disabled={deleteMutation.isPending}
          >
            Supprimer définitivement
          </Button>
        </div>
      </div>
    </Modal>
  );
};
