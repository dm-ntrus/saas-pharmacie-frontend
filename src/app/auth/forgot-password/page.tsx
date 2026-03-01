'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowLeft, Loader2, CheckCircle2, ArrowRight, ShieldCheck, Eye, EyeOff, RotateCcw } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Start resend countdown when entering step 2
  useEffect(() => {
    if (step === 2) {
      setResendCountdown(30);
    }
  }, [step]);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  // Step 1 — send email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setStep(2);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  // Step 2 — OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    pasted.split('').forEach((char, i) => { next[i] = char; });
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length < 6) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setStep(3);
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    setOtp(['', '', '', '', '', '']);
    setResendCountdown(30);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  // Step 3 — new password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setStep(4);
  };

  const inputClass = "w-full px-5 py-3 rounded-2xl text-slate-900 border border-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none focus:bg-white shadow-sm transition-all font-medium";
  const labelClass = "text-sm font-bold text-slate-700";

  const steps = [
    { n: 1, label: 'Email' },
    { n: 2, label: 'Code' },
    { n: 3, label: 'Mot de passe' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
      <Link href="/" className="flex items-center gap-3 mb-2 group">
          <span className="font-display font-bold text-2xl text-emerald-600 tracking-tight">Syntix<span className="text-slate-900">Pharma</span></span>
          </Link>
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4 font-bold transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour à la connexion
        </Link>

        {/* Step indicator */}
        {/* {step < 4 && (
          <div className="flex items-center gap-2 mb-6">
            {steps.map((s, i) => (
              <div key={s.n} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-2 transition-all duration-500`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black border-2 transition-all duration-500 ${
                    step > s.n
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : step === s.n
                        ? 'bg-white border-emerald-500 text-emerald-600'
                        : 'bg-white border-slate-200 text-slate-300'
                  }`}>
                    {step > s.n ? <CheckCircle2 className="w-4 h-4" /> : `0${s.n}`}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block transition-colors ${
                    step === s.n ? 'text-slate-700' : 'text-slate-300'
                  }`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-px mx-2 bg-slate-200 overflow-hidden rounded-full">
                    <motion.div
                      className="h-full bg-emerald-500"
                      animate={{ width: step > s.n ? '100%' : '0%' }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )} */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl"
        >
          <AnimatePresence mode="wait">

            {/* ── STEP 1 – Email ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-emerald-600" />
                </div>
                <h1 className="text-3xl font-display font-bold text-slate-900 mb-0">Mot de passe oublié ?</h1>
                <p className="text-slate-500 mb-2 leading-relaxed">
                  Entrez votre adresse email et nous vous enverrons un code à 6 chiffres pour réinitialiser votre mot de passe.
                </p>
                <form onSubmit={handleEmailSubmit} className="space-y-2">
                  <div className="space-y-2">
                    <label className={labelClass}>Email professionnel</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={inputClass}
                      placeholder="pharmacien@votrepharmacie.cd"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-emerald-600/20"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Envoyer le code <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── STEP 2 – OTP ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                </div>
                <h1 className="text-3xl font-display font-bold text-slate-900 mb-0">Vérification</h1>
                <p className="text-slate-500 mb-2 leading-relaxed">
                  Nous avons envoyé un code à 6 chiffres à{' '}
                  <span className="font-bold text-slate-900">{email}</span>.
                  Saisissez-le ci-dessous.
                </p>

                <form onSubmit={handleOtpSubmit} className="space-y-2">
                  {/* OTP inputs */}
                  <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className={`w-12 h-14 text-center text-2xl font-black rounded-2xl border-2 outline-none transition-all duration-200 bg-slate-50 focus:bg-white ${
                          digit
                            ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                            : 'border-slate-200 text-slate-900 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || otp.join('').length < 6}
                    className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-600/20"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Vérifier le code <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </form>

                {/* Resend */}
                <div className="mt-2 text-center">
                  <p className="text-sm text-slate-500">
                    Vous n&apos;avez pas reçu le code ?{' '}
                    {resendCountdown > 0 ? (
                      <span className="font-bold text-slate-400">Renvoyer dans {resendCountdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Renvoyer
                      </button>
                    )}
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3 – New Password ── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                </div>
                <h1 className="text-3xl font-display font-bold text-slate-900 mb-0">Nouveau mot de passe</h1>
                <p className="text-slate-500 mb-2 leading-relaxed">
                  Choisissez un nouveau mot de passe sécurisé pour votre compte.
                </p>
                <form onSubmit={handlePasswordSubmit} className="space-y-2">
                  <div className="space-y-2">
                    <label className={labelClass}>Nouveau mot de passe</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className={`${inputClass} pr-12`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Confirmer le mot de passe</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className={`${inputClass} pr-12 ${confirmPassword && password !== confirmPassword ? 'border-red-300 focus:ring-red-400' : ''}`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(v => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs font-bold text-red-500">Les mots de passe ne correspondent pas.</p>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Minimum 8 caractères, incluant une majuscule et un chiffre.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting || password !== confirmPassword || password.length < 8}
                    className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-600/20"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Réinitialiser <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── STEP 4 – Success ── */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </motion.div>
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-3">Mot de passe réinitialisé !</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.
                </p>
                <Link
                  href="/auth/login"
                  className="inline-block w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-center"
                >
                  Se connecter
                </Link>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}