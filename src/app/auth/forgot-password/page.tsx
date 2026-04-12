"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "@/lib/i18n-simple";
import {
  ArrowLeft,
  Loader2,
  ArrowRight,
  KeyRound,
} from "lucide-react";
import { keycloakOidc } from "@/services/keycloak-oidc.service";
import AuthShell from "@/components/auth/AuthShell";
import { Link } from "@/i18n/navigation";

export default function ForgotPasswordPage() {
  const t = useTranslations("authPages.forgotPassword");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleResetPassword = () => {
    setIsRedirecting(true);
    window.location.assign(keycloakOidc.buildForgotPasswordUrl());
  };

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
        className="space-y-6 h-full max-w-lg mx-auto flex flex-col items-center text-center justify-center"
      >
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToLogin")}
        </Link>

        <div className="bg-white flex flex-col items-center rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-5">
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
