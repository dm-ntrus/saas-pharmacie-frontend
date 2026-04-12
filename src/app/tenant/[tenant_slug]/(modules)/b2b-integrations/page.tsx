"use client";

import React, { useState } from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { Button, Card, Input } from "@/components/ui";
import { useImportPartnersCsv, useIngestWebhook, useRegisterWebhook } from "@/hooks/api/useB2BIntegrations";
import { useTranslations } from "@/lib/i18n-simple";

export default function B2BIntegrationsPage() {
  return (
    <ModuleGuard module="b2b-integrations" requiredPermissions={[Permission.B2B_INTEGRATIONS_READ]}>
      <Content />
    </ModuleGuard>
  );
}

function Content() {
  const t = useTranslations("b2b.integrations");
  const importCsv = useImportPartnersCsv();
  const registerWebhook = useRegisterWebhook();
  const ingestWebhook = useIngestWebhook();
  const [csv, setCsv] = useState("legal_name,type,partner_code\nPharma Test,retailer,BP-CSV-1");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [endpointUrl, setEndpointUrl] = useState("");

  const validateCsv = (value: string) => {
    const headers = value.split("\n")[0]?.toLowerCase() ?? "";
    const required = ["legal_name", "type", "partner_code"];
    const missing = required.filter((h) => !headers.includes(h));
    if (missing.length > 0) return t("missingColumns", { columns: missing.join(", ") });
    if (value.trim().split("\n").length < 2) return t("missingRows");
    return null;
  };

  const onImport = () => {
    const err = validateCsv(csv);
    setValidationError(err);
    if (err) return;
    importCsv.mutate(csv);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <Card>
        <div className="p-4 space-y-3">
          <textarea value={csv} onChange={(e) => setCsv(e.target.value)} className="w-full h-48 border rounded p-2" />
          {validationError ? <div className="text-sm text-red-600">{validationError}</div> : null}
          <ProtectedAction permission={Permission.B2B_INTEGRATIONS_WRITE}>
            <Button onClick={onImport} loading={importCsv.isPending}>{t("importCsv")}</Button>
          </ProtectedAction>
        </div>
      </Card>
      <Card>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input value={endpointUrl} onChange={(e) => setEndpointUrl(e.target.value)} placeholder={t("endpointPlaceholder")} />
          <ProtectedAction permission={Permission.B2B_INTEGRATIONS_WRITE}>
            <Button
              disabled={!endpointUrl.trim()}
              loading={registerWebhook.isPending}
              onClick={() => registerWebhook.mutate({ endpointUrl: endpointUrl.trim(), eventTypes: ["partners.updated"] })}
            >
              {t("registerWebhook")}
            </Button>
          </ProtectedAction>
          <ProtectedAction permission={Permission.B2B_INTEGRATIONS_READ}>
            <Button variant="outline" loading={ingestWebhook.isPending} onClick={() => ingestWebhook.mutate({ event: "ping", ts: new Date().toISOString() })}>
              {t("testIngest")}
            </Button>
          </ProtectedAction>
        </div>
      </Card>
    </div>
  );
}
