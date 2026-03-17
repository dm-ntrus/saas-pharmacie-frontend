"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { Button, Card, CardContent, EmptyState } from "@/components/ui";
import { ArrowLeft, QrCode } from "lucide-react";

export default function DigitalPrescriptionPage() {
  return (
    <ModuleGuard
      module="prescriptions"
      requiredPermissions={[Permission.PRESCRIPTIONS_READ]}
    >
      <DigitalPrescriptionContent />
    </ModuleGuard>
  );
}

function DigitalPrescriptionContent() {
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
          e-Ordonnance / QR
        </h1>
      </div>
      <Card>
        <CardContent className="py-12">
          <EmptyState
            icon={<QrCode className="w-12 h-12 text-slate-400" />}
            title="Scanner e-ordonnance"
            description="Scannez un QR code ou DataMatrix pour importer une ordonnance électronique. Fonctionnalité à venir (caméra / upload)."
          />
        </CardContent>
      </Card>
    </div>
  );
}
