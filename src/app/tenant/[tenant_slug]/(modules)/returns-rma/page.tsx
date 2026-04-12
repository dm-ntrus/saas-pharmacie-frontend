"use client";

import React, { useState } from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { Button, Card, Input } from "@/components/ui";
import { useCreateReturnAuthorization, useReturnAuthorizations, useSetReturnDisposition } from "@/hooks/api/useReturnsRma";
import { useTranslations } from "@/lib/i18n-simple";

export default function ReturnsRmaPage() {
  return (
    <ModuleGuard module="returns-rma" requiredPermissions={[Permission.RETURNS_RMA_READ]}>
      <ReturnsRmaContent />
    </ModuleGuard>
  );
}

function ReturnsRmaContent() {
  const t = useTranslations("b2b.returnsRma");
  const { data, isLoading, error } = useReturnAuthorizations();
  const createRma = useCreateReturnAuthorization();
  const setDisposition = useSetReturnDisposition();
  const [sourceId, setSourceId] = useState("");
  const [productId, setProductId] = useState("");
  const [returnId, setReturnId] = useState("");
  const canSubmit = sourceId.trim().length > 0 && productId.trim().length > 0;

  if (isLoading) return <div className="text-sm text-slate-600">{t("loading")}</div>;
  if (error) return <div className="text-sm text-red-600">{t("loadError")}</div>;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("title")}</h1>
      <Card>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input value={sourceId} onChange={(e) => setSourceId(e.target.value)} placeholder={t("sourceIdPlaceholder")} />
          <Input value={productId} onChange={(e) => setProductId(e.target.value)} placeholder={t("productIdPlaceholder")} />
          <ProtectedAction permission={Permission.RETURNS_RMA_WRITE}>
            <Button
              disabled={!canSubmit}
              onClick={() =>
                createRma.mutate({
                  sourceType: "sales_order_b2b",
                  sourceId: sourceId.trim(),
                  lines: [{ productId: productId.trim(), quantity: 1 }],
                })
              }
              loading={createRma.isPending}
            >
              {t("create")}
            </Button>
          </ProtectedAction>
        </div>
      </Card>
      <Card>
        <div className="p-4 text-sm text-slate-600">
          {t("count", { count: Array.isArray((data as any)?.returns) ? (data as any).returns.length : 0 })}
        </div>
      </Card>
      <Card>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input value={returnId} onChange={(e) => setReturnId(e.target.value)} placeholder={t("returnIdPlaceholder")} />
          <ProtectedAction permission={Permission.RETURNS_RMA_WRITE}>
            <Button
              variant="outline"
              disabled={!returnId.trim()}
              loading={setDisposition.isPending}
              onClick={() => setDisposition.mutate({ id: returnId.trim(), data: { status: "processed", note: "Traite en front office" } })}
            >
              {t("applyDisposition")}
            </Button>
          </ProtectedAction>
        </div>
      </Card>
    </div>
  );
}
