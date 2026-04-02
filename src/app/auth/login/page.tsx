"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  Loader2,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { getApiBaseUrl } from "@/helpers/auth-interceptor";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const reason = searchParams?.get("reason");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleKeycloakLogin = async () => {
    try {
      setIsSubmitting(true);
      window.location.assign(
        `${getApiBaseUrl()}/bff/auth/login?redirect=${encodeURIComponent("/auth/select-organization")}`,
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur d'authentification");
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-2 tracking-tight">
            Bon retour,{" "}
            <span className="text-emerald-600">Docteur.</span>
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            Connectez-vous pour gérer votre officine en toute simplicité.
          </p>
        </div>

        {reason === "session_expired" && (
          <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Votre session a expiré. Veuillez vous reconnecter.
          </div>
        )}
        {reason === "inactivity" && (
          <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Déconnecté pour inactivité. Reconnectez-vous pour continuer.
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
              Redirection sécurisée…
            </>
          ) : (
            <>
              Se connecter
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-400">
          Authentification sécurisée via votre fournisseur d&apos;identité.
        </p>

        <div className="text-center space-y-3 pt-2">
          <p className="text-sm text-slate-500">
            Nouveau sur SyntixPharma ?{" "}
            <Link
              href="/auth/register"
              className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Créer un compte
            </Link>
          </p>
          <Link
            href="/auth/forgot-password"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </motion.div>
    </AuthShell>
  );
}
