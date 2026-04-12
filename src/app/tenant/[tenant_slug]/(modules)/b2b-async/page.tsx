"use client";

import React, { useState } from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { Button, Card, Input } from "@/components/ui";
import { useB2BJob, useSubmitB2BJob } from "@/hooks/api/useB2BAsync";
import { useTranslations } from "@/lib/i18n-simple";

export default function B2BAsyncPage() {
  return (
    <ModuleGuard module="b2b-async" requiredPermissions={[Permission.B2B_ASYNC_JOBS_READ]}>
      <Content />
    </ModuleGuard>
  );
}

function Content() {
  const t = useTranslations("b2b.asyncJobs");
  const submit = useSubmitB2BJob();
  const [jobId, setJobId] = useState("");
  const { data, isLoading, error } = useB2BJob(jobId || undefined);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <Card>
        <div className="p-4 flex gap-3">
          <ProtectedAction permission={Permission.B2B_ASYNC_JOBS_WRITE}>
            <Button
              onClick={() =>
                submit.mutate(
                  { jobType: "b2b_export_csv", idempotencyKey: `exp-${Date.now()}` },
                  { onSuccess: (res: any) => setJobId(String(res.id).split(":").pop() ?? "") },
                )
              }
            >
              {t("launchExport")}
            </Button>
          </ProtectedAction>
          <Input value={jobId} onChange={(e) => setJobId(e.target.value)} placeholder={t("jobIdPlaceholder")} />
        </div>
      </Card>
      <Card>
        <div className="p-4 text-sm">
          {!jobId
            ? t("enterJobId")
            : isLoading
              ? t("loading")
              : error
                ? t("loadError")
                : t("status", { status: (data as any)?.status ?? "-" })}
        </div>
      </Card>
    </div>
  );
}
