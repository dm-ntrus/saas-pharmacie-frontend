"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  RotateCcw,
} from "lucide-react";
import { keycloakOidc } from "@/services/keycloak-oidc.service";
import AuthShell from "@/components/auth/AuthShell";

export default function TenantForgotPasswordPage() {
  const params = useParams();
  const tenant_slug = params?.tenant_slug as string;
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 2) setResendCountdown(30);
  }, [step]);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setStep(2);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      otpRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((c, i) => { next[i] = c; });
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join("").length < 6) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setStep(3);
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    setOtp(["", "", "", "", "", ""]);
    setResendCountdown(30);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setStep(4);
  };

  const inputClass =
    "w-full px-5 py-3.5 rounded-2xl text-slate-900 border border-slate-100 bg-slate-50/80 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-medium";
  const loginPath = `/tenant/${tenant_slug}/auth/login`;

  return (
    <AuthShell>
      <div className="space-y-4">
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

        <button
          type="button"
          onClick={() =>
            window.location.assign(keycloakOidc.buildForgotPasswordUrl())
          }
          className="w-full py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-slate-700 hover:border-emerald-200 hover:text-emerald-700 transition-all"
        >
          Réinitialiser via Keycloak (recommandé)
        </button>

        <div className="flex items-center gap-4">
          <div className="h-px bg-slate-100 flex-1" />
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
            ou par email
          </span>
          <div className="h-px bg-slate-100 flex-1" />
        </div>

        {/* Step progress */}
        {step < 4 && (
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black border-2 transition-all ${
                    step > s
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : step === s
                        ? "bg-white border-emerald-500 text-emerald-600"
                        : "bg-white border-slate-100 text-slate-300"
                  }`}
                >
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                {i < 2 && (
                  <div className="flex-1 h-0.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500"
                      animate={{ width: step > s ? "100%" : "0%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                  <Mail className="w-7 h-7 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-display font-bold text-slate-900 mb-1">Mot de passe oublié ?</h1>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed">Entrez votre email pour recevoir un code de vérification.</p>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="nom@pharmacie.cd" />
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-emerald-600/15">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Envoyer le code <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-7 h-7 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-display font-bold text-slate-900 mb-1">Vérification</h1>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                  Code envoyé à <span className="font-bold text-slate-700">{email}</span>
                </p>
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className={`w-12 h-14 text-center text-2xl font-black rounded-2xl border-2 outline-none transition-all bg-slate-50 focus:bg-white ${
                          digit ? "border-emerald-500 text-emerald-700 bg-emerald-50" : "border-slate-200 text-slate-900 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                        }`}
                      />
                    ))}
                  </div>
                  <button type="submit" disabled={isSubmitting || otp.join("").length < 6} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-600/15">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Vérifier <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </form>
                <p className="text-sm text-slate-500 text-center mt-3">
                  Pas reçu ?{" "}
                  {resendCountdown > 0 ? (
                    <span className="font-bold text-slate-400">{resendCountdown}s</span>
                  ) : (
                    <button type="button" onClick={handleResend} className="font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 transition-colors">
                      <RotateCcw className="w-3.5 h-3.5" /> Renvoyer
                    </button>
                  )}
                </p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-7 h-7 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-display font-bold text-slate-900 mb-1">Nouveau mot de passe</h1>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed">Min. 8 caractères, une majuscule, un chiffre.</p>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} pr-12`} placeholder="Nouveau mot de passe" />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <input type={showConfirm ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`${inputClass} pr-12 ${confirmPassword && password !== confirmPassword ? "border-red-300 focus:ring-red-400" : ""}`} placeholder="Confirmer" />
                    <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs font-bold text-red-500">Les mots de passe ne correspondent pas.</p>
                  )}
                  <button type="submit" disabled={isSubmitting || password !== confirmPassword || password.length < 8} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-600/15">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Réinitialiser <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }} className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </motion.div>
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Mot de passe réinitialisé !</h2>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">Connectez-vous avec votre nouveau mot de passe.</p>
                <Link href={loginPath} className="inline-flex w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all items-center justify-center gap-2">
                  Se connecter <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AuthShell>
  );
}
