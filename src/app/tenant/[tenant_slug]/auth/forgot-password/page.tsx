"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  Loader2,
  ArrowRight,
  KeyRound,
} from "lucide-react";
import { keycloakOidc } from "@/services/keycloak-oidc.service";
import AuthShell from "@/components/auth/AuthShell";
import { Link } from "@/i18n/navigation";

export default function TenantForgotPasswordPage() {
  const t = useTranslations("authPages.forgotPassword");
  const params = useParams();
  const tenant_slug = params?.tenant_slug as string;
  const [isRedirecting, setIsRedirecting] = useState(false);
  const loginPath = `/tenant/${tenant_slug}/auth/login`;

  const handleResetPassword = () => {
    setIsRedirecting(true);
    window.location.assign(keycloakOidc.buildForgotPasswordUrl());
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

        <Link
          href={loginPath}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToLogin")}
        </Link>

        <div className="bg-white flex flex-col items-center text-center rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
            <KeyRound className="w-7 h-7 text-emerald-600" />
          </div>

          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">
              {t("title")}
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              {t("desc")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetPassword}
            disabled={isRedirecting}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-base hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-xl shadow-emerald-600/15 group"
          >
            {isRedirecting ? (
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

          <p className="text-xs text-slate-400 text-center leading-relaxed">
            {t("emailNote")}
          </p>
        </div>
      </motion.div>
    </AuthShell>
  );
}
