"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
} from "lucide-react";
import {
  getMockAdminTokens,
  getMockTenantTokens,
  isMockAdmin,
  isMockTenant,
} from "@/services/mock-auth.service";
import AuthShell from "@/components/auth/AuthShell";

export default function TenantLoginPage() {
  const params = useParams();
  const tenant_slug = params?.tenant_slug as string;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isMockAdmin(email, password)) {
        const { access, refresh } = getMockAdminTokens();
        await login(access, refresh, 86400);
        toast.success("Connexion admin réussie");
        return;
      }
      if (isMockTenant(email, password)) {
        const { access, refresh } = getMockTenantTokens();
        await login(access, refresh, 86400);
        toast.success("Connexion pharmacie réussie");
        return;
      }
      toast.error("Email ou mot de passe incorrect");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Email ou mot de passe incorrect",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeycloakLogin = async () => {
    try {
      setIsSubmitting(true);
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const base = api.replace(/\/+$/, "");
      window.location.assign(
        `${base}/api/v1/bff/auth/login?redirect=${encodeURIComponent(`/tenant/${tenant_slug}/dashboard`)}`,
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur Keycloak");
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full pl-14 pr-6 py-4 bg-slate-50/80 text-slate-900 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none font-medium";
  const labelClass =
    "block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]";

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

        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-2 tracking-tight">
            Bon retour,{" "}
            <span className="text-emerald-600">Docteur.</span>
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            Connectez-vous à votre espace de gestion.
          </p>
        </div>

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
              Redirection sécurisée…
            </>
          ) : (
            <>
              Continuer avec Keycloak
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="flex items-center gap-4">
          <div className="h-px bg-slate-100 flex-1" />
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
            ou
          </span>
          <div className="h-px bg-slate-100 flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Email professionnel</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@pharmacie.cd"
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className={labelClass}>Mot de passe</label>
              <Link
                href={`/tenant/${tenant_slug}/auth/forgot-password`}
                className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-colors"
              >
                Oublié ?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${inputClass} pr-14`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 text-emerald-600 border-slate-200 rounded focus:ring-emerald-500 cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="ml-2 text-sm font-medium text-slate-500 cursor-pointer"
            >
              Rester connecté
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-base hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-xl shadow-slate-900/15 group"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Authentification…
              </>
            ) : (
              <>
                Se connecter
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {process.env.NODE_ENV === "development" && (
          <p className="text-center text-[10px] text-slate-300 leading-relaxed">
            Mock : <strong>admin@gmail.com</strong> / admin → Admin ·{" "}
            <strong>tenant@pharma.cd</strong> / tenant → Pharmacie
          </p>
        )}
      </motion.div>
    </AuthShell>
  );
}
