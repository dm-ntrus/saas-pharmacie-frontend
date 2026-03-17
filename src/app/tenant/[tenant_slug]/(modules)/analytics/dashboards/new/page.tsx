"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useCreateAnalyticsDashboard } from "@/hooks/api/useAnalytics";
import { Button, Card, CardContent, Input } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

export default function NewDashboardPage() {
  return (
    <ModuleGuard module="analytics" requiredPermissions={[Permission.BI_WRITE]}>
      <NewDashboardContent />
    </ModuleGuard>
  );
}

function NewDashboardContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const createMutation = useCreateAnalyticsDashboard();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate(
      { name: name.trim(), description: description.trim() || undefined },
      { onSuccess: (data: { id?: string }) => router.push(buildPath(`/analytics/dashboards/${data?.id ?? ""}`)) }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/analytics/dashboards"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nouveau dashboard</h1>
          <p className="text-sm text-slate-500">Créez un dashboard personnalisé</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-4 space-y-4">
            <Input label="Nom *" value={name} onChange={(e) => setName(e.target.value)} required placeholder="ex: Tableau ventes" />
            <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optionnel" />
          </CardContent>
        </Card>
        <div className="flex gap-2 mt-4">
          <Button type="button" variant="outline" onClick={() => router.push(buildPath("/analytics/dashboards"))}>Annuler</Button>
          <Button type="submit" disabled={createMutation.isPending || !name.trim()}>{createMutation.isPending ? "Création..." : "Créer"}</Button>
        </div>
      </form>
    </div>
  );
}
