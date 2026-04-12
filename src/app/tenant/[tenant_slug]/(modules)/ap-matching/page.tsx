"use client";

import React, { useState } from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { Button, Card, Input } from "@/components/ui";
import { useApThreeWayMatches, useCreateApThreeWayMatch } from "@/hooks/api/useApMatching";
import { useTranslations } from "next-intl";

export default function ApMatchingPage() {
  return (
    <ModuleGuard module="ap-matching" requiredPermissions={[Permission.AP_MATCHING_READ]}>
      <ApMatchingContent />
    </ModuleGuard>
  );
}

function ApMatchingContent() {
  const t = useTranslations("b2b.apMatching");
  const { data, isLoading, error } = useApThreeWayMatches();
  const createMatch = useCreateApThreeWayMatch();
  const [invoiceRef, setInvoiceRef] = useState("");
  const [poId, setPoId] = useState("");
  const [grnId, setGrnId] = useState("");
  const [variance, setVariance] = useState(0);
  const canSubmit = invoiceRef.trim().length > 0 && variance >= 0;

  if (isLoading) return <div className="text-sm text-slate-600">{t("loading")}</div>;
  if (error) return <div className="text-sm text-red-600">{t("loadError")}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("title")}</h1>
      <Card>
        <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
          <Input value={invoiceRef} onChange={(e) => setInvoiceRef(e.target.value)} placeholder={t("invoiceRefPlaceholder")} />
          <Input value={poId} onChange={(e) => setPoId(e.target.value)} placeholder={t("poIdPlaceholder")} />
          <Input value={grnId} onChange={(e) => setGrnId(e.target.value)} placeholder={t("grnIdPlaceholder")} />
          <Input type="number" value={variance} onChange={(e) => setVariance(Number(e.target.value) || 0)} placeholder={t("variancePlaceholder")} />
          <ProtectedAction permission={Permission.AP_MATCHING_WRITE}>
            <Button
              disabled={!canSubmit}
              onClick={() =>
                createMatch.mutate({
                  supplierInvoiceRef: invoiceRef.trim(),
                  purchaseOrderId: poId.trim() || undefined,
                  goodsReceiptId: grnId.trim() || undefined,
                  varianceAmount: variance,
                })
              }
              loading={createMatch.isPending}
            >
              {t("save")}
            </Button>
          </ProtectedAction>
        </div>
      </Card>
      <Card>
        <div className="p-4 text-sm text-slate-600">
          {t("count", { count: Array.isArray((data as any)?.matches) ? (data as any).matches.length : 0 })}
        </div>
      </Card>
    </div>
  );
}
