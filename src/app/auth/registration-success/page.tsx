"use client";

import { motion } from "framer-motion";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  ArrowRight,
  LayoutDashboard,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  createTenantProvisioningSocket,
  type ProvisioningProgressEvent,
  type ProvisioningSuccessEvent,
  type ProvisioningErrorEvent,
} from "@/lib/realtime/tenantProvisioningSocket";
import {
  useTenantProvisioningStatus,
  tenantProvisioningStatusQueryKey,
} from "@/hooks/useTenantProvisioningStatus";
import { isValidProvisioningId } from "@/services/tenant-registration.service";
import { buildTenantLoginPath } from "@/lib/tenant/tenant-urls";
import type { TenantProvisioningPublicStatus } from "@/types/tenant-registration.types";
import AuthShell from "@/components/auth/AuthShell";
import { Link } from "@/i18n/navigation";

export default function RegistrationSuccessPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <RegistrationSuccessInner />
    </Suspense>
  );
}

function Fallback() {
  return (
    <AuthShell>
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    </AuthShell>
  );
}

function RegistrationSuccessInner() {
  const t = useTranslations("authPages.registrationSuccess");
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const provisioningId =
    searchParams?.get("provisioningId")?.trim() ?? "";
  const subdomainHint =
    searchParams?.get("subdomain")?.trim().toLowerCase() ?? "";

  const hasValidProvisioningId = !!provisioningId && isValidProvisioningId(provisioningId);
  const hasInvalidProvisioningId = !!provisioningId && !isValidProvisioningId(provisioningId);

  const statusQuery = useTenantProvisioningStatus(
    hasValidProvisioningId ? provisioningId : undefined,
  );

  const [wsConnected, setWsConnected] = useState(false);
  const [progressMeta, setProgressMeta] = useState<{
    step?: string;
    stepIndex?: number;
    totalSteps?: number;
    progress?: number;
  } | null>(null);

  const apiStatus = statusQuery.data;
  const pollError =
    statusQuery.error instanceof Error
      ? statusQuery.error.message
      : null;

  const effectiveSubdomain = useMemo(() => {
    return (
      apiStatus?.subdomain?.trim().toLowerCase() ||
      subdomainHint ||
      extractSubdomainFromUnknown(apiStatus?.metadata) ||
      ""
    );
  }, [apiStatus?.subdomain, apiStatus?.metadata, subdomainHint]);

  const loginHref = buildTenantLoginPath(effectiveSubdomain);

  useEffect(() => {
    if (!hasValidProvisioningId) return;

    const socket = createTenantProvisioningSocket();

    const onConnect = () => {
      setWsConnected(true);
      socket.emit("subscribe_provisioning", { provisioningId });
    };
    const onDisconnect = () => setWsConnected(false);

    const onProgress = (evt: ProvisioningProgressEvent) => {
      if (evt?.provisioningId !== provisioningId) return;
      setProgressMeta({
        step: evt.step,
        stepIndex: evt.stepIndex,
        totalSteps: evt.totalSteps,
        progress: evt.progress,
      });
    };

    const onSuccess = (evt: ProvisioningSuccessEvent) => {
      if (evt?.provisioningId !== provisioningId) return;
      setProgressMeta((prev) => prev ?? { progress: 100 });
      void queryClient.invalidateQueries({
        queryKey: tenantProvisioningStatusQueryKey(provisioningId),
      });
      try {
        socket.emit("unsubscribe_provisioning", { provisioningId });
      } catch {
        /* ignore */
      }
      socket.disconnect();
    };

    const onError = (evt: ProvisioningErrorEvent) => {
      if (evt?.provisioningId && evt.provisioningId !== provisioningId)
        return;
      void queryClient.invalidateQueries({
        queryKey: tenantProvisioningStatusQueryKey(provisioningId),
      });
    };

    const onConnectError = () => {
      setWsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("provisioning_progress", onProgress);
    socket.on("provisioning_success", onSuccess);
    socket.on("provisioning_error", onError);

    return () => {
      try {
        socket.emit("unsubscribe_provisioning", { provisioningId });
      } catch {
        /* ignore */
      }
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("provisioning_progress", onProgress);
      socket.off("provisioning_success", onSuccess);
      socket.off("provisioning_error", onError);
      socket.disconnect();
    };
  }, [provisioningId, queryClient]);

  const display = hasInvalidProvisioningId
    ? { kind: "failed" as const, message: t("invalidProvisioningId") }
    : resolveDisplayState(apiStatus, pollError, t);
  const progress =
    progressMeta?.progress ??
    (display.kind === "completed" ? 100 : undefined);

  return (
    <AuthShell
      testimonial={{
        quote: t("testimonialQuote"),
        name: t("testimonialName"),
        title: t("testimonialTitle"),
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
          className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
            display.kind === "failed"
              ? "bg-red-50"
              : display.kind === "completed"
                ? "bg-emerald-50"
                : "bg-emerald-50"
          }`}
        >
          {display.kind === "failed" ? (
            <AlertCircle className="w-10 h-10 text-red-500" />
          ) : display.kind === "completed" ? (
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          ) : (
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          )}
        </motion.div>

        {/* Title */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-2 tracking-tight">
            {display.kind === "completed"
              ? t("readyTitle")
              : display.kind === "failed"
                ? t("errorTitle")
                : t("pendingTitle")}
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            {provisioningId
              ? display.message
              : t("noProvisioningIdDesc")}
          </p>
        </div>

        {/* Progress bar */}
        {provisioningId && display.kind === "pending" && (
          <div className="space-y-2">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500 rounded-full"
                initial={{ width: "5%" }}
                animate={{
                  width: progress ? `${progress}%` : "30%",
                }}
                transition={{ duration: 0.8 }}
              />
            </div>
            {progressMeta?.stepIndex != null &&
              progressMeta?.totalSteps != null && (
                <p className="text-xs text-slate-400">
                  {t("stepLabel", {
                    current: progressMeta.stepIndex,
                    total: progressMeta.totalSteps,
                  })}
                  {progressMeta.step ? ` — ${progressMeta.step}` : ""}
                  {wsConnected && (
                    <span className="ml-2 text-emerald-500">● {t("realTime")}</span>
                  )}
                </p>
              )}
          </div>
        )}

        {/* Subdomain info */}
        {effectiveSubdomain && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
              <LayoutDashboard className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                {t("yourSpace")}
              </p>
              <p className="text-base font-bold text-emerald-600 font-mono">
                {effectiveSubdomain}
              </p>
            </div>
          </div>
        )}

        {/* Feature cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: LayoutDashboard,
              title: t("cards.dashboardTitle"),
              desc: t("cards.dashboardDesc"),
            },
            {
              icon: Star,
              title: t("cards.aiTitle"),
              desc: t("cards.aiDesc"),
            },
          ].map((card) => (
            <div
              key={card.title}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-lg transition-all"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:bg-emerald-50 transition-colors">
                <card.icon className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">{card.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link
            href={loginHref}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-base hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/15 group"
          >
            {effectiveSubdomain
              ? t("loginToSpace")
              : t("goToLogin")}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/support"
            className="w-full py-3.5 bg-slate-50 text-slate-600 border border-slate-100 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all text-center"
          >
            {t("needHelp")}
          </Link>
        </div>
      </motion.div>
    </AuthShell>
  );
}

function extractSubdomainFromUnknown(meta: unknown): string {
  if (!meta || typeof meta !== "object") return "";
  const o = meta as Record<string, unknown>;
  const s = o.subdomain ?? o.tenantSubdomain;
  return typeof s === "string" ? s.trim().toLowerCase() : "";
}

function resolveDisplayState(
  api: TenantProvisioningPublicStatus | undefined,
  pollErr: string | null,
  t: (key: string) => string,
): { kind: "pending" | "completed" | "failed"; message: string } {
  if (pollErr && !api) return { kind: "failed", message: pollErr };
  if (!api)
    return {
      kind: "pending",
      message: pollErr ?? t("statusFetching"),
    };
  if (api.status === "completed")
    return {
      kind: "completed",
      message: api.message ?? t("statusCompleted"),
    };
  if (api.status === "failed")
    return {
      kind: "failed",
      message:
        api.message ??
        t("statusFailed"),
    };
  return {
    kind: "pending",
    message: api.message ?? t("statusPending"),
  };
}
