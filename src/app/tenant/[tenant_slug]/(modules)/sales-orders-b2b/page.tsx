"use client";

import React, { useState } from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { Button, Card, Input } from "@/components/ui";
import { useCreateSalesOrderB2B, useSalesOrdersB2B, useTransitionSalesOrderB2B } from "@/hooks/api/useSalesOrdersB2B";
import { useTranslations } from "@/lib/i18n-simple";

export default function SalesOrdersB2BPage() {
  return (
    <ModuleGuard module="sales-orders-b2b" requiredPermissions={[Permission.SALES_ORDERS_B2B_READ]}>
      <Content />
    </ModuleGuard>
  );
}

function Content() {
  const t = useTranslations("b2b.salesOrders");
  const { data, isLoading, error } = useSalesOrdersB2B();
  const createOrder = useCreateSalesOrderB2B();
  const transitionOrder = useTransitionSalesOrderB2B();
  const [partnerId, setPartnerId] = useState("");
  const [amount, setAmount] = useState(0);
  const [transitionId, setTransitionId] = useState("");
  const canCreate = partnerId.trim().length > 0 && amount > 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("title")}</h1>
      <Card>
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input value={partnerId} onChange={(e) => setPartnerId(e.target.value)} placeholder={t("partnerIdPlaceholder")} />
          <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} placeholder={t("amountPlaceholder")} />
          <ProtectedAction permission={Permission.SALES_ORDERS_B2B_CREATE}>
            <Button
              disabled={!canCreate}
              loading={createOrder.isPending}
              onClick={() =>
                createOrder.mutate({
                  partnerId: partnerId.trim(),
                  lines: [{ productId: "demo-product", quantity: 1, unitPrice: amount }],
                  totalAmount: amount,
                })
              }
            >
              {t("create")}
            </Button>
          </ProtectedAction>
          <div className="flex gap-2">
            <Input value={transitionId} onChange={(e) => setTransitionId(e.target.value)} placeholder={t("orderIdPlaceholder")} />
            <ProtectedAction permission={Permission.SALES_ORDERS_B2B_UPDATE}>
              <Button
                variant="outline"
                disabled={!transitionId.trim()}
                loading={transitionOrder.isPending}
                onClick={() => transitionOrder.mutate({ id: transitionId.trim(), status: "confirmed" })}
              >
                {t("confirm")}
              </Button>
            </ProtectedAction>
          </div>
        </div>
      </Card>
      <Card>
        <div className="p-4 text-sm text-slate-600">
          {isLoading
            ? t("loading")
            : error
              ? t("loadError")
              : t("count", { count: Array.isArray((data as any)?.orders) ? (data as any).orders.length : 0 })}
        </div>
      </Card>
    </div>
  );
}
