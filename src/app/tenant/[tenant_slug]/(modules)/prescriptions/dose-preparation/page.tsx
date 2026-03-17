"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { Button, Card, CardContent, EmptyState } from "@/components/ui";
import { ArrowLeft, Pill } from "lucide-react";

export default function DosePreparationPage() {
  return (
    <ModuleGuard
      module="prescriptions"
      requiredPermissions={[Permission.PRESCRIPTIONS_READ]}
    >
      <DosePreparationContent />
    </ModuleGuard>
  );
}

function DosePreparationContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(buildPath("/prescriptions"))}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Retour
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Préparation de doses
        </h1>
      </div>
      <Card>
        <CardContent className="py-12">
          <EmptyState
            icon={<Pill className="w-12 h-12 text-slate-400" />}
            title="Doses unitaires & pilulier"
            description="Préparer des doses unitaires ou un pilulier hebdomadaire. Fonctionnalité à venir."
          />
        </CardContent>
      </Card>
    </div>
  );
}
