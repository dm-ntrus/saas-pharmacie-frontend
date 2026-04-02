"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock, Send, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PLATFORM } from "@/config/platform";

const contacts = [
  {
    icon: Mail,
    title: "Email",
    value: PLATFORM.email.contact,
    href: `mailto:${PLATFORM.email.contact}`,
  },
  {
    icon: Phone,
    title: "Téléphone",
    value: "+243 99 000 0000",
    href: "tel:+243990000000",
  },
  {
    icon: MapPin,
    title: "Adresse",
    value: "Kinshasa, RD Congo",
    href: "#",
  },
  {
    icon: Clock,
    title: "Horaires",
    value: "Lun – Ven · 8h – 18h",
    href: "#",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-3">
              Contact
            </p>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">
              Parlons de votre{" "}
              <span className="text-emerald-600">projet.</span>
            </h1>
            <p className="text-base text-slate-500 font-medium leading-relaxed">
              Notre équipe est disponible pour répondre à toutes vos questions
              et vous accompagner dans votre transition numérique.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact cards */}
          <div className="lg:col-span-2 space-y-4">
            {contacts.map((c) => (
              <a
                key={c.title}
                href={c.href}
                className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg hover:border-emerald-200 transition-all group"
              >
                <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-emerald-50 transition-colors">
                  <c.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">
                    {c.title}
                  </p>
                  <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                    {c.value}
                  </p>
                </div>
              </a>
            ))}

            <div className="p-5 bg-slate-900 rounded-2xl text-white mt-4">
              <h3 className="font-bold text-sm mb-2">Support technique</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-3">
                Déjà client ? Accédez à notre portail de support pour une
                assistance prioritaire.
              </p>
              <Link
                href="/support"
                className="text-emerald-400 text-sm font-bold inline-flex items-center gap-1 hover:text-emerald-300 transition-colors"
              >
                Accéder au support
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="bg-slate-50 rounded-3xl border border-slate-100 p-6 sm:p-10"
            >
              <h2 className="text-xl font-display font-bold text-slate-900 mb-6">
                Envoyez-nous un message
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                    placeholder="Dr. Jean Dupont"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                    placeholder="jean@pharmacie.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                    placeholder="+243 99 000 0000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Sujet
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all">
                    <option>Demande de démo</option>
                    <option>Question tarifs</option>
                    <option>Partenariat</option>
                    <option>Support technique</option>
                    <option>Autre</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                  placeholder="Décrivez votre besoin..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
