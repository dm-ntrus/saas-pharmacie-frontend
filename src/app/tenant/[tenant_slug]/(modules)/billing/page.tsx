"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  useSubscriptionContext,
  usePortalSession,
  useCheckoutSession,
} from "@/hooks/api/useBilling";
import {
  Button,
  Card,
  CardContent,
  ErrorBanner,
  Skeleton,
  Badge,
  EmptyState,
} from "@/components/ui";
import {
  CreditCard,
  ExternalLink,
  ArrowRight,
  Receipt,
  Zap,
  Calendar,
} from "lucide-react";
import type { Plan } from "@/types/billing";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function BillingPage() {
  return (
    <ModuleGuard
      module="billing"
      requiredPermissions={[Permission.INVOICES_READ]}
    >
      <BillingContent />
    </ModuleGuard>
  );
}

function BillingContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: context, isLoading, error, refetch } = useSubscriptionContext();
  const portalSession = usePortalSession();
  const checkoutSession = useCheckoutSession();

  const handlePortal = () => {
    const returnUrl =
      typeof window !== "undefined"
        ? window.location.origin + buildPath("/billing")
        : "";
    portalSession.mutate(
      { returnUrl },
      {
        onSuccess: (res) => {
          if (res?.data?.url) window.location.href = res.data.url;
        },
      }
    );
  };

  const planDetails = context?.plan_details as Plan | undefined;
  const recentInvoices = context?.recent_invoices ?? [];
  const status = context?.status ?? "";

  if (error) {
    return (
      <ErrorBanner
        message="Erreur de chargement de l'abonnement"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Facturation & Abonnement
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Contexte d&apos;abonnement, plan actuel et dernières factures
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : !context ? (
        <EmptyState
          title="Aucun abonnement actif"
          description="Souscrivez à un plan pour débloquer toutes les fonctionnalités."
          action={
            <Button
              leftIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => router.push(buildPath("/billing/upgrade"))}
            >
              Voir les offres
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Plan actuel</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {planDetails?.name ?? "—"}
                    </p>
                    {planDetails?.price != null && (
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {planDetails.price} {planDetails.currency ?? ""} /{" "}
                        {planDetails.billing_interval === "yearly"
                          ? "an"
                          : "mois"}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={
                      status === "active" || status === "trial"
                        ? "success"
                        : "secondary"
                    }
                  >
                    {status || "—"}
                  </Badge>
                </div>
                {(context?.current_period_start || context?.current_period_end) && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {context.current_period_start &&
                      format(
                        new Date(context.current_period_start),
                        "d MMM y",
                        { locale: fr }
                      )}
                    {" — "}
                    {context.current_period_end &&
                      format(new Date(context.current_period_end), "d MMM y", {
                        locale: fr,
                      })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex flex-col gap-3">
                <p className="text-sm text-slate-500">Actions</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    leftIcon={<CreditCard className="w-4 h-4" />}
                    onClick={handlePortal}
                    disabled={portalSession.isPending}
                  >
                    Gérer l&apos;abonnement
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ExternalLink className="w-4 h-4" />}
                    onClick={() => router.push(buildPath("/billing/upgrade"))}
                  >
                    Changer de plan
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(buildPath("/billing/history"))}
                  >
                    Historique
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {(context?.entitlements?.length ?? 0) > 0 && (
            <Card>
              <CardContent className="p-4">
                <h2 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4" />
                  Fonctionnalités incluses
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {(context.entitlements as { key?: string; name?: string }[]).map(
                    (e, i) => (
                      <li key={i}>
                        <Badge variant="secondary">
                          {e.name ?? e.key ?? "—"}
                        </Badge>
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>
          )}

          {recentInvoices.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h2 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
                  <Receipt className="w-4 h-4" />
                  Dernières factures
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left p-2">N° / Date</th>
                        <th className="text-left p-2">Montant</th>
                        <th className="text-left p-2">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentInvoices.slice(0, 5).map((inv) => (
                        <tr
                          key={inv.id}
                          className="border-b border-slate-100 dark:border-slate-800"
                        >
                          <td className="p-2">
                            {inv.invoice_number ?? inv.id}
                            {inv.created_at && (
                              <span className="text-slate-500 block text-xs">
                                {format(new Date(inv.created_at), "d MMM y", {
                                  locale: fr,
                                })}
                              </span>
                            )}
                          </td>
                          <td className="p-2">
                            {inv.amount_due != null
                              ? `${inv.amount_due} ${inv.currency ?? ""}`
                              : "—"}
                          </td>
                          <td className="p-2">
                            <Badge variant="secondary">
                              {String(inv.status ?? "—")}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
