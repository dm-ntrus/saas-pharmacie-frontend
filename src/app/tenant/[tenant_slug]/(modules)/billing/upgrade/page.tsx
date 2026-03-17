"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { usePlansList } from "@/hooks/api/usePlans";
import { useCheckoutSession } from "@/hooks/api/useBilling";
import {
  Button,
  Card,
  CardContent,
  ErrorBanner,
  Skeleton,
  Badge,
  EmptyState,
} from "@/components/ui";
import { ArrowLeft, Check, Zap } from "lucide-react";
import type { Plan } from "@/types/billing";
import { toast } from "react-hot-toast";

export default function BillingUpgradePage() {
  return (
    <ModuleGuard
      module="billing"
      requiredPermissions={[Permission.INVOICES_READ]}
    >
      <BillingUpgradeContent />
    </ModuleGuard>
  );
}

function BillingUpgradeContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: plans, isLoading, error, refetch } = usePlansList({
    active: true,
    limit: 50,
    includeFeatureFlags: true,
  });
  const checkoutSession = useCheckoutSession();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const handleCheckout = (planId: string) => {
    setSelectedPlanId(planId);
    const baseUrl =
      typeof window !== "undefined" ? window.location.origin : "";
    const successUrl = baseUrl + buildPath("/billing");
    const cancelUrl = baseUrl + buildPath("/billing/upgrade");
    checkoutSession.mutate(
      {
        planId,
        successUrl,
        cancelUrl,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.url) {
            window.location.href = res.data.url;
          } else {
            toast.error("URL de paiement non reçue");
          }
        },
        onSettled: () => setSelectedPlanId(null),
      }
    );
  };

  const planList = Array.isArray(plans) ? plans : [];

  if (error) {
    return (
      <ErrorBanner
        message="Erreur de chargement des offres"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push(buildPath("/billing"))}
        >
          Retour
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Changer de plan
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Choisissez un plan et vous serez redirigé vers le paiement sécurisé Stripe
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-56 w-full" />
          ))}
        </div>
      ) : planList.length === 0 ? (
        <EmptyState
          title="Aucune offre disponible"
          description="Aucun plan actif pour le moment."
          action={
            <Button variant="outline" onClick={() => router.push(buildPath("/billing"))}>
              Retour à la facturation
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {planList.map((plan: Plan) => (
            <Card key={plan.id} className="flex flex-col">
              <CardContent className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {plan.name}
                  </h3>
                  <Badge variant="secondary">{plan.plan_tier ?? plan.type}</Badge>
                </div>
                {plan.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                    {plan.description}
                  </p>
                )}
                <div className="mt-auto">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {plan.price != null ? `${plan.price} ${plan.currency}` : "—"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {plan.billing_interval === "yearly" ? "par an" : "par mois"}
                  </p>
                </div>
                {plan.feature_flags && plan.feature_flags.length > 0 && (
                  <ul className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    {(plan.feature_flags as { feature_name?: string; feature_key?: string }[])
                      .slice(0, 3)
                      .map((f, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                          {f.feature_name ?? f.feature_key ?? ""}
                        </li>
                      ))}
                  </ul>
                )}
                <Button
                  className="w-full mt-4"
                  size="sm"
                  leftIcon={<Zap className="w-4 h-4" />}
                  onClick={() => handleCheckout(plan.id)}
                  disabled={
                    checkoutSession.isPending && selectedPlanId === plan.id
                  }
                >
                  {checkoutSession.isPending && selectedPlanId === plan.id
                    ? "Redirection..."
                    : "Souscrire"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
