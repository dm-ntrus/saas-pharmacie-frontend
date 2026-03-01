'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, LayoutDashboard, ShieldCheck, Sparkles, Star } from 'lucide-react';

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/40 to-slate-900/95 z-10"></div>
        <Image
          src="/images/tenant.jpg"
          alt="Pharmacy"
          fill
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
          referrerPolicy="no-referrer"
        />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl w-full text-center relative z-10"
      >
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-28 h-28 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/20"
        >
          <CheckCircle2 className="w-14 h-14" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold font-display mb-4 leading-tight"
        >
          Bienvenue dans le futur de la <span className="text-emerald-400 italic">santé</span>.
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-slate-400 mb-8 leading-relaxed max-w-2xl mx-auto"
        >
          Votre compte SyntixPharma est prêt. Vous rejoignez une communauté de +500 pharmaciens qui transforment leur quotidien.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-10 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 text-left group hover:bg-white/10 transition-all"
          >
            <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
              <LayoutDashboard className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 font-display">Tableau de bord</h3>
            <p className="text-slate-400 leading-relaxed">Gérez vos ventes, vos stocks et vos patients avec une interface intuitive et puissante.</p>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-10 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 text-left group hover:bg-white/10 transition-all"
          >
            <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
              <Star className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 font-display">IA Prédictive</h3>
            <p className="text-slate-400 leading-relaxed">Anticipez vos ruptures de stock et optimisez vos commandes grâce à nos algorithmes.</p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link 
            href="/auth/login" 
            className="w-full sm:w-auto px-12 py-6 bg-emerald-600 text-white rounded-[2rem] font-bold text-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-emerald-500/20 group"
          >
            Accéder à mon espace
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/support" 
            className="w-full sm:w-auto px-12 py-6 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-[2rem] font-bold text-xl hover:bg-white/20 transition-all flex items-center justify-center gap-4"
          >
            Besoin d&apos;aide ?
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}