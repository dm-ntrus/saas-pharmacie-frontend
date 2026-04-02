"use client";

import React, { forwardRef } from "react";

export interface PrescriptionPrintData {
  prescriptionNumber: string;
  date: string;
  validUntil: string;
  pharmacyName: string;
  pharmacyAddress?: string;
  pharmacyPhone?: string;
  doctorName: string;
  doctorLicense?: string;
  doctorPhone?: string;
  patientName: string;
  patientBirthDate?: string;
  items: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    instructions?: string;
  }[];
  notes?: string;
  dispensedBy?: string;
  dispensedDate?: string;
}

export const PrescriptionPrint = forwardRef<HTMLDivElement, { data: PrescriptionPrintData }>(
  ({ data }, ref) => {
    return (
      <div ref={ref} className="receipt-print-area bg-white text-black p-8 max-w-[210mm] mx-auto text-sm" style={{ fontFamily: "serif" }}>
        {/* Header */}
        <div className="border-b-2 border-black pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold uppercase">{data.pharmacyName}</h1>
              {data.pharmacyAddress && <p className="text-xs mt-1">{data.pharmacyAddress}</p>}
              {data.pharmacyPhone && <p className="text-xs">Tél: {data.pharmacyPhone}</p>}
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold">ORDONNANCE</h2>
              <p className="text-xs mt-1">N° {data.prescriptionNumber}</p>
              <p className="text-xs">Date: {data.date}</p>
              <p className="text-xs">Valide jusqu&apos;au: {data.validUntil}</p>
            </div>
          </div>
        </div>

        {/* Doctor + Patient */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="border border-gray-300 rounded p-3">
            <h3 className="font-bold text-xs uppercase mb-2 text-gray-500">Médecin prescripteur</h3>
            <p className="font-semibold">Dr. {data.doctorName}</p>
            {data.doctorLicense && <p className="text-xs">Licence: {data.doctorLicense}</p>}
            {data.doctorPhone && <p className="text-xs">Tél: {data.doctorPhone}</p>}
          </div>
          <div className="border border-gray-300 rounded p-3">
            <h3 className="font-bold text-xs uppercase mb-2 text-gray-500">Patient</h3>
            <p className="font-semibold">{data.patientName}</p>
            {data.patientBirthDate && <p className="text-xs">Date de naissance: {data.patientBirthDate}</p>}
          </div>
        </div>

        {/* Medications */}
        <div className="mb-6">
          <h3 className="font-bold uppercase text-xs text-gray-500 mb-3">Médicaments prescrits</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2 border text-xs font-bold">Médicament</th>
                <th className="text-left p-2 border text-xs font-bold">Dosage</th>
                <th className="text-left p-2 border text-xs font-bold">Fréquence</th>
                <th className="text-left p-2 border text-xs font-bold">Durée</th>
                <th className="text-center p-2 border text-xs font-bold">Qté</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, i) => (
                <React.Fragment key={i}>
                  <tr className={i % 2 === 1 ? "bg-gray-50" : ""}>
                    <td className="p-2 border font-medium">{item.name}</td>
                    <td className="p-2 border">{item.dosage}</td>
                    <td className="p-2 border">{item.frequency}</td>
                    <td className="p-2 border">{item.duration}</td>
                    <td className="p-2 border text-center">{item.quantity}</td>
                  </tr>
                  {item.instructions && (
                    <tr className={i % 2 === 1 ? "bg-gray-50" : ""}>
                      <td colSpan={5} className="px-2 pb-2 border text-xs italic text-gray-600">
                        Instructions: {item.instructions}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes */}
        {data.notes && (
          <div className="mb-6 p-3 border border-gray-300 rounded">
            <h3 className="font-bold text-xs uppercase text-gray-500 mb-1">Notes</h3>
            <p className="text-sm">{data.notes}</p>
          </div>
        )}

        {/* Dispensation */}
        {data.dispensedBy && (
          <div className="mb-6 p-3 bg-gray-50 border border-gray-300 rounded">
            <h3 className="font-bold text-xs uppercase text-gray-500 mb-1">Dispensation</h3>
            <p className="text-sm">Dispensé par: {data.dispensedBy}</p>
            {data.dispensedDate && <p className="text-sm">Date: {data.dispensedDate}</p>}
          </div>
        )}

        {/* Footer */}
        <div className="border-t-2 border-black pt-4 mt-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-gray-500 mb-8">Signature du médecin</p>
              <div className="border-b border-gray-400 w-48" />
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-8">Cachet de la pharmacie</p>
              <div className="border-b border-gray-400 w-48 ml-auto" />
            </div>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-6">
            Document généré le {new Date().toLocaleString("fr-FR")} — {data.pharmacyName}
          </p>
        </div>
      </div>
    );
  },
);

PrescriptionPrint.displayName = "PrescriptionPrint";
