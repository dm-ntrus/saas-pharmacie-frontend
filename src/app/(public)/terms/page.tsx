'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black mb-8 border border-emerald-100 uppercase tracking-[0.2em]">
            Légal
          </div>
          <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 mb-8 tracking-[-0.04em] leading-[0.9]">
            Conditions <br />
            <span className="text-emerald-600">d&apos;Utilisation</span>
          </h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed">
              Les présentes conditions régissent votre utilisation de la plateforme SyntixPharma. En utilisant nos services, vous acceptez de respecter ces règles conçues pour assurer la sécurité et l&apos;efficacité de tous.
            </p>

            <div className="space-y-10">
              <section className="grid lg:grid-cols-12 gap-10 border-t border-slate-100 pt-16">
                <div className="lg:col-span-4">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">01. Acceptation</h2>
                </div>
                <div className="lg:col-span-8">
                  <h3 className="text-3xl font-display font-bold text-slate-900 mb-6">Engagement mutuel</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    En accédant et en utilisant la plateforme SyntixPharma, vous acceptez d&apos;être lié par les présentes conditions d&apos;utilisation. Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser nos services. L&apos;utilisation de la plateforme implique une adhésion pleine et entière.
                  </p>
                </div>
              </section>

              <section className="grid lg:grid-cols-12 gap-10 border-t border-slate-100 pt-16">
                <div className="lg:col-span-4">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">02. Services</h2>
                </div>
                <div className="lg:col-span-8">
                  <h3 className="text-3xl font-display font-bold text-slate-900 mb-6">Description de l&apos;offre</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    SyntixPharma fournit un logiciel de gestion de pharmacie en mode SaaS (Software as a Service). Le service comprend la gestion des stocks, des ventes, des patients et des prescriptions, ainsi que des outils d&apos;analyse avancés.
                  </p>
                </div>
              </section>

              <section className="grid lg:grid-cols-12 gap-10 border-t border-slate-100 pt-16">
                <div className="lg:col-span-4">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">03. Responsabilité</h2>
                </div>
                <div className="lg:col-span-8">
                  <h3 className="text-3xl font-display font-bold text-slate-900 mb-6">Vos obligations</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    L&apos;utilisateur est responsable de la confidentialité de ses identifiants de connexion et de toutes les activités effectuées sous son compte. L&apos;utilisateur s&apos;engage à fournir des informations exactes et à jour concernant sa pharmacie et sa licence professionnelle.
                  </p>
                </div>
              </section>

              <section className="grid lg:grid-cols-12 gap-10 border-t border-slate-100 pt-16">
                <div className="lg:col-span-4">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">04. Données</h2>
                </div>
                <div className="lg:col-span-8">
                  <h3 className="text-3xl font-display font-bold text-slate-900 mb-6">Propriété et protection</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    SyntixPharma s&apos;engage à protéger les données de santé des patients conformément aux réglementations locales en vigueur. L&apos;utilisateur reste le propriétaire exclusif des données et SyntixPharma agit en tant que prestataire de services technique.
                  </p>
                </div>
              </section>
            </div>

            <div className="mt-32 pt-16 border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Dernière mise à jour : 21 Février 2026</p>
              {/* <Link href="/" className="text-emerald-600 font-black uppercase tracking-widest text-sm hover:text-emerald-700 transition-colors">Retour à l&apos;accueil</Link> */}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
