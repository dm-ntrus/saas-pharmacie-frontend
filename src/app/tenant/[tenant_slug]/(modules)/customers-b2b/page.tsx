"use client";

import React, { useState } from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { Button, Card, Input } from "@/components/ui";
import { useCreatePartner, usePartners } from "@/hooks/api/usePartners";
import { useTranslations } from "@/lib/i18n-simple";

export default function CustomersB2BPage() {
  return (
    <ModuleGuard module="customers-b2b" requiredPermissions={[Permission.BUSINESS_PARTNERS_READ]}>
      <Content />
    </ModuleGuard>
  );
}

function Content() {
  const t = useTranslations("b2b.customers");
  const { data, isLoading, error } = usePartners();
  const createPartner = useCreatePartner();
  const [legalName, setLegalName] = useState("");
  const [partnerCode, setPartnerCode] = useState("");
  const [type, setType] = useState("retailer");
  const canSubmit = legalName.trim().length >= 3 && partnerCode.trim().length >= 2;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("title")}</h1>
      <Card>
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder={t("legalNamePlaceholder")} />
          <Input value={partnerCode} onChange={(e) => setPartnerCode(e.target.value)} placeholder={t("partnerCodePlaceholder")} />
          <select className="h-10 rounded-md border border-slate-300 px-3" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="retailer">Retailer</option>
            <option value="wholesaler">Wholesaler</option>
            <option value="clinic">Clinic</option>
            <option value="hospital">Hospital</option>
          </select>
          <ProtectedAction permission={Permission.BUSINESS_PARTNERS_CREATE}>
            <Button
              disabled={!canSubmit}
              loading={createPartner.isPending}
              onClick={() => createPartner.mutate({ legal_name: legalName.trim(), partner_code: partnerCode.trim(), type })}
            >
              {t("create")}
            </Button>
          </ProtectedAction>
        </div>
      </Card>
      <Card>
        <div className="p-4 text-sm text-slate-600">
          {isLoading
            ? t("loading")
            : error
              ? t("loadError")
              : t("count", { count: Array.isArray((data as any)?.partners) ? (data as any).partners.length : 0 })}
        </div>
      </Card>
    </div>
  );
}
