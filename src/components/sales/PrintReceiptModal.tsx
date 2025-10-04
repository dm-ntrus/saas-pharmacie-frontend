import React from "react";
import { Button, Modal } from "@/design-system";
import type { Sale } from "@/types";

interface PrintReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({
  isOpen,
  onClose,
  sale,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reçu de vente" size="2xl">
      {/* Receipt Content */}
      <div className="p-8" id="receipt-content">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">PharmacySaaS</h2>
          <p className="text-sm text-gray-600">
            123 Rue de la Pharmacie, 75001 Paris
          </p>
          <p className="text-sm text-gray-600">Tél: +33 1 23 45 67 89</p>
        </div>

        <div className="border-t border-b border-gray-200 py-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">N° de vente</p>
              <p className="font-medium">{sale.saleNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Date</p>
              <p className="font-medium">
                {new Date(sale?.createdAt).toLocaleString("fr-FR")}
              </p>
            </div>
            {sale.patient && (
              <>
                <div>
                  <p className="text-gray-600">Patient</p>
                  <p className="font-medium">
                    {sale.patient.firstName} {sale.patient.lastName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Caissier</p>
                  <p className="font-medium">
                    {sale.cashier?.firstName} {sale.cashier?.lastName}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2">Article</th>
              <th className="text-center py-2">Qté</th>
              <th className="text-right py-2">Prix unit.</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items?.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-2">{item?.product?.name}</td>
                <td className="text-center py-2">{item?.quantity}</td>
                <td className="text-right py-2">
                  {formatCurrency(item?.unitPrice)}
                </td>
                <td className="text-right py-2 font-medium">
                  {formatCurrency(item?.totalPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Sous-total</span>
            <span>{formatCurrency(sale.subtotal)}</span>
          </div>
          {sale.discountAmount > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Remise</span>
              <span>-{formatCurrency(sale.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">TVA (18%)</span>
            <span>{formatCurrency(sale.taxAmount)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
            <span>Total</span>
            <span>{formatCurrency(sale.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payé</span>
            <span>{formatCurrency(sale.amountPaid)}</span>
          </div>
          {sale.changeGiven > 0 && (
            <div className="flex justify-between text-sm font-medium text-green-600">
              <span>Rendu</span>
              <span>{formatCurrency(sale.changeGiven)}</span>
            </div>
          )}
        </div>

        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">Merci de votre visite !</p>
          <p className="text-xs text-gray-500 mt-2">
            Ce ticket fait office de facture
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          Fermer
        </Button>
        <Button type="button" onClick={handlePrint} className="flex-1">
          Imprimer
        </Button>
      </div>
    </Modal>
  );
};
