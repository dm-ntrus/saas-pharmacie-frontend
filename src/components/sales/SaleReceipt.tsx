"use client";

import React, { forwardRef } from "react";
import { formatCurrency } from "@/utils/formatters";

export interface ReceiptData {
  saleNumber: string;
  date: string;
  pharmacyName: string;
  pharmacyAddress?: string;
  pharmacyPhone?: string;
  cashierName: string;
  patientName?: string;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    discountAmount: number;
  }[];
  subtotal: number;
  totalDiscount: number;
  taxLabel: string;
  taxAmount: number;
  totalAmount: number;
  payments: {
    method: string;
    amount: number;
  }[];
  changeGiven: number;
  insuranceProvider?: string;
  insuranceCoverage?: number;
}

export const SaleReceipt = forwardRef<HTMLDivElement, { data: ReceiptData }>(
  ({ data }, ref) => {
    return (
      <div ref={ref} className="receipt-print-area bg-white text-black p-6 max-w-[80mm] mx-auto text-xs font-mono">
        <div className="text-center mb-4">
          <h1 className="text-sm font-bold uppercase">{data.pharmacyName}</h1>
          {data.pharmacyAddress && (
            <p className="text-[10px]">{data.pharmacyAddress}</p>
          )}
          {data.pharmacyPhone && (
            <p className="text-[10px]">Tél: {data.pharmacyPhone}</p>
          )}
          <div className="border-b border-dashed border-black my-2" />
          <p className="font-bold">REÇU DE VENTE</p>
        </div>

        <div className="space-y-1 mb-3">
          <div className="flex justify-between">
            <span>N°:</span>
            <span className="font-bold">{data.saleNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{data.date}</span>
          </div>
          <div className="flex justify-between">
            <span>Caissier:</span>
            <span>{data.cashierName}</span>
          </div>
          {data.patientName && (
            <div className="flex justify-between">
              <span>Patient:</span>
              <span>{data.patientName}</span>
            </div>
          )}
        </div>

        <div className="border-b border-dashed border-black my-2" />

        <table className="w-full mb-2">
          <thead>
            <tr className="border-b border-dashed border-black">
              <th className="text-left py-1">Article</th>
              <th className="text-right py-1">Qté</th>
              <th className="text-right py-1">P.U.</th>
              <th className="text-right py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, i) => (
              <tr key={i} className="border-b border-dotted border-gray-300">
                <td className="py-1 pr-1 max-w-[120px] truncate">{item.name}</td>
                <td className="text-right py-1">{item.quantity}</td>
                <td className="text-right py-1">{formatCurrency(item.unitPrice)}</td>
                <td className="text-right py-1">
                  {formatCurrency(item.quantity * item.unitPrice - item.discountAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-b border-dashed border-black my-2" />

        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Sous-total:</span>
            <span>{formatCurrency(data.subtotal)}</span>
          </div>
          {data.totalDiscount > 0 && (
            <div className="flex justify-between">
              <span>Remise:</span>
              <span>-{formatCurrency(data.totalDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>{data.taxLabel}:</span>
            <span>{formatCurrency(data.taxAmount)}</span>
          </div>
          {data.insuranceProvider && (
            <div className="flex justify-between">
              <span>Assurance ({data.insuranceCoverage}%):</span>
              <span>{data.insuranceProvider}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-sm border-t border-dashed border-black pt-1">
            <span>TOTAL:</span>
            <span>{formatCurrency(data.totalAmount)}</span>
          </div>
        </div>

        <div className="border-b border-dashed border-black my-2" />

        <div className="space-y-1">
          {data.payments.map((p, i) => (
            <div key={i} className="flex justify-between">
              <span>{p.method}:</span>
              <span>{formatCurrency(p.amount)}</span>
            </div>
          ))}
          {data.changeGiven > 0 && (
            <div className="flex justify-between font-bold">
              <span>Monnaie:</span>
              <span>{formatCurrency(data.changeGiven)}</span>
            </div>
          )}
        </div>

        <div className="border-b border-dashed border-black my-2" />

        <div className="text-center mt-4 space-y-1">
          <p className="text-[10px]">Merci pour votre visite!</p>
          <p className="text-[10px]">Conservez ce reçu pour tout retour</p>
          <p className="text-[10px] text-gray-400 mt-2">
            {new Date().toLocaleString("fr-FR")}
          </p>
        </div>
      </div>
    );
  },
);

SaleReceipt.displayName = "SaleReceipt";
