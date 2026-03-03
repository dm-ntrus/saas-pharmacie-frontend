'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Star } from 'lucide-react';
import {
  getMockAdminTokens,
  getMockTenantTokens,
  isMockAdmin,
  isMockTenant,
} from "@/services/mock-auth.service";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        error instanceof Error ? error.message : "Email ou mot de passe incorrect"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 py-4 relative bg-white">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="flex items-center gap-3 mb-8 group">
          <span className="font-display font-bold text-2xl text-emerald-600 tracking-tight">Syntix<span className="text-slate-900">Pharma</span></span>
          </Link>

          <div className="mb-6">
            {/* <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black mb-6 border border-emerald-100 uppercase tracking-[0.2em]">
              Accès Sécurisé
            </div> */}
            {/* <h1 className="text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-6 tracking-tight leading-[0.9]">
              Bon Retour <br />
              <span className="text-emerald-600">Docteur.</span>
            </h1> */}
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Connectez-vous pour gérer votre officine en toute simplicité.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Email professionnel
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@pharmacie.cd"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 text-slate-900 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none font-medium shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Mot de passe
                </label>
                <Link href="/auth/forgot-password" title="Réinitialiser le mot de passe" className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest">
                  Oublié ?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-14 py-4 bg-slate-50 text-slate-900 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none font-medium shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-5 h-5 text-emerald-600 border-slate-200 rounded-lg focus:ring-emerald-500 cursor-pointer transition-all"
              />
              <label htmlFor="remember" className="ml-2 text-sm font-bold text-slate-600 cursor-pointer">
                Rester connecté
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-slate-900 text-white rounded-[2rem] font-bold text-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl shadow-slate-900/20 group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Authentification...
                </>
              ) : (
                <>
                  Se Connecter
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-6 text-center">
            <p className="text-slate-500 font-medium">
              Nouveau sur SyntixPharma ?{' '}
              <Link href="/auth/register" className="font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest text-[10px] ml-2">
                Créer un compte
              </Link>
            </p>
            <p className="mt-3 text-xs text-slate-400">
              Mock (dev) : <strong>admin@gmail.com</strong> / admin → Admin · <strong>tenant@pharma.cd</strong> / tenant → Pharmacie
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Editorial Content */}
      <div className="hidden lg:flex flex-1 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/40 to-slate-900/95 z-10"></div>
        <Image
          src="/images/tenant.jpg"
          alt="Pharmacy"
          fill
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
          referrerPolicy="no-referrer"
        />
        
        <div className="relative z-20 flex flex-col justify-between h-full p-20 text-white">
          <div className="flex gap-16">
            <div className="space-y-1">
              <p className="text-5xl font-display font-bold">500+</p>
              <p className="text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px]">Pharmacies</p>
            </div>
            <div className="space-y-1">
              <p className="text-5xl font-display font-bold">1M+</p>
              <p className="text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px]">Ventes/mois</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-xl"
          >
            <div className="flex gap-1 text-emerald-500 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <h2 className="text-2xl font-display font-bold mb-6 leading-[1.1] italic">
              &quot;SyntixPharma a transformé la façon dont nous gérons nos stocks. C&apos;est devenu l&apos;outil indispensable de notre officine.&quot;
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center font-bold text-2xl shadow-2xl shadow-emerald-500/20 overflow-hidden relative border-2 border-white/20">
                {/* <Image src="" alt="Marie" fill className="object-cover" /> */}
              </div>
              <div>
                <p className="text-lg font-bold">Dr. Marie Kabange</p>
                <p className="text-emerald-400 font-black uppercase tracking-widest text-[8px]">Pharmacie Centrale, Kinshasa</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
