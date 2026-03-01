'use client';

import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, Globe, Clock, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen pt-32 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-20 items-start">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black mb-4 border border-emerald-100 uppercase tracking-[0.2em]">
              Contact
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 mb-4 tracking-[-0.04em] leading-[0.9]">
              Parlons de <br />
              <span className="text-emerald-600">Demain.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-8  leading-relaxed font-medium">
              Vous avez des questions sur SyntixPharma ? Notre équipe d&apos;experts est là pour vous accompagner dans votre transformation numérique.
            </p>

            <div className="space-y-4 mb-4">
              <div className="flex gap-8 group">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors shrink-0">
                  <Mail className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Email</p>
                  <p className="text-lg font-bold text-slate-900">contact@medpharma.cd</p>
                  <p className="text-slate-500">support@medpharma.cd</p>
                </div>
              </div>

              <div className="flex gap-8 group">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors shrink-0">
                  <Phone className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Téléphone</p>
                  <p className="text-lg font-bold text-slate-900">+243 99 000 0000</p>
                  <p className="text-slate-500">+257 22 00 00 00</p>
                </div>
              </div>

              <div className="flex gap-8 group">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-50 transition-colors shrink-0">
                  <MapPin className="w-6 h-6 text-slate-400 group-hover:text-purple-600 transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Bureaux</p>
                  <p className="text-lg font-bold text-slate-900">Kinshasa : Gombe</p>
                  <p className="text-slate-500">Bujumbura : Centre-ville</p>
                </div>
              </div>
            </div>

            <div className="py-6 px-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <h4 className="text-xl font-display font-bold mb-0.5">Besoin d&apos;une démo ?</h4>
              <p className="text-slate-400 text-sm mb-2.5 leading-relaxed">Nos experts peuvent vous faire une présentation complète adaptée à vos besoins.</p>
              <button className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-3 shadow-xl shadow-emerald-600/20">
                Réserver une démo
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-slate-50 p-10 lg:p-20 rounded-[4rem] border border-slate-100 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]"></div>
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-20"
                >
                  <div className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl shadow-emerald-500/10">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h2 className="text-4xl font-display font-bold text-slate-900 mb-6 tracking-tight">Message Envoyé !</h2>
                  <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-md">
                    Merci de nous avoir contactés. Un expert SyntixPharma vous répondra dans les plus brefs délais.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-900/10"
                  >
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                  <div className="grid sm:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Nom Complet</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full px-8 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
                        placeholder="Jean Mukasa"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Email</label>
                      <input 
                        type="email" 
                        required 
                        className="w-full px-8 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
                        placeholder="jean@pharmacie.cd"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Pharmacie</label>
                      <input 
                        type="text" 
                        className="w-full px-8 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
                        placeholder="Pharmacie de la Paix"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Sujet</label>
                      <div className="relative">
                        <select className="w-full px-8 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none cursor-pointer shadow-sm">
                          <option>Demande de Démo</option>
                          <option>Question sur les Tarifs</option>
                          <option>Support Technique</option>
                          <option>Partenariat</option>
                          <option>Autre</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ChevronRight className="w-5 h-5 text-slate-400 rotate-90" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Message</label>
                    <textarea 
                      required 
                      rows={6}
                      className="w-full px-8 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none transition-all shadow-sm"
                      placeholder="Comment pouvons-nous vous aider ?"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-bold text-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-4 disabled:opacity-70 shadow-2xl shadow-emerald-600/20 group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Envoyer le Message
                        <Send className="w-6 h-6 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Office Locations */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black mb-4 border border-slate-100 uppercase tracking-[0.2em]">
              Présence Locale
            </div>
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-slate-900 mb-4 tracking-tight">Nos <span className="text-emerald-600">Bureaux.</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { city: "Kinshasa", address: "Avenue de la Justice, Gombe", phone: "+243 81 000 0000", email: "kin@medpharma.cd" },
              { city: "Lubumbashi", address: "Avenue Mobutu, Centre-Ville", phone: "+243 81 000 0001", email: "lsh@medpharma.cd" },
              { city: "Abidjan", address: "Plateau, Rue des Banques", phone: "+225 07 00 00 00", email: "abj@medpharma.cd" },
            ].map((office, i) => (
              <div key={i} className="p-10 rounded-[3rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl transition-all duration-500">
                <h3 className="text-3xl font-display font-bold text-slate-900 mb-2">{office.city}</h3>
                <div className="space-y-1 text-slate-500 font-medium">
                  <p className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    {office.address}
                  </p>
                  <p className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-emerald-600" />
                    {office.phone}
                  </p>
                  <p className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-emerald-600" />
                    {office.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}