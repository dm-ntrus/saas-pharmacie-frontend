'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { 
  Play, 
  Smartphone, 
  Monitor, 
  Users, 
  ChevronRight, 
  ArrowLeft,
  Zap,
  ShieldCheck,
  BarChart3
} from 'lucide-react';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-emerald-500/30">

      <main className="max-w-7xl mx-auto px-6 pt-48 pb-32">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black mb-4 border border-emerald-500/20 uppercase tracking-[0.2em]">
              Expérience Immersive
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold mb-4 tracking-[-0.04em] leading-[0.9]">
              Découvrez SyntixPharma <br />
              <span className="text-emerald-500 text-outline-white">en Action.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Choisissez votre mode d&apos;exploration. Une plateforme conçue pour l&apos;excellence, accessible partout.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Interactive Demo */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            whileHover={{ y: -15 }}
            className="bg-slate-800/30 border border-slate-700/50 p-12 rounded-[3rem] flex flex-col group hover:bg-slate-800/50 transition-all duration-500"
          >
            <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
              <Monitor className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-3xl font-display font-bold mb-6">Démo Interactive</h3>
            <p className="text-lg text-slate-400 mb-12 flex-1 leading-relaxed">
              Explorez librement l&apos;interface complète sur votre navigateur. Testez le POS, l&apos;inventaire et les rapports en temps réel.
            </p>
            <Link 
              href="/auth/login"
              className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-emerald-600/20"
            >
              Lancer la démo
              <Play className="w-5 h-5 fill-current" />
            </Link>
          </motion.div>

          {/* Guided Tour */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -15 }}
            className="bg-slate-800/30 border border-slate-700/50 p-12 rounded-[3rem] flex flex-col group hover:bg-slate-800/50 transition-all duration-500"
          >
            <div className="w-20 h-20 bg-blue-500/10 rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
              <Users className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-3xl font-display font-bold mb-6">Visite Guidée</h3>
            <p className="text-lg text-slate-400 mb-12 flex-1 leading-relaxed">
              Réservez un créneau de 15 minutes avec l&apos;un de nos experts pour une présentation personnalisée adaptée à vos défis.
            </p>
            <Link 
              href="/contact"
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/20"
            >
              Réserver un créneau
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Mobile Experience */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ y: -15 }}
            className="bg-slate-800/30 border border-slate-700/50 p-12 rounded-[3rem] flex flex-col group hover:bg-slate-800/50 transition-all duration-500"
          >
            <div className="w-20 h-20 bg-purple-500/10 rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
              <Smartphone className="w-10 h-10 text-purple-500" />
            </div>
            <h3 className="text-3xl font-display font-bold mb-6">Expérience Mobile</h3>
            <p className="text-lg text-slate-400 mb-12 flex-1 leading-relaxed">
              Découvrez comment SyntixPharma s&apos;adapte à vos tablettes et smartphones pour une gestion fluide en mobilité.
            </p>
            <button className="w-full py-5 bg-purple-600 text-white rounded-2xl font-bold text-lg hover:bg-purple-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-purple-600/20">
              Scanner le QR Code
              <Smartphone className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Features Preview - Minimalist */}
        <div className="mt-48 grid md:grid-cols-3 gap-20">
          {[
            { icon: Zap, title: 'Vitesse Éclair', desc: 'Interface optimisée pour des transactions en moins de 3 secondes.' },
            { icon: ShieldCheck, title: 'Sécurité Bancaire', desc: 'Chiffrement de bout en bout et sauvegardes automatiques quotidiennes.' },
            { icon: BarChart3, title: 'Analyses IA', desc: 'Prédictions intelligentes pour optimiser votre trésorerie et vos stocks.' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-500 transition-colors duration-500">
                <item.icon className="w-8 h-8 text-emerald-500 group-hover:text-slate-900 transition-colors duration-500" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-white uppercase tracking-widest">{item.title}</h4>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}