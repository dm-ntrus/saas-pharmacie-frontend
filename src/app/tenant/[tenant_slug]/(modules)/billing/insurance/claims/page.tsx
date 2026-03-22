"use client";

import React from "react";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Card, Button, EmptyState } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

export default function InsuranceClaimsPage() {
  const { buildPath } = useTenantPath();
  return (
    <ModuleGuard module="billing" requiredPermissions={[Permission.INVOICES_READ]}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={buildPath("/billing/insurance")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Réclamations assurance</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Soumettre et suivre les réclamations</p>
          </div>
        </div>
        <Card>
          <EmptyState title="Réclamations" description="Soumettez une réclamation depuis le détail d'une facture assurance." />
        </Card>
      </div>
    </ModuleGuard>
  );
}
