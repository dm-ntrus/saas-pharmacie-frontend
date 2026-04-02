"use client";

import React, { forwardRef } from "react";
import { formatCurrency } from "@/utils/formatters";

export interface ReportColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  format?: "currency" | "number" | "date" | "text";
}

export interface ReportPrintData {
  title: string;
  subtitle?: string;
  pharmacyName: string;
  dateRange?: string;
  generatedBy?: string;
  columns: ReportColumn[];
  rows: Record<string, any>[];
  summary?: { label: string; value: string }[];
}

export const ReportPrint = forwardRef<HTMLDivElement, { data: ReportPrintData }>(
  ({ data }, ref) => {
    const formatValue = (value: any, format?: string) => {
      if (value == null) return "—";
      switch (format) {
        case "currency":
          return formatCurrency(typeof value === "string" ? parseFloat(value) : value);
        case "number":
          return new Intl.NumberFormat("fr-FR").format(value);
        case "date":
          return new Date(value).toLocaleDateString("fr-FR");
        default:
          return String(value);
      }
    };

    return (
      <div ref={ref} className="receipt-print-area bg-white text-black p-8 max-w-[297mm] mx-auto text-sm">
        {/* Header */}
        <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold">{data.title}</h1>
            {data.subtitle && <p className="text-sm text-gray-600 mt-1">{data.subtitle}</p>}
            {data.dateRange && <p className="text-xs text-gray-500 mt-1">Période: {data.dateRange}</p>}
          </div>
          <div className="text-right">
            <p className="font-bold">{data.pharmacyName}</p>
            <p className="text-xs text-gray-500 mt-1">
              Généré le {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            {data.generatedBy && <p className="text-xs text-gray-500">Par: {data.generatedBy}</p>}
          </div>
        </div>

        {/* Table */}
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-xs font-bold text-left">#</th>
              {data.columns.map((col) => (
                <th
                  key={col.key}
                  className={`p-2 border text-xs font-bold text-${col.align || "left"}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                <td className="p-2 border text-xs text-gray-500">{i + 1}</td>
                {data.columns.map((col) => (
                  <td
                    key={col.key}
                    className={`p-2 border text-${col.align || "left"}`}
                  >
                    {formatValue(row[col.key], col.format)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        {data.summary && data.summary.length > 0 && (
          <div className="border-t-2 border-black pt-4">
            <div className="flex justify-end">
              <div className="w-64">
                {data.summary.map((s, i) => (
                  <div key={i} className="flex justify-between py-1 text-sm">
                    <span className="font-medium">{s.label}:</span>
                    <span className="font-bold">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300">
          <p className="text-center text-[10px] text-gray-400">
            {data.pharmacyName} — Rapport confidentiel — Page 1/1
          </p>
        </div>
      </div>
    );
  },
);

ReportPrint.displayName = "ReportPrint";
