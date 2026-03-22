"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useSupplierById, useSupplierPerformance } from "@/hooks/api/useSuppliers";
import { Card, CardContent, CardHeader, CardTitle, Button, Skeleton, ErrorBanner } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

export default function SupplierPerformancePage() {
  return (
    <ModuleGuard module="suppliers" requiredPermissions={[Permission.SUPPLIER_PERFORMANCE_READ]}>
      <SupplierPerformance />
    </ModuleGuard>
  );
}

function SupplierPerformance() {
  const params = useParams();
  const { buildPath } = useTenantPath();
  const id = (params?.id as string) ?? "";

  const { data: supplier, isLoading: ls } = useSupplierById(id);
  const { data: performance, isLoading: lp, error } = useSupplierPerformance(id);

  const s = supplier as { name?: string } | undefined;

  if (error) return <ErrorBanner title="Erreur" message="Impossible de charger la performance" />;
  if (ls) return <Skeleton className="h-48 w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={buildPath(`/suppliers/${id}`)}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Performance · {s?.name ?? ""}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Analyse de performance du fournisseur</p>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle>Indicateurs</CardTitle></CardHeader>
        <CardContent>
          {lp ? <Skeleton className="h-32 w-full" /> : performance ? (
            <pre className="text-xs overflow-auto max-h-96 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">{JSON.stringify(performance, null, 2)}</pre>
          ) : (
            <p className="text-sm text-slate-500">Aucune donnée de performance disponible.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
