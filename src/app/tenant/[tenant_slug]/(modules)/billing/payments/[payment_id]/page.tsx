"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Card, Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PaymentDetail } from "@/components/payments/PaymentDetail";
import { useTenantContext } from "@/context/TenantContext";

export default function PaymentDetailPage() {
  return (
    <ModuleGuard module="billing" requiredPermissions={[Permission.PAYMENTS_READ]}>
      <PaymentDetailContent />
    </ModuleGuard>
  );
}

function PaymentDetailContent() {
  const params = useParams();
  const { buildPath } = useTenantPath();
  const { currentTenant } = useTenantContext();

  const paymentId = params.payment_id as string;
  const tenantId = currentTenant?.id || '';

  if (!tenantId) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Tenant non trouvé</p>
      </div>
    );
  }

  if (!paymentId) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">ID de paiement manquant</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={buildPath("/billing/payments")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Détails du paiement
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              ID: {paymentId}
            </p>
          </div>
        </div>
      </div>

      {/* Détails du paiement */}
      <PaymentDetail
        paymentId={paymentId}
        tenantId={tenantId}
        showActions={true}
        onUpdate={(payment) => {
          // Vous pourriez ajouter une notification ici
          console.log('Payment updated:', payment);
        }}
      />

      {/* Informations supplémentaires */}
      <Card>
        <div className="p-6">
          <h3 className="font-semibold mb-4">À propos du paiement manuel</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Le paiement manuel permet aux utilisateurs de fournir une preuve de paiement
              (reçu, capture d'écran, etc.) pour les factures.
            </p>
            <p>
              Une fois la preuve uploadée, un administrateur doit vérifier le document
              et approuver ou rejeter le paiement.
            </p>
            <p>
              Cette méthode est idéale pour les virements bancaires, les paiements en espèces,
              ou tout autre mode de paiement non intégré directement dans la plateforme.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}