"use client";

import React, { useState } from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { Button, Card, Input } from "@/components/ui";
import { useRequestCreditOverride, useRequestPriceOverride } from "@/hooks/api/useB2BGovernance";
import { useTranslations } from "next-intl";

export default function B2BGovernancePage() {
  return (
    <ModuleGuard module="b2b-governance" requiredPermissions={[Permission.B2B_OVERRIDES_REQUEST]}>
      <Content />
    </ModuleGuard>
  );
}

function Content() {
  const t = useTranslations("b2b.governance");
  const requestOverride = useRequestCreditOverride();
  const requestPriceOverride = useRequestPriceOverride();
  const [resourceId, setResourceId] = useState("");
  const canSubmit = resourceId.trim().length > 0;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <Card>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input value={resourceId} onChange={(e) => setResourceId(e.target.value)} placeholder={t("resourceIdPlaceholder")} />
          <ProtectedAction permission={Permission.B2B_OVERRIDES_REQUEST}>
            <Button
              disabled={!canSubmit}
              onClick={() =>
                requestOverride.mutate({ resourceType: "sales_order_b2b", resourceId: resourceId.trim(), reason: "Override demande" })
              }
            >
              {t("requestCreditOverride")}
            </Button>
          </ProtectedAction>
          <ProtectedAction permission={Permission.B2B_OVERRIDES_REQUEST}>
            <Button
              variant="outline"
              disabled={!canSubmit}
              onClick={() =>
                requestPriceOverride.mutate({ resourceType: "sales_order_b2b", resourceId: resourceId.trim(), reason: "Override prix demande" })
              }
            >
              {t("requestPriceOverride")}
            </Button>
          </ProtectedAction>
        </div>
      </Card>
    </div>
  );
}
