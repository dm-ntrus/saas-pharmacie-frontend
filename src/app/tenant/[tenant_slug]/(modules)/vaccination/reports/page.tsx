"use client";

import React from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useVaccinationAnalytics } from "@/hooks/api/useVaccination";
import { Card, CardContent, ErrorBanner, Skeleton } from "@/components/ui";
import { useState } from "react";

export default function VaccinationReportsPage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ]}
    >
      <VaccinationReportsContent />
    </ModuleGuard>
  );
}

function VaccinationReportsContent() {
  const [startDate, setStartDate] = useState(() =>
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));

  const { data: analytics, isLoading, error, refetch } = useVaccinationAnalytics({
    startDate,
    endDate,
  });

  if (error) {
    return (
      <ErrorBanner
        message="Erreur de chargement des analytics"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Rapports et analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Statistiques vaccinations sur la période
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
      ) : analytics ? (
        <Card>
          <CardContent className="p-4">
            <pre className="text-xs overflow-auto max-h-96 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              {JSON.stringify(analytics, null, 2)}
            </pre>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-slate-500">
            Sélectionnez une période pour afficher les analytics.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
