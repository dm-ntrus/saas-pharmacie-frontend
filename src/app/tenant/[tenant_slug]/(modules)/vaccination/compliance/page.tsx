"use client";

import React from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useVaccinationComplianceReport } from "@/hooks/api/useVaccination";
import { Button, Card, CardContent, ErrorBanner, Skeleton } from "@/components/ui";
import { useState } from "react";

export default function CompliancePage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ]}
    >
      <ComplianceContent />
    </ModuleGuard>
  );
}

function ComplianceContent() {
  const [startDate, setStartDate] = useState(() =>
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));

  const { data: report, isLoading, error, refetch } = useVaccinationComplianceReport(
    startDate,
    endDate
  );

  if (error) {
    return (
      <ErrorBanner
        message="Erreur de chargement du rapport"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Rapport de conformité
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Conformité vaccination sur la période choisie
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Du</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Au</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : report ? (
        <Card>
          <CardContent className="p-4">
            <pre className="text-xs overflow-auto max-h-96 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              {JSON.stringify(report, null, 2)}
            </pre>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-slate-500">
            Sélectionnez une période et chargez le rapport.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
