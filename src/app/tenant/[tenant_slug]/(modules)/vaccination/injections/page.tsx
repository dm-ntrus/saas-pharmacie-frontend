"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { Card, CardContent, Button } from "@/components/ui";
import { Syringe, Calendar } from "lucide-react";

export default function InjectionsPage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ]}
    >
      <InjectionsContent />
    </ModuleGuard>
  );
}

function InjectionsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Registre des injections
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Accédez aux injections via les rendez-vous complétés ou le dossier patient.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Chaque injection est enregistrée lors de l’administration d’une dose (depuis un
            rendez-vous). Pour consulter une injection, ouvrez le détail d’un RDV terminé ou
            le dossier patient.
          </p>
          <Button
            leftIcon={<Calendar className="w-4 h-4" />}
            onClick={() => router.push(buildPath("/vaccination/appointments"))}
          >
            Voir les rendez-vous
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
