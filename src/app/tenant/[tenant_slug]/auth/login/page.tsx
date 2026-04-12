"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  Loader2,
  ArrowRight,
  AlertTriangle,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { getApiBaseUrl } from "@/helpers/auth-interceptor";
import { Link } from "@/i18n/navigation";

export default function TenantLoginPage() {
  const t = useTranslations("authPages.login");
  const tTenant = useTranslations("authPages.tenant");
  const params = useParams();
  const searchParams = useSearchParams();
  const tenant_slug = params?.tenant_slug as string;
  const reason = searchParams?.get("reason");
  const authError = searchParams?.get("auth_error");
  const crossTenantBlocked = searchParams?.get("cross_tenant_blocked");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleKeycloakLogin = async () => {
    try {
      setIsSubmitting(true);
      window.location.assign(
        `${getApiBaseUrl()}/bff/auth/login?redirect=${encodeURIComponent(`/tenant/${tenant_slug}/dashboard`)}`,
      );
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : t("authError"),
      );
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 h-full max-w-lg mx-auto flex flex-col items-center text-center justify-center"
      >
        {/* Tenant badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black border border-emerald-100 uppercase tracking-[0.2em]">
          {tenant_slug}
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-2 tracking-tight">
            {t("title")}{" "}
            <span className="text-emerald-600">{t("titleHighlight")}</span>
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Keycloak auth error (required action abandoned, account locked, etc.) */}
        {authError && (
          <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
            <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <div>
              <p className="font-semibold">{t("authError")}</p>
              <p className="mt-0.5 text-red-700">{authError}</p>
            </div>
          </div>
        )}

        {/* Cross-tenant access blocked */}
        {crossTenantBlocked && (
          <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
            <div>
              <p className="font-semibold">{tTenant("wrongOrganization")}</p>
              <p className="mt-0.5">
                {tTenant("crossTenantPart1")}{" "}
                <strong>{crossTenantBlocked}</strong>, mais votre compte
                {" "}{tTenant("crossTenantPart2")}
              </p>
            </div>
          </div>
        )}

        {/* Session expired / inactivity warnings */}
        {reason === "session_expired" && (
          <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {t("sessionExpired")}
          </div>
        )}
        {reason === "inactivity" && (
          <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {t("inactivity")}
          </div>
        )}

        {/* Keycloak SSO */}
        <button
          type="button"
          onClick={handleKeycloakLogin}
          disabled={isSubmitting}
          className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-base hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-xl shadow-emerald-600/15 group"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t("redirecting")}
            </>
          ) : (
            <>
              {t("button")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-400">
          {t("secureAuth")}
        </p>

        <div className="text-center pt-2">
          <Link
            href={`/tenant/${tenant_slug}/auth/forgot-password`}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {t("forgotPassword")}
          </Link>
        </div>
      </motion.div>
    </AuthShell>
  );
}
