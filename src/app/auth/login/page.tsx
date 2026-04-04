"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import toast from "react-hot-toast";
import {
  Loader2,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { getApiBaseUrl } from "@/helpers/auth-interceptor";
import { Link } from "@/i18n/navigation";

export default function LoginPage() {
  const t = useTranslations("authPages.login");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const reason = searchParams?.get("reason");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleKeycloakLogin = async () => {
    try {
      setIsSubmitting(true);
      const redirectPath =
        locale === "fr" ? "/auth/select-organization" : `/${locale}/auth/select-organization`;
      window.location.assign(
        `${getApiBaseUrl()}/bff/auth/login?redirect=${encodeURIComponent(redirectPath)}`,
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("authError"));
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
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-2 tracking-tight">
            {t("title")}{" "}
            <span className="text-emerald-600">{t("titleHighlight")}</span>
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

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

        {/* Keycloak SSO — primary flow */}
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

        <div className="text-center space-y-3 pt-2">
          <p className="text-sm text-slate-500">
            {t("newUser")}{" "}
            <Link
              href="/auth/register"
              className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              {t("createAccount")}
            </Link>
          </p>
          <Link
            href="/auth/forgot-password"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {t("forgotPassword")}
          </Link>
        </div>
      </motion.div>
    </AuthShell>
  );
}
