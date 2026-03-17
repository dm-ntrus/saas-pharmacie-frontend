"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

export default function HrLeavesCalendarPage() {
  return (
    <ModuleGuard module="hr" requiredPermissions={[Permission.LEAVES_READ]}>
      <HrLeavesCalendarContent />
    </ModuleGuard>
  );
}

function HrLeavesCalendarContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/hr/leaves"))} leftIcon={<ArrowLeft />}>
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Calendrier des absences</h1>
      </div>
      <p className="text-sm text-slate-500">Vue calendrier des conges (a enrichir avec un composant calendrier).</p>
    </div>
  );
}
