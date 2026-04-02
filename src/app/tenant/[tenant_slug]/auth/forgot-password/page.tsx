"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  ArrowRight,
  KeyRound,
} from "lucide-react";
import { keycloakOidc } from "@/services/keycloak-oidc.service";
import AuthShell from "@/components/auth/AuthShell";

export default function TenantForgotPasswordPage() {
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
        className="space-y-6"
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
          Retour à la connexion
        </Link>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
            <KeyRound className="w-7 h-7 text-emerald-600" />
          </div>

          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">
              Mot de passe oublié ?
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Vous allez être redirigé vers notre service d&apos;authentification
              sécurisé pour réinitialiser votre mot de passe.
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
                Redirection…
              </>
            ) : (
              <>
                Réinitialiser mon mot de passe
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <p className="text-xs text-slate-400 text-center leading-relaxed">
            Un email de réinitialisation sera envoyé à l&apos;adresse
            associée à votre compte. Vérifiez vos spams si vous ne le
            recevez pas.
          </p>
        </div>
      </motion.div>
    </AuthShell>
  );
}
