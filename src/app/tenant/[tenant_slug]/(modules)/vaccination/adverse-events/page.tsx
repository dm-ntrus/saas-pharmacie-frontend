"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { Card, CardContent, Button } from "@/components/ui";
import { AlertTriangle, Plus } from "lucide-react";

export default function AdverseEventsPage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ]}
    >
      <AdverseEventsContent />
    </ModuleGuard>
  );
}

function AdverseEventsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Effets indésirables
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Déclaration et suivi des effets indésirables (pharmacovigilance)
          </p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => router.push(buildPath("/vaccination/adverse-events/new"))}
        >
          Déclarer un effet
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-slate-600 dark:text-slate-400">
            La déclaration d’un effet indésirable se fait à partir d’une injection. Ouvrez
            le détail d’une injection puis cliquez sur « Déclarer un effet indésirable », ou
            utilisez le formulaire ci-dessous en renseignant l’ID de l’injection concernée.
          </p>
          <Button
            className="mt-4"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => router.push(buildPath("/vaccination/adverse-events/new"))}
          >
            Déclarer un effet indésirable
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
