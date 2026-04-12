"use client";

import React, { useState } from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { Button, Card, Input } from "@/components/ui";
import { useCreateDiscountRule, useCreatePriceList, useDiscountRules, usePriceLists } from "@/hooks/api/useCommercialTerms";
import { useTranslations } from "next-intl";

export default function PricingDeskPage() {
  return (
    <ModuleGuard module="pricing-desk" requiredPermissions={[Permission.COMMERCIAL_TERMS_READ]}>
      <PricingDeskContent />
    </ModuleGuard>
  );
}

function PricingDeskContent() {
  const t = useTranslations("b2b.pricingDesk");
  const { data, isLoading, error } = usePriceLists();
  const { data: rules, isLoading: rulesLoading } = useDiscountRules();
  const createPriceList = useCreatePriceList();
  const createDiscountRule = useCreateDiscountRule();
  const [name, setName] = useState("");
  const canCreate = name.trim().length >= 3;

  if (isLoading || rulesLoading) return <div className="text-sm text-slate-600">{t("loading")}</div>;
  if (error) return <div className="text-sm text-red-600">{t("loadError")}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("title")}</h1>
      <Card>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("namePlaceholder")} />
          <ProtectedAction permission={Permission.COMMERCIAL_TERMS_WRITE}>
            <Button disabled={!canCreate} onClick={() => createPriceList.mutate({ name: name.trim(), items: [] })} loading={createPriceList.isPending}>{t("createPriceList")}</Button>
          </ProtectedAction>
          <ProtectedAction permission={Permission.COMMERCIAL_TERMS_WRITE}>
            <Button variant="outline" onClick={() => createDiscountRule.mutate({ name: `Remise ${Date.now()}`, scope: "order", discountPercent: 5 })}>
              {t("createDiscountRule")}
            </Button>
          </ProtectedAction>
        </div>
      </Card>
      <Card>
        <div className="p-4 text-sm text-slate-600">
          {t("counts", {
            priceLists: Array.isArray((data as any)?.priceLists) ? (data as any).priceLists.length : 0,
            rules: Array.isArray((rules as any)?.rules) ? (rules as any).rules.length : 0,
          })}
        </div>
      </Card>
    </div>
  );
}
