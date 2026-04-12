"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { usePaymentById } from "@/hooks/api/useBilling";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Skeleton,
  ErrorBanner,
} from "@/components/ui";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { ArrowLeft } from "lucide-react";
import type { BillingPayment } from "@/types/billing";
import { PAYMENT_METHOD_LABELS } from "@/types/billing";

export default function PaymentDetailPage() {
  return (
    <ModuleGuard module="billing" requiredPermissions={[Permission.PAYMENTS_READ]}>
      <PaymentDetail />
    </ModuleGuard>
  );
}

function PaymentDetail() {
  const params = useParams();
  const { buildPath } = useTenantPath();
  const id = (params?.id as string) ?? "";

  const { data: payment, isLoading, error } = usePaymentById(id);
  const p = payment as BillingPayment | undefined;

  if (error) {
    return (
      <ErrorBanner title="Erreur" message="Impossible de charger le paiement" />
    );
  }

  if (isLoading || !p) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={buildPath("/billing/payments")}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Paiement {(p as any).payment_number ?? p.id}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            <Badge variant={p.status === "completed" ? "success" : "default"} size="sm">
              {p.status}
            </Badge>
            {" · "}
            {formatDate(p.payment_date ?? (p as any).created_at)}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Montant</span>
            <span className="font-semibold text-emerald-600">
              {formatCurrency(Number(p.amount ?? 0))} {p.currency ?? ""}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Méthode</span>
            <span>{PAYMENT_METHOD_LABELS[p.payment_method] ?? p.payment_method}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Type</span>
            <span>{p.is_refund ? "Remboursement" : "Paiement"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Facture</span>
            <Link
              href={buildPath(`/billing/invoices/${p.invoice_id?.toString().replace("invoices:", "") ?? p.invoice_id}`)}
              className="text-emerald-600 hover:underline"
            >
              Voir la facture
            </Link>
          </div>
          {p.notes != null && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 mb-1">Notes</p>
              <p className="text-sm">{String(p.notes)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
