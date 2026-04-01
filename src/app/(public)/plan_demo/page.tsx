"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Monitor, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const benefits = [
  "Démonstration personnalisée de 30 min",
  "Configuration adaptée à votre pharmacie",
  "Questions / réponses en direct",
  "Plan de migration gratuit",
  "Aucun engagement",
];

export default function PlanDemoPage() {
  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-3">
                Découvrir
              </p>
              <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight leading-[1.05]">
                Planifiez une{" "}
                <span className="text-emerald-600">démo</span> gratuite.
              </h1>
              <p className="text-base text-slate-500 leading-relaxed font-medium mb-8 max-w-md">
                Découvrez comment SyntixPharma peut transformer votre pharmacie
                lors d&apos;une session personnalisée avec un de nos experts.
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-6 mb-8">
              {[
                { icon: Clock, text: "30 minutes" },
                { icon: Monitor, text: "En visioconférence" },
                { icon: Calendar, text: "Horaire flexible" },
              ].map((b) => (
                <span
                  key={b.text}
                  className="inline-flex items-center gap-2 text-sm text-slate-600 font-medium"
                >
                  <b.icon className="w-4 h-4 text-emerald-600" />
                  {b.text}
                </span>
              ))}
            </div>

            <ul className="space-y-3 mb-8">
              {benefits.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-3 text-sm text-slate-700"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-medium">{b}</span>
                </li>
              ))}
            </ul>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-sm text-slate-500 leading-relaxed">
                &quot;La démo nous a convaincus en 15 minutes. L&apos;interface est
                tellement intuitive que notre équipe était opérationnelle le jour
                même.&quot;
              </p>
              <p className="text-sm font-bold text-slate-700 mt-3">
                — Dr. Amisi, Pharmacie de la Paix
              </p>
            </div>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form
              onSubmit={(e) => e.preventDefault()}
              className="bg-slate-50 rounded-3xl border border-slate-100 p-6 sm:p-10"
            >
              <h2 className="text-xl font-display font-bold text-slate-900 mb-6">
                Réservez votre créneau
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                    placeholder="Dr. Jean Dupont"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Email professionnel
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                    placeholder="jean@pharmacie.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                    placeholder="+243 99 000 0000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Nom de la pharmacie
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                    placeholder="Pharmacie Centrale"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Créneau préféré
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500">
                    <option>Matin (8h – 12h)</option>
                    <option>Après-midi (13h – 17h)</option>
                    <option>Soir (17h – 19h)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                Réserver ma démo
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-xs text-slate-400 text-center mt-4">
                Gratuit · Sans engagement · Réponse sous 24h
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
