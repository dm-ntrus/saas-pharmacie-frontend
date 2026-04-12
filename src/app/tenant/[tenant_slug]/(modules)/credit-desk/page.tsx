"use client";

import React, { useState } from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { Card, Input } from "@/components/ui";
import { useCreditAccount } from "@/hooks/api/useCreditControl";
import { useTranslations } from "@/lib/i18n-simple";

export default function CreditDeskPage() {
  return (
    <ModuleGuard module="credit-desk" requiredPermissions={[Permission.CREDIT_CONTROL_READ]}>
      <Content />
    </ModuleGuard>
  );
}

function Content() {
  const t = useTranslations("b2b.creditDesk");
  const [partnerId, setPartnerId] = useState("");
  const { data, isLoading, error } = useCreditAccount(partnerId.trim() || undefined);
  const account = data as Record<string, unknown> | undefined;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("title")}</h1>
      <Card>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input value={partnerId} onChange={(e) => setPartnerId(e.target.value)} placeholder={t("partnerIdPlaceholder")} />
          <div className="text-sm text-slate-600 pt-2">
            {!partnerId.trim()
              ? t("enterPartnerId")
              : isLoading
                ? t("loading")
                : error
                  ? t("loadError")
                  : t("metrics", {
                      creditLimit: String(account?.credit_limit ?? 0),
                      outstandingAmount: String(account?.outstanding_amount ?? 0),
                    })}
          </div>
        </div>
      </Card>
    </div>
  );
}
