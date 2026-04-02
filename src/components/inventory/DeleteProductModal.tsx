import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button, Modal } from "@/design-system";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Discontinuer le produit"
      size="md"
    >
      <div className="mt-4 space-y-4">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium text-sm">Action irréversible</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-900">{product.name}</p>
          <p className="text-sm text-gray-600">SKU: {product.sku}</p>
          {product.currentStock > 0 && (
            <p className="text-sm text-orange-600 mt-2">
              Stock actuel: {product.currentStock} unités
            </p>
          )}
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">
            <strong>Attention:</strong> Cette action marquera le produit comme
            discontinué. Il ne sera plus visible dans les ventes mais restera
            dans l'historique.
          </p>
        </div>

        <p className="text-sm text-gray-600">
          Êtes-vous sûr de vouloir discontinuer ce produit ?
        </p>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            className="flex-1"
            loading={isLoading}
            disabled={isLoading}
          >
            Discontinuer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
